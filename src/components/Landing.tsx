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
        <div className="flex flex-col items-center justify-center min-h-screen relative bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
            {/* Marquee Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 flex flex-col justify-center gap-4 group cursor-pointer" style={{ pointerEvents: 'auto' }}>
                <div className="flex w-[200%] animate-marquee group-hover:[animation-play-state:paused]">
                    {characters.map((char, i) => (
                        <div
                            key={`row1-${i}`}
                            className="w-48 h-64 bg-white/10 rounded-xl m-2 border-2 border-white/20 flex-shrink-0"
                            style={{
                                backgroundImage: `url(${char.image})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        />
                    ))}
                    {characters.map((char, i) => (
                        <div
                            key={`row1-clone-${i}`}
                            className="w-48 h-64 bg-white/10 rounded-xl m-2 border-2 border-white/20 flex-shrink-0"
                            style={{
                                backgroundImage: `url(${char.image})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Hero Content */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
                className="z-10 bg-black/50 p-12 rounded-3xl backdrop-blur-md border border-white/20 text-center shadow-2xl"
            >
                <motion.h1
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="text-6xl md:text-8xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] tracking-tighter"
                >
                    예능 인물 퀴즈!
                </motion.h1>

                <p className="text-2xl md:text-4xl font-bold mb-12 text-yellow-200 drop-shadow-md">
                    "이 사람은 누구일까요?"
                </p>

                <div className="flex flex-col md:flex-row gap-6 justify-center mt-8">
                    <Button
                        size="lg"
                        onClick={() => onStart("typing")}
                        className="text-xl px-8 py-8 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 transition-all"
                    >
                        <Keyboard className="mr-2 w-6 h-6" />
                        타이핑 모드
                    </Button>

                    <Button
                        size="lg"
                        onClick={() => onStart("speaking")}
                        className="text-xl px-8 py-8 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-400 hover:to-orange-400 border-b-4 border-pink-700 active:border-b-0 active:translate-y-1 transition-all"
                    >
                        <Mic className="mr-2 w-6 h-6" />
                        말하기 모드
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
