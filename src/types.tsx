// src/types.ts
export interface ProblemCard {
    id: number;
    title: string;
    description: string;
    category: string;
    context: string;
}

export interface SolutionCard {
    id: number;
    title: string;
    description: string;
    sustainability: number; // 0-100
    cost: number; // 0-100
    autonomy: number; // 0-100
    difficulty: 'facile' | 'moyen' | 'difficile';
    explanation: string;
    isCorrect: boolean; // Indique si c'est la meilleure solution NIRD
}

export interface GameState {
    round: number;
    problem: ProblemCard | null;
    playerScore: number;
    bigTechScore: number;
    selectedSolution: SolutionCard | null;
    bigTechSelection: SolutionCard | null;
    revealed: boolean;
    gameOver: boolean;
    message: string;
}