// src/components/Toast.jsx
import { useEffect, useState } from 'react';

export default function Toast({ toasts }) {
    return (
        <div className="toast-container">
            {toasts.map(t => (
                <div key={t.id} className={`toast toast-${t.type}`}>
                    {t.type === 'success' ? '✓ ' : '✕ '}{t.message}
                </div>
            ))}
        </div>
    );
}
