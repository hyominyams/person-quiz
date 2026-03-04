"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { characters } from "@/data/characters";
import { GameMode } from "@/app/page";
import { Mic, Keyboard } from "lucide-react";

interface LandingProps {
    onStart: (mode: GameMode) => void;
}

export default function Landing({ onStart }: LandingProps) {
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
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20, duration: 0.8 }}
                className="z-10 bg-black/40 p-12 md:p-16 rounded-[2.5rem] backdrop-blur-xl border border-white/10 text-center shadow-[0_0_80px_rgba(0,0,0,0.8)]"
            >
                <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-medium tracking-wide text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    프리미엄 퀴즈쇼
                </div>

                <motion.h1
                    className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight"
                >
                    예능 인물 퀴즈
                </motion.h1>

                <p className="text-xl md:text-2xl font-medium mb-12 text-zinc-400">
                    "이 사람은 누구일까요?"
                </p>

                <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
                    <Button
                        size="lg"
                        onClick={() => onStart("typing")}
                        className="text-lg px-8 py-8 rounded-2xl bg-white text-black hover:bg-zinc-200 transition-all font-semibold group"
                    >
                        <Keyboard className="mr-2 w-5 h-5 transition-transform group-hover:scale-110" />
                        타이핑 모드
                    </Button>

                    <Button
                        size="lg"
                        onClick={() => onStart("speaking")}
                        className="text-lg px-8 py-8 rounded-2xl bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700 transition-all font-semibold group"
                    >
                        <Mic className="mr-2 w-5 h-5 transition-transform group-hover:scale-110" />
                        말하기 모드
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
