"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { characters } from "@/data/characters";
import { GameMode } from "@/app/page";
import { Mic, Keyboard, Settings2, Play } from "lucide-react";

interface LandingProps {
    onStart: (mode: GameMode, totalQuestions: number) => void;
}

export default function Landing({ onStart }: LandingProps) {
    const [step, setStep] = useState<"mode" | "questions">("mode");
    const [selectedMode, setSelectedMode] = useState<GameMode>(null);

    const handleModeSelect = (mode: GameMode) => {
        setSelectedMode(mode);
        setStep("questions");
    };

    const handleStart = (questionsCount: number) => {
        if (selectedMode) {
            onStart(selectedMode, questionsCount);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen relative bg-[#0a0a0a] text-white">
            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Marquee Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.15] flex flex-col justify-center gap-4 group cursor-pointer" style={{ pointerEvents: 'auto' }}>
                <div className="flex w-[200%] animate-marquee group-hover:[animation-play-state:paused]">
                    {characters.map((char, i) => (
                        <div
                            key={`row1-${i}`}
                            className="w-48 h-64 bg-white/5 rounded-2xl m-2 border border-white/10 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-500"
                            style={{
                                backgroundImage: `url("${encodeURI(char.image)}")`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        />
                    ))}
                    {characters.map((char, i) => (
                        <div
                            key={`row1-clone-${i}`}
                            className="w-48 h-64 bg-white/5 rounded-2xl m-2 border border-white/10 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-500"
                            style={{
                                backgroundImage: `url("${encodeURI(char.image)}")`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Hero Content */}
            <AnimatePresence mode="wait">
                {step === "mode" && (
                    <motion.div
                        key="mode-selection"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: -20, filter: "blur(10px)" }}
                        transition={{ type: "spring", stiffness: 100, damping: 20, duration: 0.8 }}
                        className="z-10 bg-black/40 p-12 md:p-16 rounded-[2.5rem] backdrop-blur-xl border border-white/10 text-center shadow-[0_0_80px_rgba(0,0,0,0.8)]"
                    >
                        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-medium tracking-wide text-zinc-300">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            프리미엄 퀴즈쇼
                        </div>

                        <motion.h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight">
                            예능 인물 퀴즈
                        </motion.h1>

                        <p className="text-xl md:text-2xl font-medium mb-12 text-zinc-400">
                            "이 사람은 누구일까요?"
                        </p>

                        <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
                            <Button
                                size="lg"
                                onClick={() => handleModeSelect("typing")}
                                className="text-lg px-8 py-8 rounded-2xl bg-white text-black hover:bg-zinc-200 transition-all font-semibold group"
                            >
                                <Keyboard className="mr-2 w-5 h-5 transition-transform group-hover:scale-110" />
                                타이핑 모드
                            </Button>

                            <Button
                                size="lg"
                                onClick={() => handleModeSelect("speaking")}
                                className="text-lg px-8 py-8 rounded-2xl bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700 transition-all font-semibold group"
                            >
                                <Mic className="mr-2 w-5 h-5 transition-transform group-hover:scale-110" />
                                말하기 모드
                            </Button>
                        </div>
                    </motion.div>
                )}

                {step === "questions" && (
                    <motion.div
                        key="questions-selection"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: -20, filter: "blur(10px)" }}
                        transition={{ type: "spring", stiffness: 100, damping: 20, duration: 0.6 }}
                        className="z-10 bg-black/40 p-12 md:p-16 rounded-[2.5rem] backdrop-blur-xl border border-white/10 text-center shadow-[0_0_80px_rgba(0,0,0,0.8)] w-full max-w-2xl"
                    >
                        <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 bg-zinc-800/80 text-sm font-medium tracking-wide text-zinc-300 cursor-pointer hover:bg-zinc-700 transition-colors" onClick={() => setStep("mode")}>
                            ← 모드 다시 선택
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white tracking-tight mt-4">
                            설정
                        </h2>

                        <p className="text-lg font-medium mb-12 text-zinc-400">
                            도전할 문제 수를 선택해주세요. (많을수록 라이프가 추가됩니다)
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-center mt-8">
                            <Button
                                size="lg"
                                onClick={() => handleStart(10)}
                                className="h-auto flex flex-col items-center justify-center p-8 rounded-2xl bg-zinc-800/80 border border-white/10 text-white hover:bg-zinc-700 hover:border-indigo-500/50 transition-all group"
                            >
                                <span className="text-4xl font-black mb-2 text-indigo-400">10</span>
                                <span className="text-sm font-medium text-zinc-400">문제 (라이프 3)</span>
                            </Button>

                            <Button
                                size="lg"
                                onClick={() => handleStart(20)}
                                className="h-auto flex flex-col items-center justify-center p-8 rounded-2xl bg-zinc-800/80 border border-white/10 text-white hover:bg-zinc-700 hover:border-emerald-500/50 transition-all group"
                            >
                                <span className="text-4xl font-black mb-2 text-emerald-400">20</span>
                                <span className="text-sm font-medium text-zinc-400">문제 (라이프 3)</span>
                            </Button>

                            <Button
                                size="lg"
                                onClick={() => handleStart(characters.length)}
                                className="h-auto flex flex-col items-center justify-center p-8 rounded-2xl bg-indigo-600 border border-indigo-500 text-white hover:bg-indigo-500 transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)] group"
                            >
                                <span className="text-4xl font-black mb-2 text-white">ALL</span>
                                <span className="text-sm font-medium text-indigo-200">27문제 (라이프 5)</span>
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
