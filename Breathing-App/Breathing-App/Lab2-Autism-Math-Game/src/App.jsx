import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import ProductDescription from './pages/ProductDescription'
import NumberRecognition from './pages/NumberRecognition'
import AdditionGame from './pages/AdditionGame'
import PatternMatching from './pages/PatternMatching'
import ProgressDashboard from './pages/ProgressDashboard'
import { ProgressProvider } from './context/ProgressContext'
import './styles/App.css'

function App() {
  return (
    <ProgressProvider>
      <Router>
        <div className="app">
          <nav className="navbar">
            <div className="nav-brand">🎓 Math Learning Fun</div>
            <div className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/about" className="nav-link">About</Link>
              <Link to="/number-game" className="nav-link">Numbers</Link>
              <Link to="/addition-game" className="nav-link">Addition</Link>
              <Link to="/pattern-game" className="nav-link">Patterns</Link>
              <Link to="/progress" className="nav-link">Progress</Link>
            </div>
          </nav>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<ProductDescription />} />
              <Route path="/number-game" element={<NumberRecognition />} />
              <Route path="/addition-game" element={<AdditionGame />} />
              <Route path="/pattern-game" element={<PatternMatching />} />
              <Route path="/progress" element={<ProgressDashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ProgressProvider>
  )
}

export default App
