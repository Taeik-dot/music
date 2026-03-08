'use client';

import React, { useState } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowUp, Paperclip, Square, X, StopCircle, Mic, Music, Clock, Layers, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Embedded CSS for minimal custom styles
const styles = `
  *:focus-visible {
    outline-offset: 0 !important;
    --ring-offset: 0 !important;
  }
  textarea::-webkit-scrollbar {
    width: 6px;
  }
  textarea::-webkit-scrollbar-track {
    background: transparent;
  }
  textarea::-webkit-scrollbar-thumb {
    background-color: #444444;
    border-radius: 3px;
  }
  textarea::-webkit-scrollbar-thumb:hover {
    background-color: #555555;
  }
`;

// Inject styles into document (client side only)
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}

// Textarea Component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string;
}
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
    <textarea
        className={cn(
            "flex w-full rounded-md border-none bg-transparent px-3 py-2.5 text-base text-gray-100 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] resize-none hover:scrollbar-thumb-[#555555]",
            className
        )}
        ref={ref}
        rows={1}
        {...props}
    />
));
Textarea.displayName = "Textarea";

// Tooltip Components
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef<
    React.ElementRef<typeof TooltipPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
    <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
            "z-50 overflow-hidden rounded-md border border-[#333333] bg-[#1F2023] px-3 py-1.5 text-sm text-white shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className
        )}
        {...props}
    />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// Dialog Components
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
            "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className
        )}
        {...props}
    />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                "fixed left-[50%] top-[50%] z-50 grid w-full max-w-[90vw] md:max-w-[600px] translate-x-[-50%] translate-y-[-50%] gap-4 border border-[#333333] bg-[#1F2023] p-6 shadow-xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-2xl",
                className
            )}
            {...props}
        >
            {children}
            <DialogPrimitive.Close className="absolute right-4 top-4 z-10 rounded-full bg-[#2E3033]/80 p-2 hover:bg-[#2E3033] transition-all">
                <X className="h-5 w-5 text-gray-200 hover:text-white" />
                <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>
    </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn("text-lg font-semibold leading-none tracking-tight text-gray-100", className)}
        {...props}
    />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost";
    size?: "default" | "sm" | "lg" | "icon";
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        const variantClasses = {
            default: "bg-white hover:bg-white/80 text-black",
            outline: "border border-[#444444] bg-transparent hover:bg-[#3A3A40]",
            ghost: "bg-transparent hover:bg-[#3A3A40]",
        };
        const sizeClasses = {
            default: "h-10 px-4 py-2",
            sm: "h-8 px-3 text-sm",
            lg: "h-12 px-6",
            icon: "h-8 w-8 rounded-full aspect-[1/1] p-0",
        };
        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                    variantClasses[variant],
                    sizeClasses[size],
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

// PromptInput Context and Components
interface PromptInputContextType {
    isLoading: boolean;
    value: string;
    setValue: (value: string) => void;
    maxHeight: number | string;
    onSubmit?: () => void;
    disabled?: boolean;
}
const PromptInputContext = React.createContext<PromptInputContextType>({
    isLoading: false,
    value: "",
    setValue: () => { },
    maxHeight: 240,
    onSubmit: undefined,
    disabled: false,
});
function usePromptInput() {
    const context = React.useContext(PromptInputContext);
    if (!context) throw new Error("usePromptInput must be used within a PromptInput");
    return context;
}

interface PromptInputProps {
    isLoading?: boolean;
    value?: string;
    onValueChange?: (value: string) => void;
    maxHeight?: number | string;
    onSubmit?: () => void;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    onDragOver?: (e: React.DragEvent) => void;
    onDragLeave?: (e: React.DragEvent) => void;
    onDrop?: (e: React.DragEvent) => void;
}
const PromptInput = React.forwardRef<HTMLDivElement, PromptInputProps>(
    (
        {
            className,
            isLoading = false,
            maxHeight = 240,
            value,
            onValueChange,
            onSubmit,
            children,
            disabled = false,
            onDragOver,
            onDragLeave,
            onDrop,
        },
        ref
    ) => {
        const [internalValue, setInternalValue] = React.useState(value || "");
        const handleChange = (newValue: string) => {
            setInternalValue(newValue);
            onValueChange?.(newValue);
        };
        return (
            <TooltipProvider>
                <PromptInputContext.Provider
                    value={{
                        isLoading,
                        value: value ?? internalValue,
                        setValue: onValueChange ?? handleChange,
                        maxHeight,
                        onSubmit,
                        disabled,
                    }}
                >
                    <div
                        ref={ref}
                        className={cn(
                            "rounded-3xl border-transparent bg-[#1F2023] p-2 shadow-[0_8px_30px_rgba(0,0,0,0.24)] transition-all duration-300",
                            isLoading && "border-[#1EAEDB]/50",
                            className
                        )}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                    >
                        {children}
                    </div>
                </PromptInputContext.Provider>
            </TooltipProvider>
        );
    }
);
PromptInput.displayName = "PromptInput";

