import { createContext, useState, useContext, useEffect } from 'react'

const ProgressContext = createContext()

export const useProgress = () => {
    const context = useContext(ProgressContext)
    if (!context) {
        throw new Error('useProgress must be used within a ProgressProvider')
    }
    return context
}

export const ProgressProvider = ({ children }) => {
    const [progress, setProgress] = useState(() => {
        const saved = localStorage.getItem('mathGameProgress')
        return saved ? JSON.parse(saved) : {
            numberRecognition: [],
            addition: [],
            patternMatching: [],
            totalScore: 0,
            gamesPlayed: 0
        }
    })

    useEffect(() => {
        localStorage.setItem('mathGameProgress', JSON.stringify(progress))
    }, [progress])

    const addScore = (game, score, correct, total) => {
        setProgress(prev => ({
            ...prev,
            [game]: [...prev[game], { score, correct, total, timestamp: new Date().toISOString() }],
            totalScore: prev.totalScore + score,
            gamesPlayed: prev.gamesPlayed + 1
        }))
    }

    const resetProgress = () => {
        const emptyProgress = {
            numberRecognition: [],
            addition: [],
            patternMatching: [],
            totalScore: 0,
            gamesPlayed: 0
        }
        setProgress(emptyProgress)
        localStorage.setItem('mathGameProgress', JSON.stringify(emptyProgress))
    }

    return (
        <ProgressContext.Provider value={{ progress, addScore, resetProgress }}>
            {children}
        </ProgressContext.Provider>
    )
}
