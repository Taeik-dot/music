import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';
import { createClient } from '@/lib/supabase/server';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: NextRequest) {
  try {
    const {
      prompt,
      lyrics,
      duration = 90,
      batch_size = 1,
      title
    } = await req.json();

    // title이 주어지지 않은 경우, prompt의 첫 부분(최대 30자)을 제목으로 사용
    const defaultTitle = title || (prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt);

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Replicate를 사용하여 음악 생성
    // 가사가 없으면 연주곡([inst])으로 설정
    const finalLyrics = lyrics || `[inst]\n${prompt}`;

    const input = {
      caption: prompt,
      lyrics: finalLyrics,
      duration: duration,
      batch_size: batch_size,
      timeout_seconds: 1800 // 타임아웃 넉넉히 설정
    };

    const output = await replicate.run(
      "visoar/ace-step-1.5:fd851baef553cb1656f4a05e8f2f8641672f10bc808718f5718b4b4bb2b07794",
      { input }
    ) as any;

    // 2. 출력 처리 (단일 URL 또는 URL 배열)
    let audioUrls: string[] = [];
    if (Array.isArray(output)) {
      audioUrls = output.map(item => typeof item.url === 'function' ? item.url() : String(item));
    } else if (typeof output === 'string') {
      audioUrls = [output];
    } else if (output && typeof output.url === 'function') {
      audioUrls = [output.url()];
    }

    if (audioUrls.length === 0) {
      throw new Error('Failed to obtain a valid audio URL from Replicate');
    }

    // 3. 각 오디오 URL에 대해 저장 처리 (병렬 실행)
    const processAudio = async (url: string, index: number) => {
      // 오디오 다운로드
      const audioResponse = await fetch(url);
      if (!audioResponse.ok) throw new Error(`Failed to download audio ${index + 1} from Replicate`);
      const audioBlob = await audioResponse.blob();

      const timestamp = Date.now();
      const fileName = `${user.id}/${timestamp}_${index}.mp3`;

      // Supabase Storage 업로드
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('musics')
        .upload(fileName, audioBlob, {
          contentType: 'audio/mpeg',
          upsert: true
        });

      if (uploadError) {
        console.error(`Storage upload error (${index}):`, uploadError);
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      // DB 저장
      const { data: { publicUrl } } = supabase.storage.from('musics').getPublicUrl(fileName);

      const trackTitle = batch_size > 1 ? `${defaultTitle} (${index + 1})` : defaultTitle;

      const { data: musicData, error: dbError } = await supabase
        .from('musics')
        .insert({
          user_id: user.id,
          title: trackTitle,
          prompt: prompt,
          file_url: publicUrl,
          duration: duration,
        })
        .select()
        .single();

      if (dbError) {
        console.error(`Database insert error (${index}):`, dbError);
        throw new Error(`Database record creation failed: ${dbError.message}`);
      }

      return musicData;
    };

    const results = await Promise.all(audioUrls.map((url, i) => processAudio(url, i)));

    // batch_size가 1이면 단일 객체, 그 이상이면 배열 반환
    return NextResponse.json(batch_size === 1 ? results[0] : results);

  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate music' }, { status: 500 });
  }
}
