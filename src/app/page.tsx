"use client";

import { useState } from "react";
import Landing from "@/components/Landing";
import Game from "@/components/Game";
import ExplanationMode from "@/components/ExplanationMode";

export type GameMode = "typing" | "speaking" | "descriptionQuiz" | "explanation" | null;

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [totalQuestions, setTotalQuestions] = useState<number>(10);

  const startGame = (mode: GameMode, questions: number) => {
    setGameMode(mode);
    setTotalQuestions(questions);
    setIsPlaying(true);
  };

  const endGame = () => {
    setIsPlaying(false);
    setGameMode(null);
  };

  return (
    <main className="min-h-screen bg-neutral-900 text-white font-sans overflow-hidden">
      {!isPlaying ? (
        <Landing onStart={startGame} />
      ) : gameMode === "explanation" ? (
        <ExplanationMode onExit={endGame} />
      ) : (
        <Game mode={gameMode!} totalQuestions={totalQuestions} onExit={endGame} />
      )}
    </main>
  );
}
