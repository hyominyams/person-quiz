"use client";

import { useState } from "react";
import Landing from "@/components/Landing";
import Game from "@/components/Game";
import Image from "next/image";

export type GameMode = "typing" | "speaking" | null;

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>(null);

  const startGame = (mode: GameMode) => {
    setGameMode(mode);
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
      ) : (
        <Game mode={gameMode!} onExit={endGame} />
      )}
    </main>
  );
}
