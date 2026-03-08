'use client';

import { MinimalistHero } from '@/components/hero/MinimalistHero';

// 네비게이션 링크
const navLinks = [
  { label: 'FEATURES', href: '#features' },
  { label: 'PRICING', href: '#pricing' },
  { label: 'CONTACT', href: '#contact' },
];

export default function Home() {
  return (
    <MinimalistHero
      logoText="MUSIC"
      navLinks={navLinks}
      mainText="Generate original, royalty-free music for your YouTube videos in seconds — powered by AI, crafted for creators."
      readMoreLink="/auth"
      imageSrc="https://ik.imagekit.io/fpxbgsota/image%2013.png?updatedAt=1753531863793"
      imageAlt="A portrait of a person in a black turtleneck, in profile."
      overlayText={{
        part1: 'YOUR',
        part2: 'SOUND',
      }}
    />
  );
}