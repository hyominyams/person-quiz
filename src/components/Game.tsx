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
        <div className="flex flex-col items-center min-h-screen bg-slate-900 text-white relative p-4 font-sans">
            {/* Header */}
            <header className="w-full max-w-4xl flex justify-between items-center py-6 px-4 mb-4">
                <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-600 drop-shadow-sm">
                    예능 퀴즈쇼
                </h2>
                <div className="flex items-center gap-6">
                    <div className="text-xl font-bold rounded-full bg-slate-800 px-6 py-2 border-2 border-slate-700">
                        점수: <span className="text-green-400">{score}</span>
                    </div>
                    <Button variant="outline" onClick={onExit} className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl">
                        게임 종료
                    </Button>
                </div>
            </header>

            {/* Main Game Area */}
            <main className="flex-1 w-full max-w-4xl flex flex-col items-center">
                {gameState === "ended" ? (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center justify-center h-full gap-8 bg-slate-800 p-16 rounded-3xl border-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.5)]"
                    >
                        <h1 className="text-6xl font-black mb-4">게임 종료!</h1>
                        <p className="text-3xl">최종 점수: <span className="text-yellow-400 font-black">{score}</span> / {shuffledChars.length}</p>
                        <Button size="lg" onClick={onExit} className="text-2xl px-12 py-8 mt-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500">
                            처음으로
                        </Button>
                    </motion.div>
                ) : (
                    <div className="w-full flex flex-col items-center">
                        {/* Timer Progress Bar */}
                        <div className="w-full max-w-2xl bg-slate-800 h-6 rounded-full mb-8 overflow-hidden border border-slate-700">
                            <motion.div
                                className={`h-full ${timeLeft <= 3 ? "bg-red-500" : "bg-gradient-to-r from-emerald-400 to-emerald-600"}`}
                                initial={{ width: "100%" }}
                                animate={{ width: `${(timeLeft / 10) * 100}%` }}
                                transition={{ duration: 1, ease: "linear" }}
                            />
                        </div>

                        {/* Timer and Question Number */}
                        <div className="flex justify-between w-full max-w-2xl mb-4 px-2">
                            <div className="text-2xl font-bold text-slate-400">문제 {currentIndex + 1}/{shuffledChars.length}</div>
                            <div className="flex items-center gap-2 text-3xl font-black">
                                <Timer className={timeLeft <= 3 ? "text-red-500 animate-pulse w-8 h-8" : "w-8 h-8"} />
                                <span className={timeLeft <= 3 ? "text-red-500" : ""}>{timeLeft}초</span>
                            </div>
                        </div>

                        {/* Character Image Card */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ rotateY: 90, scale: 0.8 }}
                                animate={{ rotateY: 0, scale: 1 }}
                                exit={{ rotateY: -90, scale: 0.8 }}
                                transition={{ duration: 0.5, type: "spring" }}
                                className="relative w-72 h-96 md:w-96 md:h-[32rem] rounded-[2rem] overflow-hidden border-8 border-white shadow-2xl mb-12 bg-slate-800 flex items-center justify-center"
                            >
                                {currentChar ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={currentChar.image} alt="Guess the person" className="w-full h-full object-cover" />
                                ) : null}

                                {/* Overlay for Correct/Wrong */}
                                <AnimatePresence>
                                    {gameState === "correct" && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-emerald-500/80 flex items-center justify-center backdrop-blur-sm"
                                        >
                                            <span className="text-8xl font-black text-white drop-shadow-md">정답!</span>
                                        </motion.div>
                                    )}
                                    {gameState === "wrong" && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-red-500/80 flex items-center justify-center backdrop-blur-sm"
                                        >
                                            <XCircle className="text-white w-48 h-48 drop-shadow-md" />
                                        </motion.div>
                                    )}
                                    {gameState === "timeout" && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-orange-500/80 flex items-center justify-center backdrop-blur-sm"
                                        >
                                            <span className="text-7xl font-black text-white drop-shadow-md flex flex-col items-center text-center">
                                                <span>시간 초과!</span>
                                                <span className="text-3xl mt-4">정답: {currentChar.name}</span>
                                            </span>
                                            <Button onClick={nextQuestion} className="absolute bottom-8 mt-4 rounded-xl text-xl p-6 bg-white text-orange-600 hover:bg-slate-200">
                                                다음 문제
                                            </Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </AnimatePresence>

                        {/* Input Area */}
                        <div className="w-full max-w-xl">
                            {mode === "typing" ? (
                                <form onSubmit={handleSubmit} className="flex gap-4">
                                    <Input
                                        type="text"
                                        placeholder="이름을 입력하세요..."
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        disabled={gameState !== "playing"}
                                        autoFocus
                                        className="text-2xl p-8 rounded-2xl bg-white/10 border-2 border-white/20 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white/50 transition-all font-bold text-center"
                                    />
                                    <Button
                                        type="submit"
                                        disabled={gameState !== "playing" || !userInput}
                                        className="text-xl px-8 py-8 rounded-2xl bg-blue-600 hover:bg-blue-500"
                                    >
                                        확인
                                    </Button>
                                </form>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <div className={`p-8 rounded-full mb-6 ${isListening ? 'bg-pink-500 animate-pulse shadow-[0_0_30px_rgba(236,72,153,0.8)]' : 'bg-slate-700'} border-4 ${isListening ? 'border-pink-300' : 'border-slate-500'} transition-all`}>
                                        {isListening ? <Volume2 className="w-16 h-16 text-white" /> : <Mic className="w-16 h-16 text-slate-400" />}
                                    </div>
                                    <div className="text-2xl font-bold bg-slate-800 py-4 px-8 rounded-2xl border border-slate-700 text-center min-h-[4rem] min-w-[16rem]">
                                        {userInput ? userInput : <span className="text-slate-500">마이크에 대고 말해주세요...</span>}
                                    </div>
                                    {!isListening && gameState === "playing" && (
                                        <Button
                                            onClick={startListening}
                                            className="mt-6 bg-pink-600 rounded-xl text-lg hover:bg-pink-500"
                                        >
                                            <Mic className="mr-2 w-5 h-5" /> 다시 듣기
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