interface PromptInputTextareaProps {
    disableAutosize?: boolean;
    placeholder?: string;
}
const PromptInputTextarea: React.FC<PromptInputTextareaProps & React.ComponentProps<typeof Textarea>> = ({
    className,
    onKeyDown,
    disableAutosize = false,
    placeholder,
    ...props
}) => {
    const { value, setValue, maxHeight, onSubmit, disabled } = usePromptInput();
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
        if (disableAutosize || !textareaRef.current) return;
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height =
            typeof maxHeight === "number"
                ? `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`
                : `min(${textareaRef.current.scrollHeight}px, ${maxHeight})`;
    }, [value, maxHeight, disableAutosize]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit?.();
        }
        onKeyDown?.(e);
    };

    return (
        <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn("text-base", className)}
            disabled={disabled}
            placeholder={placeholder}
            {...props}
        />
    );
};

interface PromptInputActionsProps extends React.HTMLAttributes<HTMLDivElement> { }
const PromptInputActions: React.FC<PromptInputActionsProps> = ({ children, className, ...props }) => (
    <div className={cn("flex items-center gap-2", className)} {...props}>
        {children}
    </div>
);

interface PromptInputActionProps extends React.ComponentProps<typeof Tooltip> {
    tooltip: React.ReactNode;
    children: React.ReactNode;
    side?: "top" | "bottom" | "left" | "right";
    className?: string;
}
const PromptInputAction: React.FC<PromptInputActionProps> = ({
    tooltip,
    children,
    className,
    side = "top",
    ...props
}) => {
    const { disabled } = usePromptInput();
    return (
        <Tooltip {...props}>
            <TooltipTrigger asChild disabled={disabled}>
                {children}
            </TooltipTrigger>
            <TooltipContent side={side} className={className}>
                {tooltip}
            </TooltipContent>
        </Tooltip>
    );
};

// Custom Divider Component
const CustomDivider: React.FC = () => (
    <div className="relative h-6 w-[1.5px] mx-1">
        <div
            className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent rounded-full"
        />
    </div>
);

