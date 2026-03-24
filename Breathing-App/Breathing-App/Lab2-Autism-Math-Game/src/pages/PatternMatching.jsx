import { useState, useEffect } from 'react'
import { useProgress } from '../context/ProgressContext'
import VisualFeedback from '../components/VisualFeedback'

const SHAPES = ['🔴', '🟢', '🔵', '🟡', '🟣', '🟤']
const PATTERN_TYPES = ['color', 'shape', 'sequence']

function PatternMatching() {
    const [pattern, setPattern] = useState([])
    const [options, setOptions] = useState([])
    const [score, setScore] = useState(0)
    const [round, setRound] = useState(1)
    const [totalRounds] = useState(10)
    const [feedback, setFeedback] = useState(null)
    const [correctAnswers, setCorrectAnswers] = useState(0)
    const [correctAnswer, setCorrectAnswer] = useState(null)
    const { addScore } = useProgress()

    useEffect(() => {
        generatePattern()
    }, [round])

    const generatePattern = () => {
        // Generate a simple repeating pattern
        const patternLength = 3 + Math.floor(round / 3) // Increase difficulty
        const basePattern = []

        for (let i = 0; i < patternLength; i++) {
            basePattern.push(SHAPES[i % SHAPES.length])
        }

        // Missing element position
        const missingIndex = Math.floor(Math.random() * patternLength)
        const correct = basePattern[missingIndex]
        basePattern[missingIndex] = '❓'

        setPattern(basePattern)
        setCorrectAnswer(correct)

        // Create options
        const wrongOptions = SHAPES.filter(s => s !== correct)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)

        const allOptions = [...wrongOptions, correct].sort(() => Math.random() - 0.5)
        setOptions(allOptions)
        setFeedback(null)
    }

    const handleAnswer = (selectedShape) => {
        if (selectedShape === correctAnswer) {
            setFeedback({ type: 'correct', message: 'Great Memory! 🧠✨' })
            setScore(score + 10)
            setCorrectAnswers(correctAnswers + 1)

            // Show completed pattern
            const completedPattern = pattern.map(item => item === '❓' ? correctAnswer : item)
            setPattern(completedPattern)
        } else {
            setFeedback({ type: 'wrong', message: 'Try to remember the pattern!' })
        }

        setTimeout(() => {
            if (round < totalRounds) {
                setRound(round + 1)
            } else {
                const finalScore = score + (selectedShape === correctAnswer ? 10 : 0)
                const finalCorrect = correctAnswers + (selectedShape === correctAnswer ? 1 : 0)
                addScore('patternMatching', finalScore, finalCorrect, totalRounds)
                setFeedback({
                    type: 'complete',
                    message: `Pattern Master! 🏆 Score: ${finalScore}/${totalRounds * 10}`
                })
            }
        }, 2000)
    }

    const resetGame = () => {
        setRound(1)
        setScore(0)
        setCorrectAnswers(0)
        generatePattern()
    }

    return (
        <div className="game-page">
            <h1 className="game-title">Pattern Matching Game 🎨</h1>

            <div className="game-info">
                <span className="info-badge">Round: {round}/{totalRounds}</span>
                <span className="info-badge">Score: {score}</span>
            </div>

            {feedback?.type !== 'complete' ? (
                <>
                    <div className="question-section">
                        <h2>Which shape completes the pattern?</h2>

                        <div className="pattern-container">
                            {pattern.map((shape, index) => (
                                <div
                                    key={index}
                                    className={`pattern-item ${shape === '❓' ? 'missing' : ''}`}
                                >
                                    {shape}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="options-grid">
                        {options.map((shape, index) => (
                            <button
                                key={index}
                                className="option-button shape-option"
                                onClick={() => handleAnswer(shape)}
                                disabled={feedback !== null && feedback.type !== 'complete'}
                            >
                                {shape}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <div className="completion-screen">
                    <h2>🎉 Pattern Expert! 🎉</h2>
                    <p className="final-score">Score: {score}/{totalRounds * 10}</p>
                    <p className="accuracy">Correct Answers: {correctAnswers}/{totalRounds}</p>
                    <button className="play-again-button" onClick={resetGame}>
                        Play Again
                    </button>
                </div>
            )}

            {feedback && <VisualFeedback type={feedback.type} message={feedback.message} />}
        </div>
    )
}

export default PatternMatching
