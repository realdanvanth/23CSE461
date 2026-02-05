import React, { useState } from 'react';
import { useSensory } from '../context/SensoryContext';
import AuthModal from './AuthModal';

// SVG Icons
const Icons = {
    home: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    breathe: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v8m-4-4h8" /></svg>,
    meditate: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0 0 6 3 3 0 0 0 0-6z" /><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><path d="M12 11c-2 0-6 1-6 4" /><path d="M12 11c2 0 6 1 6 4" /></svg>,
    focus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    history: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    trophy: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>,
    logo: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>,
    sun: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>,
    moon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>,
    user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    logout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
    cloud: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /></svg>
};

function Layout({ children, title, subtitle, currentView, onViewChange }) {
    const { theme, toggleTheme, user, isAuthenticated, login, register, logout } = useSensory();
    const [showAuth, setShowAuth] = useState(false);

    // SVG Icons for new navigation items
    const settingsIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
    const journalIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;
    const feedbackIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;

    const navItems = [
        { id: 'home', label: 'Dashboard', icon: Icons.home },
        { id: 'breathing', label: 'Breathe', icon: Icons.breathe },
        { id: 'meditation', label: 'Meditate', icon: Icons.meditate },
        { id: 'focus', label: 'Focus', icon: Icons.focus },
        { id: 'history', label: 'History', icon: Icons.history },
        { id: 'achievements', label: 'Achievements', icon: Icons.trophy },
        { id: 'journal', label: 'Journal', icon: journalIcon },
        { id: 'feedback', label: 'Feedback', icon: feedbackIcon },
        { id: 'settings', label: 'Settings', icon: settingsIcon },
    ];

    const handleAuth = async (mode, email, password, name) => {
        if (mode === 'login') {
            await login(email, password);
        } else {
            await register(email, password, name);
        }
    };

    return (
        <div className="app-container" data-theme={theme}>
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <div className="sidebar-logo">{Icons.logo}</div>
                    <span className="sidebar-title">CalmSpace</span>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                            onClick={() => onViewChange(item.id)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* User Section */}
                <div style={{ marginTop: 'auto', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--border-light)' }}>
                    {isAuthenticated ? (
                        <>
                            <div className="user-info">
                                <div className="user-avatar">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="user-details">
                                    <span className="user-name">{user?.name}</span>
                                    <span className="user-sync">
                                        {Icons.cloud}
                                        <span>Synced</span>
                                    </span>
                                </div>
                            </div>
                            <button className="nav-item" onClick={logout}>
                                {Icons.logout}
                                <span>Sign Out</span>
                            </button>
                        </>
                    ) : (
                        <button className="nav-item" onClick={() => setShowAuth(true)}>
                            {Icons.user}
                            <span>Sign In</span>
                        </button>
                    )}

                    <button
                        className="nav-item"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? Icons.moon : Icons.sun}
                        <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                {title && (
                    <header className="page-header">
                        <h1 className="page-title">{title}</h1>
                        {subtitle && <p className="page-subtitle">{subtitle}</p>}
                    </header>
                )}
                <div className="content-wrapper">
                    {children}
                </div>
            </main>

            {showAuth && (
                <AuthModal
                    onClose={() => setShowAuth(false)}
                    onSuccess={handleAuth}
                />
            )}
        </div>
    );
}

export default Layout;
