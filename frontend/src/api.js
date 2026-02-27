// src/api.js
const BASE_URL = 'http://localhost:5001/api';

// ── Roadmaps ────────────────────────────────────────────────────────────────

export async function getRoadmaps() {
    const res = await fetch(`${BASE_URL}/roadmaps`);
    if (!res.ok) throw new Error('Failed to fetch roadmaps');
    return res.json();
}

export async function getRoadmap(id) {
    const res = await fetch(`${BASE_URL}/roadmaps/${id}`);
    if (!res.ok) throw new Error('Failed to fetch roadmap');
    return res.json();
}

export async function createRoadmap(title) {
    const res = await fetch(`${BASE_URL}/roadmaps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error('Failed to create roadmap');
    return res.json();
}

export async function updateRoadmapTitle(id, title) {
    const res = await fetch(`${BASE_URL}/roadmaps/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error('Failed to update roadmap');
    return res.json();
}

export async function deleteRoadmap(id) {
    const res = await fetch(`${BASE_URL}/roadmaps/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete roadmap');
    return res.json();
}

// ── Steps ────────────────────────────────────────────────────────────────────

export async function addStep(roadmapId, step) {
    const res = await fetch(`${BASE_URL}/roadmaps/${roadmapId}/steps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(step),
    });
    if (!res.ok) throw new Error('Failed to add step');
    return res.json();
}

export async function updateStep(roadmapId, stepId, data) {
    const res = await fetch(`${BASE_URL}/roadmaps/${roadmapId}/steps/${stepId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update step');
    return res.json();
}

export async function deleteStep(roadmapId, stepId) {
    const res = await fetch(`${BASE_URL}/roadmaps/${roadmapId}/steps/${stepId}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete step');
    return res.json();
}

export async function reorderSteps(roadmapId, steps) {
    const res = await fetch(`${BASE_URL}/roadmaps/${roadmapId}/steps/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ steps }),
    });
    if (!res.ok) throw new Error('Failed to reorder steps');
    return res.json();
}
