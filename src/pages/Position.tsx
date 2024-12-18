// src/pages/Position.tsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import { PreferencesContext } from '../context/UserPreferencesContext';

const Position: React.FC = () => {
  const { preferences, setPreferences } = useContext(PreferencesContext)!;
  const [position, setPosition] = useState<string>(preferences.position);
  const navigate = useNavigate();

  const handleNext = () => {
    if (position.trim()) {
      setPreferences(prev => ({ ...prev, position: position.trim() }));
      navigate('/question-count');
    }
  };

  return (
    <section className="step-section">
      <ProgressBar currentStep={3} totalSteps={5} />
      <h2>Dime el puesto al que aplicarás...</h2>
      <input 
        type="text" 
        placeholder="Escribe aquí" 
        value={position} 
        onChange={(e) => setPosition(e.target.value)} 
      />
      <div className="button-group">
        <button className="secondary-btn" onClick={() => navigate(-1)}>Volver</button>
        <button 
          className="primary-btn" 
          onClick={handleNext}
          disabled={!position.trim()}
        >
          Siguiente
        </button>
      </div>
    </section>
  );
};

export default Position;
