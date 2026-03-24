import { useState, useEffect } from 'react'
import { useProgress } from '../context/ProgressContext'
import VisualFeedback from '../components/VisualFeedback'

const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#FF8B94', '#A8E6CF']

function NumberRecognition() {
    const [currentNumber, setCurrentNumber] = useState(1)
    const [options, setOptions] = useState([])
    const [score, setScore] = useState(0)
    const [round, setRound] = useState(1)
    const [totalRounds] = useState(10)
    const [feedback, setFeedback] = useState(null)
    const [correctAnswers, setCorrectAnswers] = useState(0)
    const { addScore } = useProgress()

    useEffect(() => {
        generateQuestion()
    }, [round])

    const generateQuestion = () => {
        const number = NUMBERS[Math.floor(Math.random() * NUMBERS.length)]
        setCurrentNumber(number)

        // Generate 3 wrong options and 1 correct option
        const wrongOptions = NUMBERS.filter(n => n !== number)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)

        const allOptions = [...wrongOptions, number].sort(() => Math.random() - 0.5)
        setOptions(allOptions)
        setFeedback(null)
    }

    const handleAnswer = (selectedNumber) => {
        if (selectedNumber === currentNumber) {
            setFeedback({ type: 'correct', message: 'Excellent! 🎉' })
            setScore(score + 10)
            setCorrectAnswers(correctAnswers + 1)
        } else {
            setFeedback({ type: 'wrong', message: `Try Again! The answer is ${currentNumber}` })
        }

        setTimeout(() => {
            if (round < totalRounds) {
                setRound(round + 1)
            } else {
                // Game complete
                addScore('numberRecognition', score + (selectedNumber === currentNumber ? 10 : 0),
                    correctAnswers + (selectedNumber === currentNumber ? 1 : 0), totalRounds)
                setFeedback({
                    type: 'complete',
                    message: `Game Complete! 🏆 Your Score: ${score + (selectedNumber === currentNumber ? 10 : 0)}/${totalRounds * 10}`
                })
            }
        }, 2000)
    }

    const resetGame = () => {
        setRound(1)
        setScore(0)
        setCorrectAnswers(0)
        setFeedback(null)
        generateQuestion()
    }

    const renderVisualNumber = () => {
        const items = []
        const color = COLORS[currentNumber % COLORS.length]

        for (let i = 0; i < currentNumber; i++) {
            items.push(
                <div
                    key={i}
                    className="visual-item"
                    style={{ backgroundColor: color }}
                >
                    {['🍎', '⭐', '🎈', '🍌', '⚽'][i % 5]}
                </div>
            )
        }
        return items
    }

    return (
        <div className="game-page">
            <h1 className="game-title">Number Recognition Game 🔢</h1>

            <div className="game-info">
                <span className="info-badge">Round: {round}/{totalRounds}</span>
                <span className="info-badge">Score: {score}</span>
            </div>

            {feedback?.type !== 'complete' ? (
                <>
                    <div className="question-section">
                        <h2>Count the objects and click the correct number!</h2>
                        <div className="visual-container">
                            {renderVisualNumber()}
                        </div>
                    </div>

                    <div className="options-grid">
                        {options.map((num) => (
                            <button
                                key={num}
                                className="option-button"
                                onClick={() => handleAnswer(num)}
                                disabled={feedback !== null && feedback.type !== 'complete'}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <div className="completion-screen">
                    <h2>🎉 Congratulations! 🎉</h2>
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

export default NumberRecognition
