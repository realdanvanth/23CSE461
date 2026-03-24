import { motion } from 'framer-motion';
import { useProgress } from '../context/ProgressContext';
import './Rewards.css';

const ALL_BADGES = [
    { id: 'builder', icon: '🧩', name: 'Shape Builder', desc: 'Saved your first creation!' },
    { id: 'quiz-5', icon: '🌟', name: 'Quiz Star', desc: 'Got 5+ correct in a quiz!' },
    { id: 'quiz-master', icon: '🏆', name: 'Quiz Master', desc: 'Got a perfect score!' },
    { id: 'explorer', icon: '🌐', name: 'Explorer', desc: 'Explored a 3D shape!' },
];

const ENCOURAGEMENTS = [
    "You're doing amazing! 🎉",
    "Keep exploring shapes! 🌟",
    "Every star counts! ⭐",
    "You're a geometry genius! 🧠",
    "Learning is fun! 🎨",
];

const STAR_MILESTONES = [
    { stars: 5, label: 'Beginner', icon: '🌱', color: '#C7F5D5' },
    { stars: 15, label: 'Explorer', icon: '🔭', color: '#A8EDEA' },
    { stars: 30, label: 'Builder', icon: '🧩', color: '#A8B5E0' },
    { stars: 50, label: 'Genius', icon: '🧠', color: '#C3A6FF' },
    { stars: 100, label: 'Master', icon: '🏆', color: '#FFE66D' },
];

export default function Rewards() {
    const { stars, badges, quizHighScore, builderCreations, exploredShapes } = useProgress();

    const encouragement = ENCOURAGEMENTS[Math.floor(stars / 5) % ENCOURAGEMENTS.length];

    const currentMilestone = STAR_MILESTONES.filter(m => stars >= m.stars).pop();
    const nextMilestone = STAR_MILESTONES.find(m => stars < m.stars);
    const progressToNext = nextMilestone
        ? ((stars - (currentMilestone?.stars || 0)) / (nextMilestone.stars - (currentMilestone?.stars || 0))) * 100
        : 100;

    return (
        <div className="rewards-page">
            {/* Decorative stars */}
            {[...Array(8)].map((_, i) => (
                <div key={i} className="deco-star" style={{
                    left: `${10 + i * 12}%`,
                    top: `${5 + (i % 3) * 8}%`,
                    animationDelay: `${i * 0.4}s`,
                    fontSize: `${0.8 + (i % 3) * 0.4}rem`,
                }}>⭐</div>
            ))}

            <div className="rewards-header">
                <h1 className="title-lg">🏆 My Rewards</h1>
                <p className="body-sm" style={{ color: 'var(--text-mid)' }}>{encouragement}</p>
            </div>

            {/* Star Counter Hero */}
            <motion.div
                className="star-hero"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
            >
                <motion.div
                    className="big-star"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                    ⭐
                </motion.div>
                <div className="star-count title-xl">{stars}</div>
                <div className="body-md" style={{ color: 'var(--text-mid)' }}>Total Stars</div>

                {currentMilestone && (
                    <div className="current-rank" style={{ background: currentMilestone.color }}>
                        {currentMilestone.icon} {currentMilestone.label}
                    </div>
                )}
            </motion.div>

            {/* Progress to next milestone */}
            {nextMilestone && (
                <div className="milestone-progress">
                    <div className="milestone-labels">
                        <span className="body-sm">{currentMilestone?.icon || '🌱'} {currentMilestone?.label || 'Start'}</span>
                        <span className="body-sm">{nextMilestone.icon} {nextMilestone.label} ({nextMilestone.stars} ⭐)</span>
                    </div>
                    <div className="milestone-bar">
                        <motion.div
                            className="milestone-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressToNext}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        />
                    </div>
                    <p className="body-sm" style={{ color: 'var(--text-light)', textAlign: 'center', marginTop: 6 }}>
                        {nextMilestone.stars - stars} more stars to reach {nextMilestone.label}!
                    </p>
                </div>
            )}

            {/* Stats */}
            <div className="stats-row">
                <div className="stat-card">
                    <span className="stat-icon">❓</span>
                    <span className="stat-num">{quizHighScore}</span>
                    <span className="stat-lbl">Best Quiz</span>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">🧩</span>
                    <span className="stat-num">{builderCreations}</span>
                    <span className="stat-lbl">Creations</span>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">🌐</span>
                    <span className="stat-num">{exploredShapes.length}</span>
                    <span className="stat-lbl">Shapes</span>
                </div>
            </div>

            {/* Badges */}
            <div className="badges-section">
                <h2 className="title-sm" style={{ marginBottom: 14 }}>🎖️ Badges</h2>
                <div className="badges-grid">
                    {ALL_BADGES.map((badge, i) => {
                        const earned = badges.includes(badge.id);
                        return (
                            <motion.div
                                key={badge.id}
                                className={`badge-card ${earned ? 'earned' : 'locked'}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={earned ? { scale: 1.05 } : {}}
                            >
                                <span className="badge-icon" style={{ filter: earned ? 'none' : 'grayscale(1)' }}>
                                    {earned ? badge.icon : '🔒'}
                                </span>
                                <div className="badge-info">
                                    <div className="badge-name">{badge.name}</div>
                                    <div className="badge-desc">{badge.desc}</div>
                                </div>
                                {earned && <span className="badge-check">✓</span>}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
