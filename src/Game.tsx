// src/Game.tsx
import { useState, useEffect } from "react";
import { problems, problemSolutions } from "../data/cards";
import type { ProblemCard, SolutionCard } from "./types";

// Palette de couleurs basée sur l'abeille
const colors = {
    darkBlue: "#0057A4",
    blue: "#1A84D9",
    violet: "#8A3FF7",
    pink: "#F37CCF",
    orange: "#F6A55A",
    yellow: "#F6D464",

    // Gradients pour les différents éléments
    bgGradient: "bg-gradient-to-br from-[#0057A4] via-[#1A84D9] to-[#8A3FF7]",
    cardUserGradient: "bg-gradient-to-br from-[#8A3FF7] via-[#F37CCF] to-[#F6A55A]",
    cardBigTechGradient: "bg-gradient-to-br from-[#0057A4] via-[#1A84D9] to-[#8A3FF7]",
    problemGradient: "bg-gradient-to-br from-[#1A84D9] via-[#8A3FF7] to-[#F37CCF]",
    scoreGradient: "bg-gradient-to-r from-[#F6A55A] via-[#F6D464] to-[#F37CCF]",

    // Couleurs de texte
    textLight: "#FFFFFF",
    textDark: "#0A2540",
};

export default function Game() {
    const [round, setRound] = useState(0);
    const [playerScore, setPlayerScore] = useState(0);
    const [bigTechScore, setBigTechScore] = useState(0);
    const [currentProblem, setCurrentProblem] = useState<ProblemCard | null>(problems[0]);
    const [gameOver, setGameOver] = useState(false);
    const [message, setMessage] = useState("");
    const [revealed, setRevealed] = useState(false);
    const [selectedSolution, setSelectedSolution] = useState<SolutionCard | null>(null);
    const [bigTechSelection, setBigTechSelection] = useState<SolutionCard | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    // Obtenir les solutions pour le problème courant
    const currentSolutions = currentProblem ? problemSolutions[currentProblem.id] || [] : [];

    const getRandomBigTechChoice = () => {
        // Big Tech choisit souvent les solutions faciles mais non durables
        const easySolutions = currentSolutions.filter(s => s.difficulty === 'facile');
        const randomIndex = Math.floor(Math.random() * currentSolutions.length);
        return easySolutions.length > 0
            ? easySolutions[Math.floor(Math.random() * easySolutions.length)]
            : currentSolutions[randomIndex];
    };

    const handleSelectSolution = (solution: SolutionCard) => {
        if (!currentProblem || isAnimating) return;

        setSelectedSolution(solution);
        setIsAnimating(true);

        // Big Tech fait son choix
        const bigTechChoice = getRandomBigTechChoice();
        setBigTechSelection(bigTechChoice);

        // Animation
        setTimeout(() => {
            setRevealed(true);

            setTimeout(() => {
                let result = "";

                if (solution.isCorrect) {
                    // Le joueur a choisi la meilleure solution NIRD
                    setPlayerScore(prev => prev + 2); // Bonus pour solution optimale
                    result = "🎯 Solution NIRD optimale ! +2 points";
                } else if (solution.sustainability > bigTechChoice.sustainability &&
                    solution.autonomy > bigTechChoice.autonomy) {
                    // Le joueur a une meilleure solution que Big Tech
                    setPlayerScore(prev => prev + 1);
                    result = "✅ Votre solution est plus durable ! +1 point";
                } else if (bigTechChoice.isCorrect) {
                    // Big Tech a choisi la meilleure solution (ironique mais possible)
                    setBigTechScore(prev => prev + 2);
                    result = "😱 Big Tech a choisi la bonne solution ! +2 points";
                } else if (bigTechChoice.cost < solution.cost) {
                    // Big Tech a une solution moins chère
                    setBigTechScore(prev => prev + 1);
                    result = "💰 Solution Big Tech moins coûteuse +1 point";
                } else {
                    // Égalité ou cas particulier
                    if (Math.random() > 0.5) {
                        setPlayerScore(prev => prev + 1);
                        result = "⚖️ Votre solution est légèrement meilleure +1 point";
                    } else {
                        setBigTechScore(prev => prev + 1);
                        result = "⚖️ Solution Big Tech légèrement meilleure +1 point";
                    }
                }

                setMessage(result);

                const nextRound = round + 1;
                if (playerScore + 2 >= 10 || bigTechScore + 2 >= 10 || nextRound === problems.length) {
                    setTimeout(() => setGameOver(true), 1500);
                } else {
                    setTimeout(() => {
                        setRound(nextRound);
                        setCurrentProblem(problems[nextRound]);
                        setRevealed(false);
                        setSelectedSolution(null);
                        setBigTechSelection(null);
                        setIsAnimating(false);
                    }, 2000);
                }
            }, 1500);
        }, 500);
    };

    const resetGame = () => {
        setRound(0);
        setPlayerScore(0);
        setBigTechScore(0);
        setCurrentProblem(problems[0]);
        setGameOver(false);
        setMessage("");
        setRevealed(false);
        setSelectedSolution(null);
        setBigTechSelection(null);
        setIsAnimating(false);
    };

    // Rendu d'une carte solution avec la nouvelle palette
    const SolutionCard = ({ solution, isSelected, isBigTech, onClick }: {
        solution: SolutionCard;
        isSelected: boolean;
        isBigTech?: boolean;
        onClick?: () => void;
    }) => (
        <div
            className={`relative rounded-2xl p-5 border-2 cursor-pointer transition-all duration-300 h-full ${isBigTech
                ? 'bg-gradient-to-br from-[#cde8ff] via-[#824292] to-[#c7aaf3] border-[#1A84D9]/50'
                : 'bg-gradient-to-br from-[#8A3FF7] via-[#924a7d] to-[#2a1a36] border-[#F37CCF]/50'
                } ${isSelected
                    ? isBigTech
                        ? 'border-[#0057A4] scale-[1.02] shadow-[0_0_30px_rgba(26,132,217,0.5)]'
                        : 'border-[#F6D464] scale-[1.02] shadow-[0_0_30px_rgba(246,212,100,0.5)]'
                    : 'hover:border-[#F6D464] hover:shadow-lg'
                } ${isAnimating && !isSelected ? 'opacity-50' : 'opacity-100'}`}
            onClick={onClick}
        >
            {/* Badge difficulté */}
            <div className={`absolute top-3 right-3 px-3 py-1 rounded-lg text-xs font-semibold ${solution.difficulty === 'facile' ? 'bg-[#F6D464]/30 text-[#F6D464] border border-[#F6D464]/50' :
                solution.difficulty === 'moyen' ? 'bg-[#F6A55A]/30 text-[#F6A55A] border border-[#F6A55A]/50' :
                    'bg-[#F37CCF]/30 text-[#F37CCF] border border-[#F37CCF]/50'
                }`}>
                {solution.difficulty.toUpperCase()}
            </div>

            <div className="pr-12">
                <h3 className="text-xl font-bold mb-2 text-white drop-shadow-lg">{solution.title}</h3>
                <p className="text-white/90 text-sm mb-4">{solution.description}</p>
            </div>

            {/* Indicateurs rapides */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                    <div className="text-xs text-[#F6D464] font-semibold">DURABLE</div>
                    <div className="font-bold text-lg text-white">{solution.sustainability}%</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                    <div className="text-xs text-[#F6A55A] font-semibold">COÛT</div>
                    <div className="font-bold text-lg text-white">{solution.cost}%</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                    <div className="text-xs text-[#F37CCF] font-semibold">AUTONOME</div>
                    <div className="font-bold text-lg text-white">{solution.autonomy}%</div>
                </div>
            </div>

            {/* Indicateur de sélection */}
            {isSelected && (
                <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${isBigTech ? 'bg-[#0057A4]' : 'bg-[#F6D464]'
                        }`}></div>
                    <span className={`text-sm font-semibold ${isBigTech ? 'text-[#1A84D9]' : 'text-[#F6D464]'
                        }`}>
                        {isBigTech ? 'CHOIX BIG TECH' : 'VOTRE CHOIX'}
                    </span>
                </div>
            )}

            {/* Badge solution optimale */}
            {revealed && solution.isCorrect && (
                <div className="absolute top-3 left-3 bg-[#F6D464]/20 px-3 py-1 rounded-lg border border-[#F6D464]/30">
                    <span className="text-xs text-[#F6D464] font-semibold">⭐ OPTIMALE</span>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#afd5f7] via-[#295b85] to-[#8e6ac5] text-white font-sans overflow-auto">
            {/* Dégradé d'arrière-plan */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0057A4]/20 via-[#1A84D9]/20 to-[#8A3FF7]/20 backdrop-blur-sm"></div>

            <div className="relative container mx-auto px-4 py-6">
                {/* Header avec logo abeille */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center mb-4">
                        <div className="relative">
                            {/* Logo abeille stylisé */}
                            <div className="w-16 h-16 bg-gradient-to-r from-[#F6D464] via-[#F6A55A] to-[#F37CCF] rounded-full"></div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-[#8A3FF7] to-[#1A84D9] rounded-full"></div>
                            <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-r from-[#0057A4] to-[#8A3FF7] rounded-full"></div>
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-[#F6D464] via-[#F37CCF] to-[#8A3FF7] bg-clip-text text-transparent">
                        Village Numérique Résistant
                    </h1>
                    <p className="text-white/80 mb-6">Même jeu, choix différents. Quel numérique pour l'école ?</p>

                    {/* Score avec nouveau design */}
                    <div className="flex justify-center items-center space-x-8 md:space-x-16 mb-8">
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-3 mb-2">
                                <div className="w-4 h-4 bg-gradient-to-r from-[#F6D464] to-[#F6A55A] rounded-full shadow-lg"></div>
                                <div className="text-2xl font-bold text-[#F6D464] drop-shadow-lg">VOUS</div>
                            </div>
                            <div className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">{playerScore}</div>
                            <div className="text-sm text-white/70 mt-1">Points NIRD</div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="text-3xl font-bold text-white/50 mb-2">VS</div>
                            <div className="text-sm text-white/60 bg-white/10 px-3 py-1 rounded-full">
                                Manche {round + 1}/{problems.length}
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-3 mb-2">
                                <div className="w-4 h-4 bg-gradient-to-r from-[#0057A4] to-[#1A84D9] rounded-full shadow-lg"></div>
                                <div className="text-2xl font-bold text-[#1A84D9] drop-shadow-lg">BIG TECH</div>
                            </div>
                            <div className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">{bigTechScore}</div>
                            <div className="text-sm text-white/70 mt-1">Points</div>
                        </div>
                    </div>

                    {/* Barre de progression */}
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#F6D464] via-[#F37CCF] to-[#8A3FF7] rounded-full transition-all duration-500"
                                style={{ width: `${((round + 1) / problems.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Carte Problème avec nouveau design */}
                <div className="max-w-5xl mx-auto mb-12">
                    <div className="bg-gradient-to-r from-[#1A84D9]/30 via-[#8A3FF7]/30 to-[#F37CCF]/30 rounded-2xl p-6 md:p-8 border border-white/20 backdrop-blur-sm shadow-2xl">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-3 h-3 bg-gradient-to-r from-[#F6A55A] to-[#F6D464] rounded-full animate-pulse"></div>
                            <span className="text-sm font-semibold text-[#F6D464] uppercase tracking-wider">
                                PROBLÈME {round + 1} : {currentProblem?.category}
                            </span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow-lg">
                            {currentProblem?.title}
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-2 h-2 bg-[#8A3FF7] rounded-full"></div>
                                    <div className="text-sm text-[#8A3FF7] font-semibold">DESCRIPTION</div>
                                </div>
                                <p className="text-lg text-white/90">{currentProblem?.description}</p>
                            </div>

                            <div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-2 h-2 bg-[#F37CCF] rounded-full"></div>
                                    <div className="text-sm text-[#F37CCF] font-semibold">CONTEXTE</div>
                                </div>
                                <p className="text-white/80">{currentProblem?.context}</p>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="text-sm text-white/60 mb-1">OBJECTIF</div>
                                <div className="text-white/90">Choisissez la solution la plus durable et autonome</div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="text-sm text-white/60">
                                    Solutions disponibles: <span className="text-[#F6D464] font-bold">{currentSolutions.length}</span>
                                </div>
                                <div className="w-2 h-2 bg-[#F6D464] rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Zone de Jeu - Cartes Solutions */}
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

                        {/* Votre sélection */}
                        <div>
                            <div className="mb-6">
                                <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-[#8A3FF7]/30 to-[#F37CCF]/30 px-4 py-2 rounded-lg border border-[#F37CCF]/50 backdrop-blur-sm">
                                    <div className="w-3 h-3 bg-gradient-to-r from-[#F6D464] to-[#F6A55A] rounded-full animate-pulse"></div>
                                    <span className="font-semibold text-[#F6D464]">VOTRE TOUR - CHOISISSEZ UNE CARTE</span>
                                </div>
                            </div>

                            {/* Instructions */}
                            {!selectedSolution && (
                                <div className="bg-gradient-to-r from-fuchsia-400 to-fuchsia-200 p-4 rounded-lg mb-6 border border-x-fuchsia-300 backdrop-blur-sm">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-6 h-6 bg-gradient-to-r from-fuchsia-400 to-violet-400 rounded-full flex items-center justify-center">
                                            <span className="text-sm">❓</span>
                                        </div>
                                        <div>
                                            <div className="text-[#F6D464] font-semibold">Comment jouer ?</div>
                                            <div className="text-sm text-white/80">
                                                Choisissez la solution la plus durable (sustainability), autonome (autonomy) et économique (coût bas).
                                                Big Tech choisira aussi une carte parmi les mêmes options.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Grille de cartes (2 par ligne) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {currentSolutions.map((solution) => (
                                    <div key={solution.id} className="transform transition-transform duration-300 hover:scale-[1.02]">
                                        <SolutionCard
                                            solution={solution}
                                            isSelected={selectedSolution?.id === solution.id}
                                            onClick={() => !isAnimating && handleSelectSolution(solution)}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Votre choix si sélectionné */}
                            {selectedSolution && (
                                <div className="mt-6 bg-gradient-to-r from-[#8A3FF7]/20 to-[#F37CCF]/20 p-4 rounded-lg border border-[#F37CCF]/30 backdrop-blur-sm">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-3 h-3 bg-[#000000] rounded-full animate-pulse"></div>
                                        <span className="font-semibold text-[#F6D464]">VOTRE CHOIX</span>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-3xl">🤔</div>
                                        <div>
                                            <div className="font-bold text-lg text-white">{selectedSolution.title}</div>
                                            <div className="text-sm text-white/70">En attente du choix de Big Tech...</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sélection Big Tech */}
                        <div>
                            <div className="mb-6">
                                <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-[#0057A4]/30 to-[#1A84D9]/30 px-4 py-2 rounded-lg border border-[#1A84D9]/50 backdrop-blur-sm">
                                    <div className="w-3 h-3 bg-gradient-to-r from-[#0057A4] to-[#1A84D9] rounded-full"></div>
                                    <span className="font-semibold text-[#1A84D9]">CHOIX BIG TECH</span>
                                </div>
                            </div>

                            {!bigTechSelection ? (
                                <div className="bg-gradient-to-br from-[#0057A4]/20 via-[#1A84D9]/20 to-[#8A3FF7]/20 p-8 rounded-2xl border border-[#1A84D9]/30 h-full flex flex-col items-center justify-center backdrop-blur-sm min-h-[400px]">
                                    <div className="text-6xl mb-4 animate-pulse">🤖</div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold mb-2 text-white drop-shadow-lg">Big Tech réfléchit...</div>
                                        <div className="text-white/70">
                                            {selectedSolution
                                                ? "Big Tech va bientôt révéler son choix"
                                                : "En attente de votre sélection"
                                            }
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Carte sélectionnée par Big Tech */}
                                    <div className="mb-6 transform transition-transform duration-300">
                                        <SolutionCard
                                            solution={bigTechSelection}
                                            isSelected={true}
                                            isBigTech={true}
                                        />
                                    </div>

                                    {/* Analyse comparée */}
                                    {revealed && (
                                        <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-2xl border border-white/20 backdrop-blur-sm">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="w-6 h-6 bg-gradient-to-r from-[#F6A55A] to-[#F6D464] rounded-full flex items-center justify-center">
                                                    <span className="text-sm">⚖️</span>
                                                </div>
                                                <span className="font-semibold text-[#F6D464]">COMPARAISON</span>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="text-center p-3 rounded-lg bg-gradient-to-r from-[#8A3FF7]/30 to-[#F37CCF]/30">
                                                        <div className="text-sm text-[#F6D464] font-semibold">VOTRE SOLUTION</div>
                                                        <div className="text-xl font-bold text-white mt-2">{selectedSolution?.title}</div>
                                                    </div>
                                                    <div className="text-center p-3 rounded-lg bg-gradient-to-r from-[#0057A4]/30 to-[#1A84D9]/30">
                                                        <div className="text-sm text-[#1A84D9] font-semibold">BIG TECH</div>
                                                        <div className="text-xl font-bold text-white mt-2">{bigTechSelection.title}</div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-3 text-center">
                                                    <div className={`p-3 rounded-lg backdrop-blur-sm ${(selectedSolution?.sustainability || 0) > bigTechSelection.sustainability
                                                        ? 'bg-gradient-to-b from-[#F6D464]/30 to-[#F6A55A]/30 border border-[#F6D464]/50'
                                                        : (selectedSolution?.sustainability || 0) < bigTechSelection.sustainability
                                                            ? 'bg-gradient-to-b from-[#1A84D9]/30 to-[#0057A4]/30 border border-[#1A84D9]/50'
                                                            : 'bg-white/10 border border-white/20'
                                                        }`}>
                                                        <div className="text-xs text-white/80">DURABILITÉ</div>
                                                        <div className="font-bold text-lg text-white">
                                                            {selectedSolution?.sustainability} vs {bigTechSelection.sustainability}
                                                        </div>
                                                    </div>
                                                    <div className={`p-3 rounded-lg backdrop-blur-sm ${(selectedSolution?.cost || 0) < bigTechSelection.cost
                                                        ? 'bg-gradient-to-b from-[#F6D464]/30 to-[#F6A55A]/30 border border-[#F6D464]/50'
                                                        : (selectedSolution?.cost || 0) > bigTechSelection.cost
                                                            ? 'bg-gradient-to-b from-[#1A84D9]/30 to-[#0057A4]/30 border border-[#1A84D9]/50'
                                                            : 'bg-white/10 border border-white/20'
                                                        }`}>
                                                        <div className="text-xs text-white/80">COÛT (moins = mieux)</div>
                                                        <div className="font-bold text-lg text-white">
                                                            {selectedSolution?.cost} vs {bigTechSelection.cost}
                                                        </div>
                                                    </div>
                                                    <div className={`p-3 rounded-lg backdrop-blur-sm ${(selectedSolution?.autonomy || 0) > bigTechSelection.autonomy
                                                        ? 'bg-gradient-to-b from-[#F6D464]/30 to-[#F6A55A]/30 border border-[#F6D464]/50'
                                                        : (selectedSolution?.autonomy || 0) < bigTechSelection.autonomy
                                                            ? 'bg-gradient-to-b from-[#1A84D9]/30 to-[#0057A4]/30 border border-[#1A84D9]/50'
                                                            : 'bg-white/10 border border-white/20'
                                                        }`}>
                                                        <div className="text-xs text-white/80">AUTONOMIE</div>
                                                        <div className="font-bold text-lg text-white">
                                                            {selectedSolution?.autonomy} vs {bigTechSelection.autonomy}
                                                        </div>
                                                    </div>
                                                </div>

                                                {selectedSolution?.isCorrect && (
                                                    <div className="bg-gradient-to-r from-[#F6D464]/20 to-[#F6A55A]/20 p-3 rounded-lg border border-[#F6D464]/30">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="text-2xl">⭐</div>
                                                            <div>
                                                                <div className="font-bold text-[#F6D464]">Solution NIRD optimale !</div>
                                                                <div className="text-sm text-[#F6A55A]">Vous avez choisi la solution la plus durable et autonome</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Légende avec nouvelles couleurs */}
                    <div className="bg-gradient-to-r from-white/10 to-white/5 p-4 rounded-lg border border-white/20 backdrop-blur-sm mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-4 h-4 bg-gradient-to-r from-[#F6D464] to-[#F6A55A] rounded-full shadow-lg"></div>
                                <div>
                                    <div className="text-sm font-semibold text-[#F6D464]">Solution durable</div>
                                    <div className="text-xs text-white/70">Haute durabilité et autonomie</div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-4 h-4 bg-gradient-to-r from-[#0057A4] to-[#1A84D9] rounded-full shadow-lg"></div>
                                <div>
                                    <div className="text-sm font-semibold text-[#1A84D9]">Solution Big Tech</div>
                                    <div className="text-xs text-white/70">Souvent moins durable mais plus facile</div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-4 h-4 bg-gradient-to-r from-[#8A3FF7] to-[#F37CCF] rounded-full shadow-lg"></div>
                                <div>
                                    <div className="text-sm font-semibold text-[#F37CCF]">Solution équilibrée</div>
                                    <div className="text-xs text-white/70">Bon compromis coût/bénéfice</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages avec nouvelles couleurs */}
                {message && (
                    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-up">
                        <div className={`px-8 py-4 rounded-xl backdrop-blur-sm border shadow-2xl ${message.includes("+2") || (message.includes("+1") && !message.includes("Big Tech"))
                            ? 'bg-gradient-to-r from-[#F6D464]/20 to-[#F6A55A]/20 border-[#F6D464]/50'
                            : 'bg-gradient-to-r from-[#0057A4]/20 to-[#1A84D9]/20 border-[#1A84D9]/50'
                            }`}>
                            <div className="flex items-center space-x-4">
                                <div className="text-3xl">
                                    {message.includes("+2") ? '🎯' :
                                        message.includes("Big Tech") ? '🤖' : '✅'}
                                </div>
                                <div className="text-xl font-bold text-white drop-shadow-lg">{message}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Écran de fin avec nouvelles couleurs */}
                {gameOver && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-[#0057A4]/95 via-[#1A84D9]/95 to-[#8A3FF7]/95 backdrop-blur-sm">
                        <div className="max-w-2xl w-full rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/20 shadow-2xl backdrop-blur-lg">
                            <div className="p-8 text-center">
                                <div className="text-7xl mb-6 animate-bounce">
                                    {playerScore > bigTechScore ? '🏆' : '💻'}
                                </div>

                                <h2 className="text-4xl font-bold mb-6">
                                    {playerScore > bigTechScore ? (
                                        <span className="bg-gradient-to-r from-[#F6D464] via-[#F6A55A] to-[#F37CCF] bg-clip-text text-transparent">
                                            LE VILLAGE RÉSISTE !
                                        </span>
                                    ) : playerScore === bigTechScore ? (
                                        <span className="bg-gradient-to-r from-[#1A84D9] via-[#8A3FF7] to-[#F37CCF] bg-clip-text text-transparent">
                                            MATCH NUL
                                        </span>
                                    ) : (
                                        <span className="bg-gradient-to-r from-[#0057A4] via-[#1A84D9] to-[#8A3FF7] bg-clip-text text-transparent">
                                            BIG TECH DOMINE
                                        </span>
                                    )}
                                </h2>

                                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-6 mb-8 border border-white/20 backdrop-blur-sm">
                                    <div className="grid grid-cols-2 gap-8 mb-6">
                                        <div className="text-center p-4 rounded-lg bg-gradient-to-r from-[#8A3FF7]/30 to-[#F37CCF]/30">
                                            <div className="text-2xl font-bold text-[#F6D464] mb-2">VOUS</div>
                                            <div className="text-6xl font-bold text-white">{playerScore}</div>
                                            <div className="text-sm text-white/70 mt-2">points NIRD</div>
                                        </div>
                                        <div className="text-center p-4 rounded-lg bg-gradient-to-r from-[#0057A4]/30 to-[#1A84D9]/30">
                                            <div className="text-2xl font-bold text-[#1A84D9] mb-2">BIG TECH</div>
                                            <div className="text-6xl font-bold text-white">{bigTechScore}</div>
                                            <div className="text-sm text-white/70 mt-2">points</div>
                                        </div>
                                    </div>

                                    <div className="text-white/90">
                                        {playerScore > bigTechScore
                                            ? "Félicitations ! Vous avez démontré qu'un numérique responsable et durable est possible dans l'éducation."
                                            : playerScore === bigTechScore
                                                ? "Match serré ! La bataille pour un numérique éducatif responsable continue."
                                                : "Big Tech montre encore sa domination. Mais chaque choix conscient est un pas vers l'autonomie."}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        onClick={resetGame}
                                        className="w-full py-4 bg-gradient-to-r from-[#F6D464] to-[#F6A55A] text-[#0A2540] font-bold rounded-xl hover:from-[#F6D464]/90 hover:to-[#F6A55A]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                                    >
                                        Rejouer une partie
                                    </button>
                                    <button
                                        onClick={() => window.open('https://nird.forge.apps.education.fr/', '_blank')}
                                        className="w-full py-3 bg-gradient-to-r from-white/10 to-white/5 text-white rounded-xl hover:bg-gradient-to-r hover:from-white/20 hover:to-white/10 transition-all duration-300 border border-white/20"
                                    >
                                        Découvrir la démarche NIRD
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}