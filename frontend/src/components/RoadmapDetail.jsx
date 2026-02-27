// src/components/RoadmapDetail.jsx
import { useState, useEffect, useRef } from 'react';
import { getRoadmap, updateRoadmapTitle, deleteRoadmap, addStep, updateStep, deleteStep, reorderSteps } from '../api';

export default function RoadmapDetail({ roadmapId, onBack, onDeleted }) {
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(true);

    // Editing roadmap title
    const [editingTitle, setEditingTitle] = useState(false);
    const [titleValue, setTitleValue] = useState('');

    // Adding step
    const [showAddStep, setShowAddStep] = useState(false);
    const [newStepName, setNewStepName] = useState('');
    const [addingStep, setAddingStep] = useState(false);

    // Editing a step inline
    const [editingStepId, setEditingStepId] = useState(null);
    const [editingStepName, setEditingStepName] = useState('');

    // Drag-and-drop reorder
    const dragIndex = useRef(null);

    useEffect(() => {
        fetchRoadmap();
    }, [roadmapId]);

    async function fetchRoadmap() {
        try {
            setLoading(true);
            const data = await getRoadmap(roadmapId);
            setRoadmap(data);
            setTitleValue(data.title);
        } catch (e) {
            alert('Failed to load roadmap');
        } finally {
            setLoading(false);
        }
    }

    // ── Title CRUD ──────────────────────────────────────────────────────────

    async function handleSaveTitle() {
        if (!titleValue.trim()) return;
        try {
            const updated = await updateRoadmapTitle(roadmapId, titleValue.trim());
            setRoadmap(prev => ({ ...prev, title: updated.title }));
            setEditingTitle(false);
        } catch (e) {
            alert(e.message);
        }
    }

    async function handleDeleteRoadmap() {
        if (!confirm('Delete this roadmap?')) return;
        try {
            await deleteRoadmap(roadmapId);
            onDeleted();
        } catch (e) {
            alert(e.message);
        }
    }

    // ── Step CRUD ───────────────────────────────────────────────────────────

    async function handleAddStep(e) {
        e.preventDefault();
        if (!newStepName.trim()) return;
        try {
            setAddingStep(true);
            const nextOrder = roadmap.steps.length > 0
                ? Math.max(...roadmap.steps.map(s => s.order)) + 1
                : 1;
            await addStep(roadmapId, { name: newStepName.trim(), order: nextOrder });
            // Re-fetch to get the full updated doc
            const updated = await getRoadmap(roadmapId);
            setRoadmap(updated);
            setNewStepName('');
            setShowAddStep(false);
        } catch (e) {
            alert(e.message);
        } finally {
            setAddingStep(false);
        }
    }

    function startEditStep(step) {
        setEditingStepId(step._id);
        setEditingStepName(step.name);
    }

    async function handleSaveStep(stepId) {
        if (!editingStepName.trim()) return;
        try {
            await updateStep(roadmapId, stepId, { name: editingStepName.trim() });
            setRoadmap(prev => ({
                ...prev,
                steps: prev.steps.map(s => s._id === stepId ? { ...s, name: editingStepName.trim() } : s)
            }));
        } catch (e) {
            alert(e.message);
        } finally {
            setEditingStepId(null);
        }
    }

    async function handleDeleteStep(stepId) {
        if (!confirm('Delete this step?')) return;
        try {
            await deleteStep(roadmapId, stepId);
            setRoadmap(prev => ({
                ...prev,
                steps: prev.steps.filter(s => s._id !== stepId)
            }));
        } catch (e) {
            alert(e.message);
        }
    }

    // ── Drag-and-Drop Reorder ───────────────────────────────────────────────

    function handleDragStart(index) {
        dragIndex.current = index;
    }

    function handleDragOver(e, index) {
        e.preventDefault();
        if (dragIndex.current === index) return;

        const steps = [...roadmap.steps];
        const dragged = steps[dragIndex.current];
        steps.splice(dragIndex.current, 1);
        steps.splice(index, 0, dragged);
        dragIndex.current = index;

        // Update local order numbers
        const reordered = steps.map((s, i) => ({ ...s, order: i + 1 }));
        setRoadmap(prev => ({ ...prev, steps: reordered }));
    }

    async function handleDragEnd() {
        try {
            const stepsPayload = roadmap.steps.map(s => ({ id: s._id, order: s.order }));
            await reorderSteps(roadmapId, stepsPayload);
        } catch (e) {
            // Refetch to restore consistent state if API fails
            fetchRoadmap();
        }
        dragIndex.current = null;
    }

    // ── Render ───────────────────────────────────────────────────────────────

    if (loading) {
        return (
            <div className="loader-wrap">
                <div className="loader" />
            </div>
        );
    }

    if (!roadmap) return null;

    return (
        <>
            <button className="back-btn" id="back-btn" onClick={onBack}>
                ← Back to Roadmaps
            </button>

            <div className="roadmap-detail-header">
                <div style={{ flex: 1 }}>
                    {editingTitle ? (
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                            <input
                                id="edit-title-input"
                                className="form-input"
                                style={{ fontSize: 22, fontWeight: 700, maxWidth: 420 }}
                                value={titleValue}
                                onChange={e => setTitleValue(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSaveTitle()}
                                autoFocus
                            />
                            <button className="btn btn-primary btn-sm" id="save-title-btn" onClick={handleSaveTitle}>Save</button>
                            <button className="btn btn-secondary btn-sm" onClick={() => { setEditingTitle(false); setTitleValue(roadmap.title); }}>Cancel</button>
                        </div>
                    ) : (
                        <h1 className="roadmap-detail-title">{roadmap.title}</h1>
                    )}
                    <p className="text-muted" style={{ marginTop: 6 }}>
                        {roadmap.steps.length} step{roadmap.steps.length !== 1 ? 's' : ''} · Created {new Date(roadmap.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="roadmap-detail-actions">
                    {!editingTitle && (
                        <button className="btn btn-secondary" id="edit-title-btn" onClick={() => setEditingTitle(true)}>
                            ✏️ Edit Title
                        </button>
                    )}
                    <button className="btn btn-danger" id="delete-roadmap-detail-btn" onClick={handleDeleteRoadmap}>
                        🗑️ Delete
                    </button>
                </div>
            </div>

            <div className="divider" />

            <div className="steps-section-header">
                <span className="steps-section-title">Learning Steps</span>
                <button className="btn btn-primary btn-sm" id="add-step-btn" onClick={() => setShowAddStep(v => !v)}>
                    + Add Step
                </button>
            </div>

            {/* Add Step Form */}
            {showAddStep && (
                <form onSubmit={handleAddStep} style={{
                    background: 'rgba(124,58,237,0.07)',
                    border: '1px solid rgba(124,58,237,0.2)',
                    borderRadius: 10,
                    padding: '18px 20px',
                    marginBottom: 20,
                    display: 'flex',
                    gap: 10,
                    alignItems: 'flex-end',
                    flexWrap: 'wrap'
                }}>
                    <div className="form-group" style={{ flex: 1, marginBottom: 0, minWidth: 200 }}>
                        <label className="form-label">Step Name</label>
                        <input
                            id="new-step-name"
                            className="form-input"
                            type="text"
                            placeholder="e.g. Learn JavaScript Basics"
                            value={newStepName}
                            onChange={e => setNewStepName(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" id="submit-add-step" disabled={addingStep || !newStepName.trim()}>
                        {addingStep ? 'Adding…' : 'Add Step'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => { setShowAddStep(false); setNewStepName(''); }}>
                        Cancel
                    </button>
                </form>
            )}

            {roadmap.steps.length === 0 ? (
                <div className="empty-state" style={{ padding: '48px 24px' }}>
                    <div className="empty-state-icon" style={{ fontSize: 40 }}>📋</div>
                    <h3>No steps yet</h3>
                    <p>Add your first learning step to get started</p>
                </div>
            ) : (
                <div className="timeline">
                    {roadmap.steps.map((step, index) => (
                        <div
                            key={step._id}
                            className="step-item"
                            id={`step-${step._id}`}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={e => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                        >
                            <span className="step-drag-handle" title="Drag to reorder">⠿</span>
                            <div className="step-number">{step.order}</div>
                            <div className="step-content">
                                {editingStepId === step._id ? (
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                                        <input
                                            id={`edit-step-input-${step._id}`}
                                            className="step-name-input"
                                            value={editingStepName}
                                            onChange={e => setEditingStepName(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleSaveStep(step._id)}
                                            autoFocus
                                        />
                                        <button className="btn btn-primary btn-sm" id={`save-step-${step._id}`} onClick={() => handleSaveStep(step._id)}>Save</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => setEditingStepId(null)}>Cancel</button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="step-name">{step.name}</div>
                                        <div className="step-order-label">Step {step.order}</div>
                                    </>
                                )}
                            </div>
                            {editingStepId !== step._id && (
                                <div className="step-actions">
                                    <button
                                        className="btn btn-ghost btn-sm btn-icon"
                                        id={`edit-step-${step._id}`}
                                        title="Edit step"
                                        onClick={() => startEditStep(step)}
                                    >✏️</button>
                                    <button
                                        className="btn btn-danger btn-sm btn-icon"
                                        id={`delete-step-${step._id}`}
                                        title="Delete step"
                                        onClick={() => handleDeleteStep(step._id)}
                                    >🗑️</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
