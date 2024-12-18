// src/pages/FeedbackLevel.tsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import { PreferencesContext } from '../context/UserPreferencesContext';

const FeedbackLevel: React.FC = () => {
  const { preferences, setPreferences } = useContext(PreferencesContext)!;
  const [level, setLevel] = useState<string>(preferences.feedbackLevel);
  const navigate = useNavigate();

  const handleNext = () => {
    if (level) {
      setPreferences(prev => ({ ...prev, feedbackLevel: level }));
      navigate('/position');
    }
  };

  return (
    <section className="step-section">
      <ProgressBar currentStep={2} totalSteps={5} />
      <h2>¿Qué nivel de retroalimentación deseas?</h2>
      <select value={level} onChange={(e) => setLevel(e.target.value)}>
        <option value="">Selecciona...</option>
        <option value="simple">Sencilla</option>
        <option value="detailed">Detallada</option>
      </select>
      <div className="button-group">
        <button className="secondary-btn" onClick={() => navigate(-1)}>Volver</button>
        <button 
          className="primary-btn" 
          onClick={handleNext}
          disabled={!level}
        >
          Siguiente
        </button>
      </div>
    </section>
  );
};

export default FeedbackLevel;
