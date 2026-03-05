"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GameMode } from "@/app/page";
import { characters } from "@/data/characters";
import { Timer, Mic, MicOff, Volume2, XCircle, Heart, Info, ArrowRight } from "lucide-react";

interface GameProps {
    mode: GameMode;
    totalQuestions: number;
    onExit: () => void;
}

type GameState = "playing" | "correct" | "wrong" | "timeout" | "description" | "ended";

const GAME_TIME_LIMIT = 30;
const DESCRIPTION_TIME_LIMIT = 10;
const HINT_REVEAL_TIME_LEFT = Math.floor(GAME_TIME_LIMIT / 2);
const DANGER_TIME_THRESHOLD = 5;

export default function Game({ mode, totalQuestions, onExit }: GameProps) {
    const isSpeechMode = mode === "speaking";
    const isDescriptionQuizMode = mode === "descriptionQuiz";
    const isTextInputMode = mode === "typing" || isDescriptionQuizMode;
    const supportsSpeechInput = isTextInputMode || isSpeechMode;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [shuffledChars, setShuffledChars] = useState([...characters]);
    const [timeLeft, setTimeLeft] = useState(GAME_TIME_LIMIT);
    const [userInput, setUserInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isMicEnabled, setIsMicEnabled] = useState(isSpeechMode);
    const [micError, setMicError] = useState<string | null>(null);
    const [gameState, setGameState] = useState<GameState>("playing");
    const [score, setScore] = useState(0);

    // New Feature States
    const [lives, setLives] = useState(totalQuestions > 20 ? 5 : 3);
    const [showHint, setShowHint] = useState(false);
    const [descriptionTimeLeft, setDescriptionTimeLeft] = useState(DESCRIPTION_TIME_LIMIT);

    const recognitionRef = useRef<any>(null);
    const hasAnsweredRef = useRef(false);
    const isListeningRef = useRef(false);
    const isMicEnabledRef = useRef(isSpeechMode);
    const gameStateRef = useRef<GameState>("playing");
    const restartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isManualStopRef = useRef(false);

    // Initialize and shuffle, slicing based on selected totalQuestions
    useEffect(() => {
        const shuffled = [...characters].sort(() => Math.random() - 0.5);
        setShuffledChars(shuffled.slice(0, totalQuestions));
    }, [totalQuestions]);

    // Timer logic for gameplay and description phase
    useEffect(() => {
        if (gameState === "playing") {
            if (timeLeft <= 0) {
                handleWrongOrTimeout("timeout");
                return;
            }
            // Show hint after half of the total time has elapsed.
            if (timeLeft === HINT_REVEAL_TIME_LEFT && !showHint) {
                setShowHint(true);
            }

            const timer = setInterval(() => {
                setTimeLeft(t => t - 1);
            }, 1000);
            return () => clearInterval(timer);
        }

        if (gameState === "description") {
            if (descriptionTimeLeft <= 0) {
                nextQuestion();
                return;
            }
            const timer = setInterval(() => {
                setDescriptionTimeLeft(t => t - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft, descriptionTimeLeft, gameState, showHint]);

    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    useEffect(() => {
        isMicEnabledRef.current = isMicEnabled;
    }, [isMicEnabled]);

    const clearRestartTimer = () => {
        if (restartTimeoutRef.current) {
            clearTimeout(restartTimeoutRef.current);
            restartTimeoutRef.current = null;
        }
    };

    const startListening = () => {
        if (!recognitionRef.current) return;
        if (!isMicEnabledRef.current) return;
        if (gameStateRef.current !== "playing" || hasAnsweredRef.current) return;
        if (isListeningRef.current) return;

        clearRestartTimer();
        isManualStopRef.current = false;

        try {
            recognitionRef.current.start();
        } catch {
            // Recognition might already be starting/running.
        }
    };

    const stopListening = () => {
        clearRestartTimer();
        isManualStopRef.current = true;
        isListeningRef.current = false;
        setIsListening(false);
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch {
                // Ignore stop errors when recognition is already stopped.
            }
        }
    };

    const toggleMic = () => {
        if (isMicEnabledRef.current) {
            isMicEnabledRef.current = false;
            setIsMicEnabled(false);
            stopListening();
            return;
        }

        isMicEnabledRef.current = true;
        setIsMicEnabled(true);
        setMicError(null);
        if (gameStateRef.current === "playing" && !hasAnsweredRef.current) {
            startListening();
        }
    };

    // Speech Recognition setup
    useEffect(() => {
        if (typeof window === "undefined" || !supportsSpeechInput) return;

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setMicError("이 브라우저는 음성 인식을 지원하지 않습니다. 크롬 브라우저를 사용해주세요.");
            setIsMicEnabled(false);
            isMicEnabledRef.current = false;
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "ko-KR";
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
            isListeningRef.current = true;
            setIsListening(true);
            setMicError(null);
        };

        recognition.onresult = (event: any) => {
            if (!isMicEnabledRef.current) return;
            if (gameStateRef.current !== "playing" || hasAnsweredRef.current) return;

            let finalTranscript = "";
            let interimTranscript = "";
            Array.from(event.results).forEach((result: any) => {
                const transcript = result[0]?.transcript ?? "";
                if (result.isFinal) {
                    finalTranscript += `${transcript} `;
                    return;
                }
                interimTranscript += `${transcript} `;
            });

            const transcript = `${finalTranscript}${interimTranscript}`.trim();
            if (!transcript) return;

            setUserInput(transcript);
            checkAnswer(transcript);
        };

        recognition.onerror = (event: any) => {
            const errorType = typeof event.error === "string"
                ? event.error.trim().toLowerCase()
                : "";

            isListeningRef.current = false;
            setIsListening(false);

            // Ignore expected stop/idle errors from browser speech engines.
            if (isManualStopRef.current || errorType === "aborted" || errorType === "no-speech") {
                return;
            }

            console.error("Speech recognition error", event.error);

            if (errorType === "not-allowed") {
                setMicError("마이크 권한이 차단되었습니다. 브라우저 설정에서 권한을 허용해주세요.");
                setIsMicEnabled(false);
                isMicEnabledRef.current = false;
                return;
            }
            setMicError(`마이크 오류: ${errorType || "unknown"}`);
        };

        recognition.onend = () => {
            isListeningRef.current = false;
            setIsListening(false);
            isManualStopRef.current = false;

            if (!isMicEnabledRef.current) return;
            if (gameStateRef.current !== "playing" || hasAnsweredRef.current) return;

            clearRestartTimer();
            restartTimeoutRef.current = setTimeout(() => {
                startListening();
            }, 250);
        };

        recognitionRef.current = recognition;
        if (isMicEnabledRef.current && gameStateRef.current === "playing" && !hasAnsweredRef.current) {
            startListening();
        }

        return () => {
            clearRestartTimer();
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch {
                    // Ignore stop errors on cleanup.
                }
            }
            isListeningRef.current = false;
            setIsListening(false);
        };
    }, [currentIndex, supportsSpeechInput]);

    const currentChar = shuffledChars[currentIndex];
    const gameTitle = isDescriptionQuizMode ? "설명 인물 퀴즈" : "인물 퀴즈";
    const questionDescription = currentChar?.elementaryDescription || currentChar?.description || "설명이 없습니다.";
    const answerDescription = isDescriptionQuizMode
        ? questionDescription
        : currentChar?.description || "설명이 없습니다.";

    const normalizeText = (text: string) =>
        text.replace(/[^a-zA-Z0-9가-힣]/g, "").toLowerCase();

    const isLooseMatch = (input: string, candidate: string) => {
        if (!input || !candidate) return false;
        if (input === candidate) return true;
        if (input.includes(candidate)) return true;
        return input.length >= 2 && candidate.includes(input);
    };

    const isAnswerCorrect = (inputVal: string) => {
        if (!currentChar) return false;
        const normalizedInput = normalizeText(inputVal);
        const normalizedAnswer = normalizeText(currentChar.name);

        if (!normalizedInput) return false;
        if (isLooseMatch(normalizedInput, normalizedAnswer)) return true;

        if ('synonyms' in currentChar && Array.isArray(currentChar.synonyms)) {
            return currentChar.synonyms.some((synonym: string) => {
                const normalizedSynonym = normalizeText(synonym);
                return isLooseMatch(normalizedInput, normalizedSynonym);
            });
        }
        return false;
    };

    const handleCorrect = () => {
        hasAnsweredRef.current = true;
        if (isMicEnabledRef.current) {
            stopListening();
        }
        setGameState("correct");
        setScore(s => s + 1);
        // Move to description phase after showing the 'correct' overlay briefly
        setTimeout(() => {
            setGameState("description");
            setDescriptionTimeLeft(DESCRIPTION_TIME_LIMIT);
        }, 1500);
    };

    const handleWrongOrTimeout = (state: "wrong" | "timeout") => {
        if (hasAnsweredRef.current) return;
        hasAnsweredRef.current = true;
        if (isMicEnabledRef.current) {
            stopListening();
        }
        setGameState(state);
        const newLives = lives - 1;
        setLives(newLives);

        if (newLives <= 0) {
            setTimeout(() => setGameState("ended"), 1500);
        } else {
            // After showing X or Timeout, go to next question after a brief delay
            // If they got it wrong, we don't necessarily show the description to save time, 
            // but let's just move to next question.
            setTimeout(nextQuestion, 1500);
        }
    };

    const checkAnswer = (inputVal: string) => {
        if (gameStateRef.current !== "playing" || hasAnsweredRef.current) return;

        if (isAnswerCorrect(inputVal)) {
            handleCorrect();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (gameState !== "playing" || hasAnsweredRef.current) return;

        if (isAnswerCorrect(userInput)) {
            handleCorrect();
        } else {
            handleWrongOrTimeout("wrong");
        }
    };

    const nextQuestion = () => {
        if (currentIndex + 1 >= shuffledChars.length || lives <= 0) {
            if (isMicEnabledRef.current) {
                stopListening();
            }
            setGameState("ended");
        } else {
            setCurrentIndex(i => i + 1);
            setTimeLeft(GAME_TIME_LIMIT);
            setUserInput("");
            setShowHint(false);
            setGameState("playing");
            hasAnsweredRef.current = false;
            if (isMicEnabledRef.current) {
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

    const micStatusLabel = micError
        ? "마이크 오류"
        : !isMicEnabled
            ? "마이크 꺼짐"
            : isListening
                ? "마이크 켜짐 · 듣는 중"
                : "마이크 켜짐 · 대기 중";

    const micStatusDotClass = micError
        ? "bg-red-500"
        : !isMicEnabled
            ? "bg-zinc-600"
            : isListening
                ? "bg-green-500 animate-pulse"
                : "bg-amber-400 animate-pulse";

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
                        {gameTitle}
                    </h2>
                </div>
                <div className="flex items-center gap-6">
                    {/* Lives Display */}
                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalQuestions > 20 ? 5 : 3 }).map((_, i) => (
                            <Heart
                                key={i}
                                className={`w-6 h-6 ${i < lives ? 'fill-red-500 text-red-500' : 'fill-zinc-800 text-zinc-700'}`}
                            />
                        ))}
                    </div>

                    <div className="flex flex-col items-end border-l border-white/10 pl-6">
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
                        <h1 className="text-5xl font-bold mb-4 text-white tracking-tight">
                            {lives <= 0 ? "게임 오버" : "게임 완료"}
                        </h1>
                        <p className="text-2xl text-zinc-400 mb-12">최종 기록: <span className="text-white font-bold">{score}</span> <span className="text-lg">/ {shuffledChars.length}</span></p>
                        <Button size="lg" onClick={onExit} className="text-lg px-10 py-7 rounded-2xl bg-white text-black hover:bg-zinc-200 font-semibold transition-all">
                            메인으로 돌아가기
                        </Button>
                    </motion.div>
                ) : gameState === "description" ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-4xl flex flex-col items-center bg-zinc-900/60 p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                    >
                        <div className="w-full flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-bold text-white">정답: {currentChar?.name}</h2>
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                                <Timer className="w-5 h-5 text-indigo-400" />
                                <span className="text-indigo-400 font-mono text-xl font-bold">{descriptionTimeLeft}s</span>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 w-full items-center">
                            {currentChar && (
                                <div
                                    className="w-48 h-64 md:w-64 md:h-80 rounded-[1.5rem] bg-cover bg-center shrink-0 border border-white/10 shadow-xl"
                                    style={{ backgroundImage: `url("${encodeURI(currentChar.image)}")` }}
                                />
                            )}
                            <div className="flex flex-col justify-center">
                                <p className="text-lg md:text-xl leading-relaxed text-zinc-300 font-medium">
                                    {answerDescription}
                                </p>
                            </div>
                        </div>

                        <div className="w-full flex justify-end mt-10">
                            <Button
                                size="lg"
                                onClick={nextQuestion}
                                className="bg-white text-black hover:bg-zinc-200 text-lg px-8 rounded-xl font-semibold gap-2 transition-all"
                            >
                                다음 문제로 <ArrowRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="w-full flex flex-col items-center">
                        {/* Status Bar: Question Number & Timer */}
                        <div className="w-full max-w-2xl px-6 py-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center mb-6 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="px-3 py-1 rounded-lg bg-white/10 text-sm font-semibold text-zinc-300">
                                    Q {currentIndex + 1}
                                </div>
                                <span className="text-zinc-500 text-sm">of {shuffledChars.length}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full ${timeLeft <= DANGER_TIME_THRESHOLD ? "bg-red-500" : "bg-indigo-500"}`}
                                        initial={{ width: "100%" }}
                                        animate={{ width: `${(timeLeft / GAME_TIME_LIMIT) * 100}%` }}
                                        transition={{ duration: 1, ease: "linear" }}
                                    />
                                </div>
                                <div className={`flex items-center gap-1.5 font-mono text-xl font-medium w-16 justify-end ${timeLeft <= DANGER_TIME_THRESHOLD ? "text-red-400" : "text-zinc-300"}`}>
                                    <Timer className="w-5 h-5 opacity-70" />
                                    {timeLeft}
                                </div>
                            </div>
                        </div>

                        {/* Hint Area */}
                        <div className="h-12 mb-4 w-full max-w-xl flex items-center justify-center">
                            <AnimatePresence>
                                {!isDescriptionQuizMode && showHint && currentChar?.hint && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-6 py-2 rounded-full border border-indigo-500/30 backdrop-blur-sm"
                                    >
                                        <Info className="w-4 h-4" />
                                        <span className="font-medium text-sm">{currentChar.hint}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Question Card */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${mode}-${currentIndex}`}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className={`relative overflow-hidden mb-12 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-sm flex items-center justify-center rounded-[2rem] ${isDescriptionQuizMode
                                    ? "w-full max-w-3xl min-h-[22rem] md:min-h-[25rem] bg-zinc-900/70 p-8 md:p-12"
                                    : "w-72 h-96 md:w-[26rem] md:h-[34rem] bg-zinc-900/50 group"
                                    }`}
                            >
                                {isDescriptionQuizMode ? (
                                    <div className="relative z-10 flex h-full w-full flex-col justify-center gap-8">
                                        <div className="inline-flex items-center self-start px-4 py-2 rounded-full border border-emerald-400/30 bg-emerald-500/15 text-emerald-200 text-sm font-medium tracking-wide">
                                            설명을 읽고 인물을 맞혀보세요
                                        </div>
                                        <p className="text-2xl md:text-3xl leading-relaxed font-semibold text-zinc-100">
                                            {questionDescription}
                                        </p>
                                    </div>
                                ) : currentChar ? (
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
                                    <div className={`relative p-6 rounded-3xl mb-4 flex items-center justify-center transition-all duration-300 backdrop-blur-sm
                                        ${micError ? 'bg-red-500/10 border-red-500/30' :
                                            !isMicEnabled ? 'bg-black/20 border-white/5' :
                                                isListening ? 'bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)] border-white/20' :
                                                    'bg-amber-500/10 border-amber-400/30'} border`}>

                                        {/* Ripple effect when listening */}
                                        {isMicEnabled && isListening && (
                                            <>
                                                <div className="absolute inset-0 rounded-3xl bg-white/5 animate-ping opacity-75" />
                                                <div className="absolute inset-[-10px] rounded-[2rem] bg-white/5 animate-pulse opacity-50" />
                                            </>
                                        )}

                                        <div className={`relative z-10 p-4 rounded-full transition-colors duration-300
                                            ${micError ? 'bg-red-500/20 text-red-400' :
                                                !isMicEnabled ? 'bg-white/5 text-zinc-500' :
                                                    isListening ? 'bg-white text-black' : 'bg-amber-400/20 text-amber-300'}`}>
                                            {!isMicEnabled ? (
                                                <MicOff className="w-8 h-8" />
                                            ) : isListening ? (
                                                <Volume2 className="w-8 h-8 animate-pulse" />
                                            ) : (
                                                <Mic className="w-8 h-8" />
                                            )}
                                        </div>
                                    </div>

                                    {micError && (
                                        <div className="text-red-400 text-sm font-medium text-center bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20 mb-2">
                                            {micError}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`w-2 h-2 rounded-full ${micStatusDotClass}`} />
                                        <span className={`text-sm font-medium ${micError ? "text-red-400" : isMicEnabled ? (isListening ? "text-green-400" : "text-amber-300") : "text-zinc-500"}`}>
                                            {micStatusLabel}
                                        </span>
                                    </div>

                                    <div className="text-xl font-medium text-zinc-300 text-center min-h-[3rem] px-8 py-2 w-full bg-white/5 rounded-xl border border-white/5">
                                        {userInput ? (
                                            <span className="text-white drop-shadow-md">{userInput}</span>
                                        ) : (
                                            <span className="text-zinc-600 font-light italic">
                                                {!isMicEnabled
                                                    ? '마이크를 켜면 음성이 텍스트로 변환됩니다'
                                                    : isListening
                                                        ? '(말씀하시면 텍스트가 바로 반영됩니다)'
                                                        : '마이크 연결 중... 잠시만 기다려주세요'}
                                            </span>
                                        )}
                                    </div>

                                    {gameState === "playing" && (
                                        <div className="mt-6 flex items-center gap-3">
                                            <Button
                                                onClick={toggleMic}
                                                className={`${isMicEnabled ? 'bg-red-500 text-white hover:bg-red-400' : 'bg-indigo-600 text-white hover:bg-indigo-500'} rounded-xl border border-transparent shadow-lg px-8 font-medium transition-all`}
                                            >
                                                {isMicEnabled ? <MicOff className="mr-2 w-4 h-4" /> : <Mic className="mr-2 w-4 h-4" />}
                                                {isMicEnabled ? "마이크 끄기" : "마이크 켜기"}
                                            </Button>
                                            {isMicEnabled && !isListening && !micError && (
                                                <Button
                                                    onClick={startListening}
                                                    className="bg-white/10 text-white hover:bg-white/20 rounded-xl border border-white/10 px-6 font-medium transition-all"
                                                >
                                                    다시 연결
                                                </Button>
                                            )}
                                        </div>
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