// Main PromptInputBox Component
interface PromptInputBoxProps {
    onSend?: (prompt: string, options: { lyrics?: string; duration?: number; batch_size?: number }) => void;
    isLoading?: boolean;
    placeholder?: string;
    className?: string;
}
export const PromptInputBox = React.forwardRef((props: PromptInputBoxProps, ref: React.Ref<HTMLDivElement>) => {
    const { onSend = () => { }, isLoading = false, placeholder = "Describe the music you want to create...", className } = props;
    const [input, setInput] = React.useState("");
    const [lyrics, setLyrics] = React.useState("");
    const [duration, setDuration] = React.useState(90); // default 90s
    const [batchSize, setBatchSize] = React.useState(1); // default 1
    
    const [showLyricsModal, setShowLyricsModal] = React.useState(false);
    const [activePopover, setActivePopover] = React.useState<"duration" | "batch" | null>(null);

    const handleSubmit = () => {
        if (input.trim()) {
            onSend(input, {
                lyrics: lyrics || undefined,
                duration,
                batch_size: batchSize
            });
            setInput("");
            // 옵션은 초기화하지 않고 유지할지 고민되지만, 일단 가사는 초기화
            setLyrics("");
        }
    };

    const hasContent = input.trim() !== "";

    return (
        <>
            <PromptInput
                value={input}
                onValueChange={setInput}
                isLoading={isLoading}
                onSubmit={handleSubmit}
                className={cn(
                    "w-full transition-all duration-300 ease-in-out bg-[#1A1A1D] border border-white/5",
                    className
                )}
                disabled={isLoading}
                ref={ref}
            >
                <div className="opacity-100">
                    <PromptInputTextarea
                        placeholder={placeholder}
                        className="text-base py-3"
                    />
                </div>

                <PromptInputActions className="flex items-center justify-between gap-2 p-1 pt-2">
                    <div className="flex items-center gap-1">
                        {/* Lyrics Toggle (Modal) */}
                        <button
                            type="button"
                            onClick={() => setShowLyricsModal(true)}
                            className={cn(
                                "rounded-full transition-all flex items-center gap-1.5 px-3 py-1.5 border h-9",
                                lyrics
                                    ? "bg-[#1EAEDB]/15 border-[#1EAEDB] text-[#1EAEDB]"
                                    : "bg-white/5 border-transparent text-white/40 hover:text-white/80 hover:bg-white/10"
                            )}
                        >
                            <FileText className="w-4 h-4" />
                            <span className="text-xs font-medium">Lyrics</span>
                            {lyrics && <div className="w-1.5 h-1.5 rounded-full bg-[#1EAEDB]" />}
                        </button>

                        <CustomDivider />

                        {/* Duration Popover */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setActivePopover(activePopover === "duration" ? null : "duration")}
                                className={cn(
                                    "rounded-full transition-all flex items-center gap-1.5 px-3 py-1.5 border h-9",
                                    activePopover === "duration"
                                        ? "bg-white/15 border-white/20 text-white"
                                        : "bg-white/5 border-transparent text-white/40 hover:text-white/80 hover:bg-white/10"
                                )}
                            >
                                <Clock className="w-4 h-4" />
                                <span className="text-xs font-medium">{duration / 60}m</span>
                            </button>
                            
                            <AnimatePresence>
                                {activePopover === "duration" && (
                                    <>
                                        <div className="fixed inset-0 z-30" onClick={() => setActivePopover(null)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute bottom-full mb-2 left-0 w-32 py-1.5 rounded-xl bg-[#1F2023] border border-white/10 shadow-2xl z-40 overflow-hidden"
                                        >
                                            {[60, 120, 180].map((sec) => (
                                                <button
                                                    key={sec}
                                                    onClick={() => {
                                                        setDuration(sec);
                                                        setActivePopover(null);
                                                    }}
                                                    className={cn(
                                                        "w-full text-left px-4 py-2 text-xs transition-colors",
                                                        duration === sec ? "bg-[#1EAEDB] text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                                                    )}
                                                >
                                                    {sec / 60} Minute{sec > 60 ? 's' : ''}
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        <CustomDivider />

                        {/* Batch Size Popover */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setActivePopover(activePopover === "batch" ? null : "batch")}
                                className={cn(
                                    "rounded-full transition-all flex items-center gap-1.5 px-3 py-1.5 border h-9",
                                    activePopover === "batch"
                                        ? "bg-white/15 border-white/20 text-white"
                                        : "bg-white/5 border-transparent text-white/40 hover:text-white/80 hover:bg-white/10"
                                )}
                            >
                                <Layers className="w-4 h-4" />
                                <span className="text-xs font-medium">{batchSize}</span>
                            </button>

                            <AnimatePresence>
                                {activePopover === "batch" && (
                                    <>
                                        <div className="fixed inset-0 z-30" onClick={() => setActivePopover(null)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute bottom-full mb-2 left-0 w-32 py-1.5 rounded-xl bg-[#1F2023] border border-white/10 shadow-2xl z-40 overflow-hidden"
                                        >
                                            {[1, 2, 3, 4].map((num) => (
                                                <button
                                                    key={num}
                                                    onClick={() => {
                                                        setBatchSize(num);
                                                        setActivePopover(null);
                                                    }}
                                                    className={cn(
                                                        "w-full text-left px-4 py-2 text-xs transition-colors",
                                                        batchSize === num ? "bg-[#1EAEDB] text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                                                    )}
                                                >
                                                    {num} Variation{num > 1 ? 's' : ''}
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <Button
                        variant="default"
                        size="icon"
                        className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
                            hasContent
                                ? "bg-[#1EAEDB] hover:bg-[#1EAEDB]/80 text-white"
                                : "bg-white/5 text-white/20"
                        )}
                        onClick={handleSubmit}
                        disabled={isLoading || !hasContent}
                    >
                        {isLoading ? (
                            <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <ArrowUp className="h-5 w-5" />
                        )}
                    </Button>
                </PromptInputActions>
            </PromptInput>

            {/* Lyrics Modal */}
            <Dialog open={showLyricsModal} onOpenChange={setShowLyricsModal}>
                <DialogContent>
                    <DialogTitle className="mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#1EAEDB]" />
                        Song Lyrics
                    </DialogTitle>
                    <p className="text-xs text-white/40 mb-4">
                        Add lyrics with tags like [Verse], [Chorus], or [Bridge] to guide the AI.
                    </p>
                    <textarea
                        value={lyrics}
                        onChange={(e) => setLyrics(e.target.value)}
                        placeholder="[Verse 1]
Walking down the neon street...

[Chorus]
Oh the lights are blinding me..."
                        className="w-full h-64 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#1EAEDB]/50 transition-colors resize-none"
                    />
                    <div className="flex justify-end gap-3 mt-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setLyrics("");
                                setShowLyricsModal(false);
                            }}
                            className="text-white/40 hover:text-white"
                        >
                            Clear
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => setShowLyricsModal(false)}
                            className="bg-[#1EAEDB] text-white hover:bg-[#1EAEDB]/80"
                        >
                            Save Lyrics
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
});
PromptInputBox.displayName = "PromptInputBox";
