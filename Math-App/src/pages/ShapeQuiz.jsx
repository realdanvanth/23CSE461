import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../context/ProgressContext';
import './ShapeQuiz.css';

// All quiz questions
const ALL_QUESTIONS = [
    // 2D Shapes
    { id: 1, question: 'Which shape has 3 sides?', shapeType: 'triangle', answer: 'Triangle', options: ['Circle', 'Triangle', 'Square', 'Rectangle'], color: '#FFE66D' },
    { id: 2, question: 'Which shape has 4 equal sides?', shapeType: 'square', answer: 'Square', options: ['Triangle', 'Oval', 'Square', 'Hexagon'], color: '#A8B5E0' },
    { id: 3, question: 'Which shape has NO corners?', shapeType: 'circle', answer: 'Circle', options: ['Square', 'Triangle', 'Rectangle', 'Circle'], color: '#4ECDC4' },
    { id: 4, question: 'Which shape has 6 sides?', shapeType: 'hexagon', answer: 'Hexagon', options: ['Pentagon', 'Hexagon', 'Square', 'Octagon'], color: '#FF6B6B' },
    { id: 5, question: 'Which shape has 4 sides but is longer than it is tall?', shapeType: 'rectangle', answer: 'Rectangle', options: ['Square', 'Triangle', 'Rectangle', 'Circle'], color: '#C3A6FF' },
    { id: 6, question: 'Which shape looks like a ball?', shapeType: 'sphere', answer: 'Sphere', options: ['Cube', 'Sphere', 'Cone', 'Cylinder'], color: '#A8B5E0', is3D: true },
    { id: 7, question: 'Which shape looks like a box?', shapeType: 'cube', answer: 'Cube', options: ['Sphere', 'Cone', 'Cube', 'Torus'], color: '#4ECDC4', is3D: true },
    { id: 8, question: 'Which shape has a pointy top and a round bottom?', shapeType: 'cone', answer: 'Cone', options: ['Cylinder', 'Cube', 'Sphere', 'Cone'], color: '#FF6B6B', is3D: true },
    { id: 9, question: 'Which shape looks like a donut?', shapeType: 'torus', answer: 'Torus', options: ['Sphere', 'Torus', 'Cylinder', 'Cone'], color: '#F5C842', is3D: true },
    { id: 10, question: 'Which shape has 5 points?', shapeType: 'star', answer: 'Star', options: ['Hexagon', 'Diamond', 'Star', 'Pentagon'], color: '#FFE66D' },
    { id: 11, question: 'How many sides does a triangle have?', shapeType: 'triangle', answer: '3', options: ['2', '3', '4', '5'], color: '#FFE66D', isCount: true },
    { id: 12, question: 'How many faces does a cube have?', shapeType: 'cube', answer: '6', options: ['4', '5', '6', '8'], color: '#4ECDC4', isCount: true, is3D: true },
];

function ShapeDisplay({ type, color, is3D }) {
    const size = 100;
    if (is3D) {
        const icons = { sphere: '🔵', cube: '🟦', cone: '🔺', cylinder: '🥫', torus: '🍩', pyramid: '🔷' };
        return (
            <div className="quiz-shape-3d" style={{ background: color + '22', borderColor: color }}>
                <span style={{ fontSize: '5rem' }}>{icons[type] || '❓'}</span>
            </div>
        );
    }
    const shapes = {
        circle: <circle cx="60" cy="60" r="52" fill={color} stroke="white" strokeWidth="3" />,
        square: <rect x="8" y="8" width="104" height="104" rx="10" fill={color} stroke="white" strokeWidth="3" />,
        triangle: <polygon points="60,8 112,112 8,112" fill={color} stroke="white" strokeWidth="3" />,
        rectangle: <rect x="4" y="24" width="112" height="72" rx="10" fill={color} stroke="white" strokeWidth="3" />,
        hexagon: <polygon points="60,4 108,30 108,90 60,116 12,90 12,30" fill={color} stroke="white" strokeWidth="3" />,
        star: <polygon points="60,4 73,44 116,44 83,68 96,108 60,86 24,108 37,68 4,44 47,44" fill={color} stroke="white" strokeWidth="2" />,
        oval: <ellipse cx="60" cy="60" rx="56" ry="36" fill={color} stroke="white" strokeWidth="3" />,
        diamond: <polygon points="60,4 116,60 60,116 4,60" fill={color} stroke="white" strokeWidth="3" />,
        torus: null,
    };
    return (
        <div className="quiz-shape-display">
            <svg width={size * 1.2} height={size * 1.2} viewBox="0 0 120 120">
                {shapes[type] || <circle cx="60" cy="60" r="52" fill={color} />}
            </svg>
        </div>
    );
}

function ConfettiPiece({ x, color, delay }) {
    return (
        <motion.div
            className="confetti-piece"
            style={{ left: `${x}%`, background: color }}
            initial={{ y: -20, opacity: 1, rotate: 0 }}
            animate={{ y: '110vh', opacity: 0, rotate: 720 }}
            transition={{ duration: 2.5, delay, ease: 'easeIn' }}
        />
    );
}

const CONFETTI_COLORS = ['#4ECDC4', '#FFE66D', '#FF6B6B', '#C3A6FF', '#A8B5E0', '#F5C842'];

function Confetti() {
    const pieces = Array.from({ length: 30 }, (_, i) => ({
        x: Math.random() * 100,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: Math.random() * 0.5,
    }));
    return (
        <div className="confetti-container">
            {pieces.map((p, i) => <ConfettiPiece key={i} {...p} />)}
        </div>
    );
}

function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
}

