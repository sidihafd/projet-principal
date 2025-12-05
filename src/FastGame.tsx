import { useState, useEffect } from "react";

export default function FastGame({ onExit }: { onExit: () => void }) {
    const [color, setColor] = useState("gray");
    const [message, setMessage] = useState("Prépare-toi...");
    const [gameState, setGameState] = useState("waiting"); // waiting | ready | ended
    const [startTime, setStartTime] = useState<number | null>(null);
    const [reaction, setReaction] = useState<number | null>(null);

    // Change to green randomly
    useEffect(() => {
        const timeout = setTimeout(() => {
            setColor("green");
            setMessage("CLIQUE !");
            setStartTime(Date.now());
            setGameState("ready");
        }, Math.random() * 3000 + 2000); // entre 2s et 5s

        return () => clearTimeout(timeout);
    }, []);

    const handleClick = () => {
        if (gameState === "ready") {
            const time = Date.now() - startTime!;
            setReaction(time);
            setMessage("Bravo !");
            setColor("skyblue");
            setGameState("ended");
        } else {
            setMessage("TROP TÔT !");
            setColor("red");
            setGameState("ended");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-5 text-white">
            <h1 className="text-3xl font-bold mb-4">{message}</h1>

            <div
                onClick={gameState !== "ended" ? handleClick : undefined}
                className={`
          w-40 h-40 rounded-full cursor-pointer transition-all duration-300
          ${color === "gray" ? "bg-gray-400 animate-pulse" : ""}
          ${color === "green" ? "bg-green-500 scale-110" : ""}
          ${color === "red" ? "bg-red-600 scale-110" : ""}
          ${color === "skyblue" ? "bg-sky-400 scale-110" : ""}
        `}
            />

            {reaction && (
                <p className="text-xl font-semibold">
                    Temps de réaction : <span className="text-sky-400">{reaction} ms</span>
                </p>
            )}

            {gameState === "ended" && (
                <button
                    onClick={onExit}
                    className="mt-6 bg-sky-500 hover:bg-sky-600 px-5 py-2 rounded-full font-semibold"
                >
                    Retour
                </button>
            )}
        </div>
    );
}
