import { useState, useEffect } from 'react'
import { useProgress } from '../context/ProgressContext'
import VisualFeedback from '../components/VisualFeedback'

const EMOJIS = ['🍎', '🍊', '🍌', '🍇', '🍓', '⭐', '🎈', '⚽', '🎨', '🎁']

function AdditionGame() {
    const [num1, setNum1] = useState(0)
    const [num2, setNum2] = useState(0)
    const [userAnswer, setUserAnswer] = useState('')
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
        const n1 = Math.floor(Math.random() * 5) + 1 // 1-5
        const n2 = Math.floor(Math.random() * 5) + 1 // 1-5
        setNum1(n1)
        setNum2(n2)
        setUserAnswer('')
        setFeedback(null)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const answer = parseInt(userAnswer)
        const correctAnswer = num1 + num2

        if (answer === correctAnswer) {
            setFeedback({ type: 'correct', message: '🎉 Perfect! ' + num1 + ' + ' + num2 + ' = ' + correctAnswer })
            setScore(score + 10)
            setCorrectAnswers(correctAnswers + 1)
        } else {
            setFeedback({
                type: 'wrong',
                message: `Not quite! ${num1} + ${num2} = ${correctAnswer}. You wrote ${answer}.`
            })
        }

        setTimeout(() => {
            if (round < totalRounds) {
                setRound(round + 1)
            } else {
                const finalScore = score + (answer === correctAnswer ? 10 : 0)
                const finalCorrect = correctAnswers + (answer === correctAnswer ? 1 : 0)
                addScore('addition', finalScore, finalCorrect, totalRounds)
                setFeedback({
                    type: 'complete',
                    message: `Game Complete! 🏆 Score: ${finalScore}/${totalRounds * 10}`
                })
            }
        }, 2500)
    }

    const resetGame = () => {
        setRound(1)
        setScore(0)
        setCorrectAnswers(0)
        generateQuestion()
    }

    const renderVisualObjects = (count, emoji) => {
        const items = []
        for (let i = 0; i < count; i++) {
            items.push(
                <div key={i} className="emoji-item">
                    {emoji}
                </div>
            )
        }
        return items
    }

    const emoji1 = EMOJIS[round % EMOJIS.length]
    const emoji2 = EMOJIS[(round + 1) % EMOJIS.length]

    return (
        <div className="game-page">
            <h1 className="game-title">Addition Game ➕</h1>

            <div className="game-info">
                <span className="info-badge">Round: {round}/{totalRounds}</span>
                <span className="info-badge">Score: {score}</span>
            </div>

            {feedback?.type !== 'complete' ? (
                <>
                    <div className="question-section">
                        <h2>Add the objects together!</h2>

                        <div className="addition-container">
                            <div className="addition-group">
                                <div className="visual-container">
                                    {renderVisualObjects(num1, emoji1)}
                                </div>
                                <div className="number-display">{num1}</div>
                            </div>

                            <div className="operator">+</div>

                            <div className="addition-group">
                                <div className="visual-container">
                                    {renderVisualObjects(num2, emoji2)}
                                </div>
                                <div className="number-display">{num2}</div>
                            </div>

                            <div className="operator">=</div>

                            <div className="addition-group">
                                <div className="number-display">?</div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="answer-form">
                        <input
                            type="number"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="Your answer"
                            className="answer-input"
                            autoFocus
                            disabled={feedback !== null && feedback.type !== 'complete'}
                        />
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={!userAnswer || (feedback !== null && feedback.type !== 'complete')}
                        >
                            Check Answer
                        </button>
                    </form>
                </>
            ) : (
                <div className="completion-screen">
                    <h2>🎉 Amazing Work! 🎉</h2>
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

export default AdditionGame
