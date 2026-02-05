import React, { useState, useEffect } from 'react';

/**
 * Journal - An extended FORMS page demonstrating:
 * - Multiple form inputs (text, textarea, select, date)
 * - Dynamic form entries list
 * - CRUD operations (Create, Read, Delete)
 * - useState for complex state management
 * - useEffect for persistence
 * - Event handling throughout
 */
function Journal() {
    // STATE for journal entries
    const [entries, setEntries] = useState([]);

    // STATE for new entry form
    const [newEntry, setNewEntry] = useState({
        date: new Date().toISOString().split('T')[0],
        mood: 'neutral',
        title: '',
        content: '',
        gratitude: '',
        goals: ''
    });

    // STATE for form UI
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [filter, setFilter] = useState('all');

    // Load entries from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('journalEntries');
        if (saved) {
            try {
                setEntries(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load journal entries:', e);
            }
        }
    }, []);

    // Save entries to localStorage when changed
    useEffect(() => {
        localStorage.setItem('journalEntries', JSON.stringify(entries));
    }, [entries]);

    // EVENT HANDLER - Input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEntry(prev => ({ ...prev, [name]: value }));
    };

    // EVENT HANDLER - Form submit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!newEntry.title.trim()) {
            alert('Please enter a title for your journal entry');
            return;
        }

        if (editingId) {
            // Update existing entry
            setEntries(prev => prev.map(entry =>
                entry.id === editingId
                    ? { ...newEntry, id: editingId, updatedAt: new Date().toISOString() }
                    : entry
            ));
            setEditingId(null);
        } else {
            // Create new entry
            const entry = {
                ...newEntry,
                id: Date.now(),
                createdAt: new Date().toISOString()
            };
            setEntries(prev => [entry, ...prev]);
        }

        // Reset form
        setNewEntry({
            date: new Date().toISOString().split('T')[0],
            mood: 'neutral',
            title: '',
            content: '',
            gratitude: '',
            goals: ''
        });
        setIsFormOpen(false);
    };

    // EVENT HANDLER - Delete entry
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this entry?')) {
            setEntries(prev => prev.filter(entry => entry.id !== id));
        }
    };

    // EVENT HANDLER - Edit entry
    const handleEdit = (entry) => {
        setNewEntry({
            date: entry.date,
            mood: entry.mood,
            title: entry.title,
            content: entry.content,
            gratitude: entry.gratitude || '',
            goals: entry.goals || ''
        });
        setEditingId(entry.id);
        setIsFormOpen(true);
    };

    // EVENT HANDLER - Cancel edit
    const handleCancel = () => {
        setNewEntry({
            date: new Date().toISOString().split('T')[0],
            mood: 'neutral',
            title: '',
            content: '',
            gratitude: '',
            goals: ''
        });
        setEditingId(null);
        setIsFormOpen(false);
    };

    // Filter entries
    const filteredEntries = entries.filter(entry => {
        if (filter === 'all') return true;
        return entry.mood === filter;
    });

    const getMoodEmoji = (mood) => {
        const moods = {
            great: '😊',
            good: '🙂',
            neutral: '😐',
            low: '😔',
            stressed: '😰'
        };
        return moods[mood] || '😐';
    };

    const getMoodColor = (mood) => {
        const colors = {
            great: '#4ade80',
            good: '#86efac',
            neutral: '#fbbf24',
            low: '#fb923c',
            stressed: '#f87171'
        };
        return colors[mood] || '#fbbf24';
    };

    return (
        <div className="journal-page">
            <div className="journal-header">
                <h2>Mindfulness Journal</h2>
                <p>Reflect on your journey and track your mental wellness</p>
            </div>

            {/* Action Bar */}
            <div className="journal-actions">
                <button
                    className="btn btn-primary"
                    onClick={() => setIsFormOpen(!isFormOpen)}
                >
                    {isFormOpen ? '✕ Close' : '+ New Entry'}
                </button>

                <div className="filter-group">
                    <label htmlFor="moodFilter">Filter: </label>
                    <select
                        id="moodFilter"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Moods</option>
                        <option value="great">😊 Great</option>
                        <option value="good">🙂 Good</option>
                        <option value="neutral">😐 Neutral</option>
                        <option value="low">😔 Low</option>
                        <option value="stressed">😰 Stressed</option>
                    </select>
                </div>
            </div>

            {/* Journal Entry Form */}
            {isFormOpen && (
                <form className="journal-form" onSubmit={handleSubmit}>
                    <h3>{editingId ? 'Edit Entry' : 'New Journal Entry'}</h3>

                    <div className="form-row">
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
                                <option value="good">🙂 Good</option>
                                <option value="neutral">😐 Neutral</option>
                                <option value="low">😔 Low</option>
                                <option value="stressed">😰 Stressed</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="title">Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={newEntry.title}
                            onChange={handleInputChange}
                            placeholder="Give your entry a title..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">Reflection</label>
                        <textarea
                            id="content"
                            name="content"
                            value={newEntry.content}
                            onChange={handleInputChange}
                            placeholder="Write about your day, thoughts, or feelings..."
                            rows="4"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="gratitude">Gratitude (What are you thankful for?)</label>
                        <textarea
                            id="gratitude"
                            name="gratitude"
                            value={newEntry.gratitude}
                            onChange={handleInputChange}
                            placeholder="List things you're grateful for today..."
                            rows="2"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="goals">Tomorrow's Intentions</label>
                        <textarea
                            id="goals"
                            name="goals"
                            value={newEntry.goals}
                            onChange={handleInputChange}
                            placeholder="What do you want to focus on tomorrow?"
                            rows="2"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {editingId ? 'Update Entry' : 'Save Entry'}
                        </button>
                    </div>
                </form>
            )}

            {/* Entries List */}
            <div className="journal-entries">
                {filteredEntries.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">📔</span>
                        <h3>No journal entries yet</h3>
                        <p>Start documenting your mindfulness journey by creating your first entry.</p>
                    </div>
                ) : (
                    filteredEntries.map(entry => (
                        <div key={entry.id} className="journal-entry-card">
                            <div className="entry-header">
                                <div className="entry-meta">
                                    <span
                                        className="mood-badge"
                                        style={{ backgroundColor: getMoodColor(entry.mood) }}
                                    >
                                        {getMoodEmoji(entry.mood)}
                                    </span>
                                    <span className="entry-date">
                                        {new Date(entry.date).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className="entry-actions">
                                    <button
                                        className="btn-icon"
                                        onClick={() => handleEdit(entry)}
                                        title="Edit"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="btn-icon"
                                        onClick={() => handleDelete(entry.id)}
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>

                            <h3 className="entry-title">{entry.title}</h3>

                            {entry.content && (
                                <p className="entry-content">{entry.content}</p>
                            )}

                            {entry.gratitude && (
                                <div className="entry-section">
                                    <strong>🙏 Gratitude:</strong>
                                    <p>{entry.gratitude}</p>
                                </div>
                            )}

                            {entry.goals && (
                                <div className="entry-section">
                                    <strong>🎯 Intentions:</strong>
                                    <p>{entry.goals}</p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Journal;
