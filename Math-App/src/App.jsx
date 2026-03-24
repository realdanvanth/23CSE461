import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ShapeBuilder from './pages/ShapeBuilder';
import ShapeExplorer from './pages/ShapeExplorer';
import ShapeQuiz from './pages/ShapeQuiz';
import Rewards from './pages/Rewards';
import ResearchPage from './pages/ResearchPage';
import { ProgressProvider } from './context/ProgressContext';

export default function App() {
  return (
    <BrowserRouter>
      <DndProvider backend={HTML5Backend}>
        <ProgressProvider>
          <div className="app-wrapper">
            <div className="page-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/builder" element={<ShapeBuilder />} />
                <Route path="/explorer" element={<ShapeExplorer />} />
                <Route path="/quiz" element={<ShapeQuiz />} />
                <Route path="/rewards" element={<Rewards />} />
                <Route path="/research" element={<ResearchPage />} />
              </Routes>
            </div>
            <Navbar />
          </div>
        </ProgressProvider>
      </DndProvider>
    </BrowserRouter>
  );
}
