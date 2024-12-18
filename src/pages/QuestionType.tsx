// src/pages/QuestionType.tsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import { PreferencesContext } from '../context/UserPreferencesContext';

const QuestionType: React.FC = () => {
  const { preferences, setPreferences } = useContext(PreferencesContext)!;
  const [questionType, setQuestionType] = useState<string>(preferences.questionType);
  const navigate = useNavigate();

  const handleNext = () => {
    if (questionType) {
      setPreferences(prev => ({ ...prev, questionType }));
      navigate('/feedback-level');
    }
  };

  return (
    <section className="step-section">
      <ProgressBar currentStep={1} totalSteps={5} />
      <h2>¿Qué tipo de preguntas?</h2>
      <select value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
        <option value="">Selecciona...</option>
        <option value="soft">Habilidades Soft</option>
        <option value="tech">Técnicas</option>
        <option value="both">Ambas</option>
      </select>

      <div className="button-group">
        <button className="secondary-btn" onClick={() => navigate(-1)}>Volver</button>
        <button 
          className="primary-btn" 
          onClick={handleNext}
          disabled={!questionType}
        >
          Siguiente
        </button>
      </div>
    </section>
  );
};

export default QuestionType;
