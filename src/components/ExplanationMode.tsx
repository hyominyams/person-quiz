"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { characters } from "@/data/characters";
import { ArrowLeft, ArrowRight, Home, Star } from "lucide-react";

interface ExplanationModeProps {
    onExit: () => void;
}

export default function ExplanationMode({ onExit }: ExplanationModeProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : characters.length - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev < characters.length - 1 ? prev + 1 : 0));
    };

    const currentChar = characters[currentIndex];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen relative bg-[#0a0a0a] text-white p-4 md:p-8">
            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 h-full max-h-[900px]">
                {/* Left Section: Image and Navigation */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentChar.id}
                            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                            transition={{ duration: 0.5 }}
                            className="relative rounded-3xl overflow-hidden border border-white/10 bg-zinc-900/50 flex-1 min-h-[400px] lg:min-h-[500px]"
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                                style={{ backgroundImage: `url("${encodeURI(currentChar.image)}")` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                                <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg tracking-tight">
                                    {currentChar.name}
                                </h2>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Controls */}
                    <div className="flex items-center justify-between gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handlePrev}
                            className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Button>

                        <span className="text-zinc-400 font-medium tracking-widest text-sm">
                            {currentIndex + 1} / {characters.length}
                        </span>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleNext}
                            className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white"
                        >
                            <ArrowRight className="w-6 h-6" />
                        </Button>
                    </div>
                </div>

                {/* Right Section: Info Cards */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    {/* Header Controls */}
                    <div className="flex justify-end mb-2">
                        <Button
                            variant="ghost"
                            onClick={onExit}
                            className="text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl px-4 py-2"
                        >
                            <Home className="w-5 h-5 mr-2" />
                            메인으로 돌아가기
                        </Button>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`info-${currentChar.id}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="flex flex-col gap-6 flex-1"
                        >
                            {/* Core Value Card */}
                            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/30 p-8 rounded-3xl backdrop-blur-xl shadow-[0_0_40px_rgba(99,102,241,0.1)]">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                                        <Star className="w-6 h-6 text-indigo-400 fill-indigo-400/20" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-indigo-200 uppercase tracking-widest text-sm">핵심 가치</h3>
                                </div>
                                <p className="text-4xl md:text-5xl font-black text-white tracking-tight">
                                    {currentChar.coreValue}
                                </p>
                            </div>

                            {/* Elementary Description Card */}
                            <div className="bg-zinc-900/60 border border-white/5 p-8 rounded-3xl backdrop-blur-xl flex-1 flex flex-col">
                                <h3 className="text-xl font-semibold text-zinc-400 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-[2px] bg-zinc-700 block"></span>
                                    이 분은 어떤 분일까요?
                                </h3>
                                <p className="text-xl md:text-2xl leading-relaxed font-medium text-zinc-200">
                                    {currentChar.elementaryDescription}
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
