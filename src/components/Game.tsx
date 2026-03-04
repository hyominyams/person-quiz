"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GameMode } from "@/app/page";
import { characters } from "@/data/characters";
import { Timer, Mic, Volume2, XCircle } from "lucide-react";

interface GameProps {
    mode: GameMode;
    onExit: () => void;
}

export default function Game({ mode, onExit }: GameProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [shuffledChars, setShuffledChars] = useState([...characters]);
    const [timeLeft, setTimeLeft] = useState(10);
    const [userInput, setUserInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [gameState, setGameState] = useState<"playing" | "correct" | "wrong" | "timeout" | "ended">("playing");
    const [score, setScore] = useState(0);

    const recognitionRef = useRef<any>(null);

    // Initialize and shuffle
    useEffect(() => {
        setShuffledChars([...characters].sort(() => Math.random() - 0.5));
    }, []);

    // Timer logic
    useEffect(() => {
        if (gameState !== "playing") return;

        if (timeLeft <= 0) {
            setGameState("timeout");
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(t => t - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, gameState]);

    // Speech Recognition setup
    useEffect(() => {
        if (typeof window !== "undefined" && mode === "speaking") {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.lang = "ko-KR";
                recognition.continuous = true;
                recognition.interimResults = false;

                recognition.onresult = (event: any) => {
                    const current = event.resultIndex;
                    const transcript = event.results[current][0].transcript.trim().replace(/\s+/g, "");
                    setUserInput(transcript);
                    checkAnswer(transcript);
                };

                recognition.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error);
                    setIsListening(false);
                };

                recognition.onend = () => {
                    setIsListening(false);
                };

                recognitionRef.current = recognition;
                startListening();
            }
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [mode, currentIndex]);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e) {
                // Recognition already started
            }
        }
    };

    const currentChar = shuffledChars[currentIndex];

    const isAnswerCorrect = (inputVal: string) => {
        if (!currentChar) return false;
        const normalizedInput = inputVal.replace(/\s+/g, "").toLowerCase();
        const normalizedAnswer = currentChar.name.replace(/\s+/g, "").toLowerCase();

        if (normalizedInput.includes(normalizedAnswer)) return true;

        if ('synonyms' in currentChar && Array.isArray(currentChar.synonyms)) {
            return currentChar.synonyms.some((synonym: string) => {
                const normalizedSynonym = synonym.replace(/\s+/g, "").toLowerCase();
                return normalizedInput.includes(normalizedSynonym);
            });
        }
        return false;
    };

    const checkAnswer = (inputVal: string) => {
        if (gameState !== "playing") return;

        if (isAnswerCorrect(inputVal)) {
            setGameState("correct");
            setScore(s => s + 1);
            setTimeout(nextQuestion, 1500);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (gameState !== "playing") return;

        if (isAnswerCorrect(userInput)) {
            setGameState("correct");
            setScore(s => s + 1);
            setTimeout(nextQuestion, 1500);
        } else {
            setGameState("wrong");
            setTimeout(nextQuestion, 1500);
        }
    };

    const nextQuestion = () => {
        if (currentIndex + 1 >= shuffledChars.length) {
            setGameState("ended");
        } else {
            setCurrentIndex(i => i + 1);
            setTimeLeft(10);
            setUserInput("");
            setGameState("playing");
            if (mode === "speaking") {
                startListening();
            }
        }
    };

    // Sound effects logic placeholder
    useEffect(() => {
        if (gameState === "correct") {
            // play ding ding ding
        } else if (gameState === "wrong" || gameState === "timeout") {
            // play ddaeng (buzzer)
        }
    }, [gameState]);

    return (
        <div className="flex flex-col items-center min-h-screen bg-[#0a0a0a] text-zinc-100 relative p-4 font-sans selection:bg-indigo-500/30">
            {/* Ambient background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Header */}
            <header className="w-full max-w-5xl flex justify-between items-center py-6 px-4 mb-4 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 shadow-lg">
                        <span className="text-xl font-bold text-white">Q</span>
                    </div>
                    <h2 className="text-xl font-medium tracking-wide text-zinc-200">
                        인물 퀴즈
                    </h2>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Score</span>
                        <div className="text-2xl font-bold text-white leading-none">
                            {score}
                        </div>
                    </div>
                    <div className="w-px h-8 bg-white/10 mx-2" />
                    <Button variant="ghost" onClick={onExit} className="text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                        나가기
                    </Button>
                </div>
            </header>

            {/* Main Game Area */}
            <main className="flex-1 w-full max-w-5xl flex flex-col items-center justify-center z-10 pb-12">
                {gameState === "ended" ? (
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center justify-center bg-zinc-900/50 p-16 rounded-[3rem] border border-white/10 backdrop-blur-xl shadow-2xl"
                    >
                        <h1 className="text-5xl font-bold mb-4 text-white tracking-tight">게임 완료</h1>
                        <p className="text-2xl text-zinc-400 mb-12">최종 기록: <span className="text-white font-bold">{score}</span> <span className="text-lg">/ {shuffledChars.length}</span></p>
                        <Button size="lg" onClick={onExit} className="text-lg px-10 py-7 rounded-2xl bg-white text-black hover:bg-zinc-200 font-semibold transition-all">
                            메인으로 돌아가기
                        </Button>
                    </motion.div>
                ) : (
                    <div className="w-full flex flex-col items-center">
                        {/* Status Bar: Question Number & Timer */}
                        <div className="w-full max-w-2xl px-6 py-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center mb-10 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="px-3 py-1 rounded-lg bg-white/10 text-sm font-semibold text-zinc-300">
                                    Q {currentIndex + 1}
                                </div>
                                <span className="text-zinc-500 text-sm">of {shuffledChars.length}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full ${timeLeft <= 3 ? "bg-red-500" : "bg-indigo-500"}`}
                                        initial={{ width: "100%" }}
                                        animate={{ width: `${(timeLeft / 10) * 100}%` }}
                                        transition={{ duration: 1, ease: "linear" }}
                                    />
                                </div>
                                <div className={`flex items-center gap-1.5 font-mono text-xl font-medium w-16 justify-end ${timeLeft <= 3 ? "text-red-400" : "text-zinc-300"}`}>
                                    <Timer className="w-5 h-5 opacity-70" />
                                    {timeLeft}
                                </div>
                            </div>
                        </div>

                        {/* Character Image Card */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="relative w-72 h-96 md:w-[26rem] md:h-[34rem] rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-12 bg-zinc-900/50 flex items-center justify-center backdrop-blur-sm group"
                            >
                                {currentChar ? (
                                    <div
                                        className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                        style={{ backgroundImage: `url("${encodeURI(currentChar.image)}")` }}
                                    />
                                ) : null}

                                {/* Overlay for Correct/Wrong */}
                                <AnimatePresence>
                                    {gameState === "correct" && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-emerald-500/20 flex flex-col items-center justify-center backdrop-blur-md border-[4px] border-emerald-500/50 rounded-[2rem]"
                                        >
                                            <motion.div initial={{ scale: 0.5, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)] mb-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </motion.div>
                                            <span className="text-3xl font-bold text-white tracking-wide">정답</span>
                                        </motion.div>
                                    )}
                                    {gameState === "wrong" && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-red-500/20 flex flex-col items-center justify-center backdrop-blur-md border-[4px] border-red-500/50 rounded-[2rem]"
                                        >
                                            <motion.div initial={{ scale: 0.5, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.4)] mb-4">
                                                <XCircle className="text-white w-12 h-12" />
                                            </motion.div>
                                        </motion.div>
                                    )}
                                    {gameState === "timeout" && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-zinc-950/80 flex items-center justify-center backdrop-blur-lg rounded-[2rem]"
                                        >
                                            <span className="flex flex-col items-center text-center">
                                                <span className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-2">Time's Up</span>
                                                <span className="text-4xl font-light text-white mb-8">{currentChar.name}</span>
                                            </span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </AnimatePresence>

                        {/* Input Area */}
                        <div className="w-full max-w-lg z-10">
                            {mode === "typing" ? (
                                <form onSubmit={handleSubmit} className="relative flex items-center group">
                                    <Input
                                        type="text"
                                        placeholder="이름을 입력하세요"
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        disabled={gameState !== "playing"}
                                        autoFocus
                                        className="text-xl p-8 rounded-[1.5rem] pr-32 bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:bg-white/10 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all text-center h-16 shadow-inner"
                                    />
                                    <Button
                                        type="submit"
                                        disabled={gameState !== "playing" || !userInput}
                                        className="absolute right-2 top-2 bottom-2 h-auto px-6 rounded-xl bg-white text-black hover:bg-zinc-200 font-medium transition-all"
                                    >
                                        확인
                                    </Button>
                                </form>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <div className={`p-6 rounded-3xl mb-4 flex items-center justify-center ${isListening ? 'bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)]' : 'bg-transparent'} border border-white/10 transition-all duration-300 backdrop-blur-sm`}>
                                        <div className={`p-4 rounded-full ${isListening ? 'bg-white' : 'bg-white/5'}`}>
                                            {isListening ? <Volume2 className="w-8 h-8 text-black animate-pulse" /> : <Mic className="w-8 h-8 text-zinc-500" />}
                                        </div>
                                    </div>
                                    <div className="text-xl font-medium text-zinc-300 text-center min-h-[3rem] px-8">
                                        {userInput ? (
                                            <span className="text-white drop-shadow-md">{userInput}</span>
                                        ) : (
                                            <span className="text-zinc-600 font-light">마이크에 대고 말해주세요</span>
                                        )}
                                    </div>
                                    {!isListening && gameState === "playing" && (
                                        <Button
                                            onClick={startListening}
                                            variant="ghost"
                                            className="mt-4 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10"
                                        >
                                            <Mic className="mr-2 w-4 h-4" /> 다시 듣기
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
