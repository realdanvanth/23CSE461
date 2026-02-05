# CalmSpace - Breathing App (React Lab Submission)

## 1. About the Use Case

CalmSpace is a comprehensive mindfulness and wellness application built with React that helps autistic kids manage stress through breathing exercises, meditation sessions, focus timers, and personal journaling. The application provides an intuitive interface for users to track their mindfulness journey with features like session history, achievements, and customizable settings. Users can create accounts to sync their progress across devices, customize their breathing patterns and speeds, and document their mental wellness journey through a personal journal with mood tracking capabilities.

---

## 2. What Was Added Today (Extension)

### New Pages Added:
| New Component | File Path | Description |
|--------------|-----------|-------------|
| **Journal Page** | `src/components/Journal.jsx` | Extended forms page with CRUD operations for mindfulness journal entries |
| **Settings Page** | `src/components/Settings.jsx` | Comprehensive settings form with validation |
| **Feedback Page** | `src/components/FeedbackCounter.jsx` | Class Component with session feedback form |

### New Features Added:
- **React Router** - Added `react-router-dom` for proper URL-based routing
- **Class Component** - Created `FeedbackCounter.jsx` as a Class Component with lifecycle methods
- **Extended Forms** - Journal page with multiple form inputs (date, select, textarea)
- **Form Validation** - Settings page with client-side validation
- **Navigation** - Updated sidebar with links to all new pages

---

## 3. What Was Already There (Lab 1 - Yesterday)

| Existing Component | File Path | Description |
|-------------------|-----------|-------------|
| Dashboard | `src/components/Dashboard.jsx` | Main dashboard view |
| BreathingCircle | `src/components/BreathingCircle.jsx` | Breathing exercise with animation |
| Meditation | `src/components/Meditation.jsx` | Guided meditation component |
| FocusTimer | `src/components/FocusTimer.jsx` | Pomodoro-style timer |
| History | `src/components/History.jsx` | Session history tracking |
| Achievements | `src/components/Achievements.jsx` | User achievements display |
| Layout | `src/components/Layout.jsx` | App layout with sidebar navigation |
| Button | `src/components/Button.jsx` | Reusable button component |
| AuthModal | `src/components/AuthModal.jsx` | Login/Register modal |
| SoundPlayer | `src/components/SoundPlayer.jsx` | Ambient sound player |
| SensoryContext | `src/context/SensoryContext.jsx` | Global state management |
| useAudio | `src/hooks/useAudio.js` | Custom hook for audio |

---

## 4. React Concepts Implementation Table

| Concept | Code Proof | File Location |
|---------|-----------|---------------|
| **Function Component** | `function Dashboard({ onNavigate }) { ... }` | `src/components/Dashboard.jsx` (Line 1-50) |
| **Class Component** | `class FeedbackCounter extends Component { constructor(props) { super(props); this.state = {...} } }` | `src/components/FeedbackCounter.jsx` (Line 10-130) |
| **Event Handling** | `onClick={handleSubmit}`, `onChange={handleChange}`, `onBlur={handleBlur}` | `src/components/Settings.jsx` (Lines 70-95) |
| **State Management** | `const [formData, setFormData] = useState({...})`, `this.setState({...})` | `src/components/Settings.jsx` (Line 24-32), `src/components/FeedbackCounter.jsx` (Line 15-20) |
| **Stateless Component** | `function Button({ children, variant, className, onClick }) { return <button>...</button> }` | `src/components/Button.jsx` (Line 1-17) |
| **Forms** | Controlled inputs with validation, select, textarea, checkbox | `src/components/Settings.jsx`, `src/components/Journal.jsx` |
| **Hooks - useState** | `const [entries, setEntries] = useState([]);` | `src/components/Journal.jsx` (Line 17-30) |
| **Hooks - useEffect** | `useEffect(() => { localStorage.getItem('journalEntries'); }, []);` | `src/components/Journal.jsx` (Line 32-42) |
| **Hooks - useContext** | `const { theme, toggleTheme } = useSensory();` | `src/components/Settings.jsx` (Line 15-20) |
| **Custom Hooks** | `export function useAudio() { const [currentSound, setCurrentSound] = useState('none'); ... }` | `src/hooks/useAudio.js` (Line 257-318) |
| **Context API** | `const SensoryContext = createContext(); export function SensoryProvider({ children }) {...}` | `src/context/SensoryContext.jsx` (Line 1-242) |
| **React Router** | `<BrowserRouter><Routes><Route path="/journal" element={<Journal />} /></Routes></BrowserRouter>` | `src/App.jsx` (Line 1-90) |
| **Lifecycle Methods** | `componentDidMount() {...}`, `componentDidUpdate(prevProps, prevState) {...}` | `src/components/FeedbackCounter.jsx` (Line 27-42) |