export default function ShapeQuiz() {
    const [questions] = useState(() => shuffle(ALL_QUESTIONS).slice(0, 10));
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [score, setScore] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [finished, setFinished] = useState(false);
    const [shake, setShake] = useState(false);
    const { updateQuizScore } = useProgress();

    const q = questions[current];

    const handleAnswer = useCallback((option) => {
        if (selected !== null) return;
        setSelected(option);
        const correct = option === q.answer;
        setIsCorrect(correct);
        if (correct) {
            setScore(s => s + 1);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2500);
        } else {
            setShake(true);
            setTimeout(() => setShake(false), 600);
        }
    }, [selected, q]);

    const handleNext = useCallback(() => {
        if (current + 1 >= questions.length) {
            setFinished(true);
            updateQuizScore(score + (isCorrect ? 1 : 0));
        } else {
            setCurrent(c => c + 1);
            setSelected(null);
            setIsCorrect(null);
        }
    }, [current, questions.length, score, isCorrect, updateQuizScore]);

    const handleRestart = () => {
        setCurrent(0);
        setSelected(null);
        setIsCorrect(null);
        setScore(0);
        setFinished(false);
    };

    // ─── Keyboard Events ───
    useEffect(() => {
        const handleKeyDown = (e) => {
            // 1-4: select option by index
            if (['1', '2', '3', '4'].includes(e.key)) {
                const idx = parseInt(e.key, 10) - 1;
                if (idx < q.options.length && selected === null) {
                    handleAnswer(q.options[idx]);
                }
            }
            // Enter or Space: go to next question
            if ((e.key === 'Enter' || e.key === ' ') && selected !== null) {
                e.preventDefault();
                handleNext();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [q, selected, handleAnswer, handleNext]);

    if (finished) {
        const finalScore = score + (isCorrect ? 0 : 0); // already counted
        const pct = Math.round((score / questions.length) * 100);
        return (
            <div className="quiz-page">
                <motion.div
                    className="quiz-result"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                >
                    <div className="result-emoji">{pct >= 80 ? '🏆' : pct >= 50 ? '🌟' : '💪'}</div>
                    <h1 className="title-xl" style={{ color: 'var(--text-dark)' }}>
                        {pct >= 80 ? 'Amazing!' : pct >= 50 ? 'Great job!' : 'Keep trying!'}
                    </h1>
                    <p className="body-lg" style={{ color: 'var(--text-mid)', marginTop: 8 }}>
                        You got <strong style={{ color: 'var(--teal-dark)' }}>{score}</strong> out of <strong>{questions.length}</strong> correct!
                    </p>
                    <div className="result-stars">
                        {Array.from({ length: questions.length }, (_, i) => (
                            <span key={i} style={{ fontSize: '1.5rem', opacity: i < score ? 1 : 0.25 }}>⭐</span>
                        ))}
                    </div>
                    <p className="body-md" style={{ color: 'var(--teal-dark)', fontWeight: 800 }}>+{score} stars earned!</p>
                    <button className="btn btn-primary mt-6" onClick={handleRestart} style={{ width: '100%', fontSize: '1.2rem' }}>
                        🔄 Play Again
                    </button>
                </motion.div>
                {pct >= 80 && <Confetti />}
            </div>
        );
    }

    return (
        <div className="quiz-page">
            {showConfetti && <Confetti />}

            {/* Progress */}
            <div className="quiz-progress-bar">
                <div className="quiz-progress-fill" style={{ width: `${((current) / questions.length) * 100}%` }} />
            </div>

            <div className="quiz-header">
                <span className="quiz-counter body-md">{current + 1} / {questions.length}</span>
                <span className="quiz-score">⭐ {score}</span>
            </div>

            {/* Question */}
            <motion.div
                key={current}
                className="quiz-card"
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.35 }}
            >
                <p className="quiz-question title-md">{q.question}</p>

                <div className={`quiz-shape-wrap ${shake ? 'shake' : ''}`}>
                    <ShapeDisplay type={q.shapeType} color={q.color} is3D={q.is3D} />
                </div>

                {/* Feedback */}
                <AnimatePresence>
                    {isCorrect !== null && (
                        <motion.div
                            className={`feedback-banner ${isCorrect ? 'correct' : 'wrong'}`}
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {isCorrect ? '🎉 Correct! Great job!' : `❌ The answer is: ${q.answer}`}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Options */}
                <div className="quiz-options">
                    {q.options.map((option, idx) => {
                        let state = 'default';
                        if (selected !== null) {
                            if (option === q.answer) state = 'correct';
                            else if (option === selected) state = 'wrong';
                            else state = 'dim';
                        }
                        return (
                            <motion.button
                                key={option}
                                className={`quiz-option ${state}`}
                                onClick={() => handleAnswer(option)}
                                disabled={selected !== null}
                                whileHover={selected === null ? { scale: 1.03 } : {}}
                                whileTap={selected === null ? { scale: 0.97 } : {}}
                            >
                                <span className="quiz-key-badge">{idx + 1}</span>
                                {option}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Keyboard hints */}
                <div className="quiz-kbd-hints">
                    <span>⌨️ Press <kbd>1</kbd>–<kbd>4</kbd> to answer</span>
                    {selected !== null && <span><kbd>Enter</kbd> for next</span>}
                </div>

                {selected !== null && (
                    <motion.button
                        className="btn btn-primary w-full mt-4"
                        style={{ fontSize: '1.1rem' }}
                        onClick={handleNext}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {current + 1 >= questions.length ? '🏁 See Results' : 'Next Question →'}
                    </motion.button>
                )}
            </motion.div>
        </div>
    );
}
