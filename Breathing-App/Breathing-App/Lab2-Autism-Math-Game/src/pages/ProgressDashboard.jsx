import { useProgress } from '../context/ProgressContext'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D']

function ProgressDashboard() {
    const { progress, resetProgress } = useProgress()

    const gameData = [
        { name: 'Number Recognition', games: progress.numberRecognition.length, color: '#FF6B6B' },
        { name: 'Addition', games: progress.addition.length, color: '#4ECDC4' },
        { name: 'Pattern Matching', games: progress.patternMatching.length, color: '#FFE66D' }
    ]

    const scoreData = [
        {
            name: 'Numbers',
            score: progress.numberRecognition.reduce((sum, g) => sum + g.score, 0)
        },
        {
            name: 'Addition',
            score: progress.addition.reduce((sum, g) => sum + g.score, 0)
        },
        {
            name: 'Patterns',
            score: progress.patternMatching.reduce((sum, g) => sum + g.score, 0)
        }
    ]

    const accuracyData = gameData.map(game => {
        let correct = 0
        let total = 0

        if (game.name === 'Number Recognition') {
            progress.numberRecognition.forEach(g => {
                correct += g.correct
                total += g.total
            })
        } else if (game.name === 'Addition') {
            progress.addition.forEach(g => {
                correct += g.correct
                total += g.total
            })
        } else {
            progress.patternMatching.forEach(g => {
                correct += g.correct
                total += g.total
            })
        }

        return {
            name: game.name,
            accuracy: total > 0 ? Math.round((correct / total) * 100) : 0
        }
    })

    return (
        <div className="progress-page">
            <h1 className="page-title">My Progress Dashboard 📊</h1>

            <div className="stats-overview">
                <div className="stat-card">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-value">{progress.totalScore}</div>
                    <div className="stat-label">Total Score</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🎮</div>
                    <div className="stat-value">{progress.gamesPlayed}</div>
                    <div className="stat-label">Games Played</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-value">
                        {progress.gamesPlayed > 0 ? Math.round(progress.totalScore / progress.gamesPlayed) : 0}
                    </div>
                    <div className="stat-label">Avg Score/Game</div>
                </div>
            </div>

            {progress.gamesPlayed > 0 ? (
                <>
                    <div className="charts-container">
                        <div className="chart-card">
                            <h3>Games Played by Type</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={gameData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="games" fill="#4ECDC4" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="chart-card">
                            <h3>Total Score by Game</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={scoreData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={(entry) => `${entry.name}: ${entry.score}`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="score"
                                    >
                                        {scoreData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="chart-card">
                            <h3>Accuracy by Game Type</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={accuracyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="accuracy" stroke="#FF6B6B" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="achievements">
                        <h2>Achievements Unlocked 🏅</h2>
                        <div className="achievements-grid">
                            {progress.gamesPlayed >= 5 && (
                                <div className="achievement-badge">
                                    <div className="badge-icon">🎯</div>
                                    <div className="badge-name">Dedicated Learner</div>
                                    <div className="badge-desc">Played 5+ games</div>
                                </div>
                            )}
                            {progress.totalScore >= 100 && (
                                <div className="achievement-badge">
                                    <div className="badge-icon">💯</div>
                                    <div className="badge-name">Century Scorer</div>
                                    <div className="badge-desc">Scored 100+ points</div>
                                </div>
                            )}
                            {progress.numberRecognition.length >= 3 && (
                                <div className="achievement-badge">
                                    <div className="badge-icon">🔢</div>
                                    <div className="badge-name">Number Master</div>
                                    <div className="badge-desc">Completed 3+ number games</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <button className="reset-button" onClick={resetProgress}>
                        Reset All Progress
                    </button>
                </>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">🎮</div>
                    <h2>No games played yet!</h2>
                    <p>Start playing games to see your amazing progress here!</p>
                </div>
            )}
        </div>
    )
}

export default ProgressDashboard