---

## 5. Detailed Code Proofs

### Function Component (Dashboard.jsx)
```jsx
import React from 'react';

function Dashboard({ onNavigate }) {
  // Component logic with hooks
  return (
    <div className="dashboard">
      {/* JSX content */}
    </div>
  );
}

export default Dashboard;
```

### Class Component (FeedbackCounter.jsx)
```jsx
import React, { Component } from 'react';

class FeedbackCounter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            moodScore: 3,
            feedback: '',
            submitted: false,
            sessionCount: 0
        };
        this.handleMoodChange = this.handleMoodChange.bind(this);
    }

    componentDidMount() {
        console.log('FeedbackCounter mounted');
        const savedCount = localStorage.getItem('feedbackSessionCount');
        if (savedCount) {
            this.setState({ sessionCount: parseInt(savedCount, 10) });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.sessionCount !== this.state.sessionCount) {
            localStorage.setItem('feedbackSessionCount', this.state.sessionCount.toString());
        }
    }

    handleMoodChange(event) {
        this.setState({ moodScore: parseInt(event.target.value, 10) });
    }

    render() {
        return <div>{/* JSX */}</div>;
    }
}
```

### Event Handling (Settings.jsx)
```jsx
// onChange event
const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
};

// onSubmit event
const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation and submission logic
};

// Usage in JSX
<input
    type="text"
    name="displayName"
    value={formData.displayName}
    onChange={handleChange}
    onBlur={handleBlur}
/>
```

### State Management
```jsx
// Function Component with useState
const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    dailyGoal: 10
});

// Class Component with this.state
this.state = {
    moodScore: 3,
    submitted: false
};
this.setState({ moodScore: 5 });
```

### Stateless Component (Button.jsx)
```jsx
import React from 'react';

function Button({ children, variant = 'secondary', className = '', onClick }) {
    return (
        <button
            className={`btn btn-${variant} ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export default Button;
```

### Forms (Journal.jsx)
```jsx
<form onSubmit={handleSubmit}>
    <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
            type="date"
            id="date"
            name="date"
            value={newEntry.date}
            onChange={handleInputChange}
            required
        />
    </div>
    
    <div className="form-group">
        <label htmlFor="mood">How are you feeling?</label>
        <select
            id="mood"
            name="mood"
            value={newEntry.mood}
            onChange={handleInputChange}
        >
            <option value="great">😊 Great</option>
            <option value="neutral">😐 Neutral</option>
        </select>
    </div>

    <div className="form-group">
        <label htmlFor="content">Reflection</label>
        <textarea
            id="content"
            name="content"
            value={newEntry.content}
            onChange={handleInputChange}
            rows="4"
        />
    </div>

    <button type="submit">Save Entry</button>
</form>
```

### React Router (App.jsx)
```jsx
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <SensoryProvider>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/breathing" element={<BreathingCircle />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/feedback" element={<FeedbackCounter />} />
                </Routes>
            </SensoryProvider>
        </BrowserRouter>
    );
}
```

---

## 6. Summary of Extensions

| Category | Points | Implementation |
|----------|--------|----------------|
| **UI Aspects** | 10 Marks | Modern design with CSS variables, dark/light theme, responsive layout, animations |
| **React Concepts** | 30 Marks | Function/Class components, Hooks (useState, useEffect, useContext, custom), Context API, Router, Forms, Events, State Management |
| **Extension Level** | 10 Marks | Added 3 new pages (Journal, Settings, Feedback), React Router integration, Form validation, CRUD operations |

---

## 7. How to Run

```bash
# Navigate to project directory
cd Breathing-App

# Run both frontend and backend
./run.sh

# Or run individually:
cd frontend && npm run dev
cd backend && npm run dev
```

The app will be available at `http://localhost:5173`
