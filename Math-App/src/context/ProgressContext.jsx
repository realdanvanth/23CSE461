import { createContext, useContext, useState } from 'react';

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
    const [stars, setStars] = useState(0);
    const [badges, setBadges] = useState([]);
    const [quizHighScore, setQuizHighScore] = useState(0);
    const [builderCreations, setBuilderCreations] = useState(0);
    const [exploredShapes, setExploredShapes] = useState([]);

    const addStars = (n) => setStars(s => s + n);
    const addBadge = (badge) => setBadges(b => b.includes(badge) ? b : [...b, badge]);
    const updateQuizScore = (score) => {
        if (score > quizHighScore) setQuizHighScore(score);
        if (score >= 5) addBadge('quiz-5');
        if (score >= 10) addBadge('quiz-master');
        addStars(score);
    };
    const recordBuilderSave = () => {
        setBuilderCreations(c => c + 1);
        addBadge('builder');
        addStars(3);
    };
    const recordExplore = (shape) => {
        setExploredShapes(prev => prev.includes(shape) ? prev : [...prev, shape]);
        if (!exploredShapes.includes(shape)) addStars(1);
    };

    return (
        <ProgressContext.Provider value={{
            stars, badges, quizHighScore, builderCreations, exploredShapes,
            addStars, addBadge, updateQuizScore, recordBuilderSave, recordExplore
        }}>
            {children}
        </ProgressContext.Provider>
    );
}

export const useProgress = () => useContext(ProgressContext);
