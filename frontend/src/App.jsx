// src/App.jsx
import { useState } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import RoadmapList from './components/RoadmapList';
import RoadmapDetail from './components/RoadmapDetail';

export default function App() {
  const [selectedId, setSelectedId] = useState(null);

  function handleSelect(id) {
    setSelectedId(id);
  }

  function handleBack() {
    setSelectedId(null);
  }

  function handleDeleted() {
    setSelectedId(null);
  }

  return (
    <div className="app-layout">
      <Navbar onHome={handleBack} />
      <main className="main-content">
        {selectedId ? (
          <RoadmapDetail
            roadmapId={selectedId}
            onBack={handleBack}
            onDeleted={handleDeleted}
          />
        ) : (
          <RoadmapList onSelect={handleSelect} />
        )}
      </main>
    </div>
  );
}
