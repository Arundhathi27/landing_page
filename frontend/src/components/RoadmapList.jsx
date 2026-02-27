// src/components/RoadmapList.jsx
import { useState, useEffect } from 'react';
import { getRoadmaps, createRoadmap, deleteRoadmap } from '../api';

export default function RoadmapList({ onSelect }) {
    const [roadmaps, setRoadmaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRoadmaps();
    }, []);

    async function fetchRoadmaps() {
        try {
            setLoading(true);
            const data = await getRoadmaps();
            setRoadmaps(data);
        } catch (e) {
            setError('Could not connect to server. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(e) {
        e.preventDefault();
        if (!newTitle.trim()) return;
        try {
            setCreating(true);
            const roadmap = await createRoadmap(newTitle.trim());
            setRoadmaps(prev => [roadmap, ...prev]);
            setShowModal(false);
            setNewTitle('');
        } catch (e) {
            alert(e.message);
        } finally {
            setCreating(false);
        }
    }

    async function handleDelete(e, id) {
        e.stopPropagation();
        if (!confirm('Delete this roadmap and all its steps?')) return;
        try {
            await deleteRoadmap(id);
            setRoadmaps(prev => prev.filter(r => r._id !== id));
        } catch (e) {
            alert(e.message);
        }
    }

    function formatDate(iso) {
        return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    if (loading) {
        return (
            <div className="loader-wrap">
                <div className="loader" />
            </div>
        );
    }

    return (
        <>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Learning Roadmaps</h1>
                    <p className="page-subtitle">Build and manage your personalized learning paths</p>
                </div>
                <button className="btn btn-primary" id="create-roadmap-btn" onClick={() => setShowModal(true)}>
                    + New Roadmap
                </button>
            </div>

            {error && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '14px 18px', color: '#fca5a5', marginBottom: 24, fontSize: 14 }}>
                    ⚠️ {error}
                </div>
            )}

            {roadmaps.length === 0 && !error ? (
                <div className="empty-state">
                    <div className="empty-state-icon">🗺️</div>
                    <h3>No roadmaps yet</h3>
                    <p>Create your first learning path to get started</p>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        + Create your first roadmap
                    </button>
                </div>
            ) : (
                <div className="roadmap-grid">
                    {roadmaps.map(r => (
                        <div
                            key={r._id}
                            className="roadmap-card"
                            id={`roadmap-${r._id}`}
                            onClick={() => onSelect(r._id)}
                        >
                            <div className="roadmap-card-header">
                                <h3 className="roadmap-card-title">{r.title}</h3>
                                <div className="roadmap-card-actions" onClick={e => e.stopPropagation()}>
                                    <button
                                        className="btn btn-danger btn-sm btn-icon"
                                        title="Delete roadmap"
                                        id={`delete-roadmap-${r._id}`}
                                        onClick={e => handleDelete(e, r._id)}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                            <div className="roadmap-card-meta">
                                <span className="step-count-badge">
                                    📋 {r.steps?.length || 0} step{(r.steps?.length || 0) !== 1 ? 's' : ''}
                                </span>
                                <span className="roadmap-card-date">{formatDate(r.createdAt)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Create New Roadmap</h2>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleCreate}>
                            <div className="form-group">
                                <label className="form-label">Roadmap Title</label>
                                <input
                                    id="new-roadmap-title"
                                    className="form-input"
                                    type="text"
                                    placeholder="e.g. Full-Stack Development"
                                    value={newTitle}
                                    onChange={e => setNewTitle(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    id="submit-create-roadmap"
                                    disabled={creating || !newTitle.trim()}
                                >
                                    {creating ? 'Creating…' : 'Create Roadmap'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
