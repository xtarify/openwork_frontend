// src/pages/QuestionCount.tsx

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import { PreferencesContext } from '../context/UserPreferencesContext';

const QuestionCount: React.FC = () => {
  const { preferences, setPreferences } = useContext(PreferencesContext)!;
  const [count, setCount] = useState<number | ''>(preferences.questionCount || '');
  const [multipleChoice, setMultipleChoice] = useState<boolean>(preferences.multipleChoice);
  const [openQuestions, setOpenQuestions] = useState<boolean>(preferences.openQuestions);
  const navigate = useNavigate();

  const handleNext = async () => {
    if (count && (multipleChoice || openQuestions)) {
      setPreferences(prev => ({
        ...prev,
        questionCount: count as number,
        multipleChoice,
        openQuestions
      }));
      
      // Iniciar una nueva sesión con las preferencias
      try {
        const response = await fetch('http://127.0.0.1:8000/api/start_session/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            preferences: { // Envolver las preferencias dentro de la clave 'preferences'
              questionType: preferences.questionType,
              feedbackLevel: preferences.feedbackLevel,
              position: preferences.position,
              questionCount: count,
              multipleChoice: multipleChoice,
              openQuestions: openQuestions
            }
          })
        });

        const data = await response.json();
        if (response.ok) {
          setPreferences(prev => ({ ...prev, session_id: data.session_id }));
          navigate('/chatbot');
        } else {
          alert(data.error || 'Ocurrió un error al iniciar la sesión.');
        }
      } catch (error) {
        console.error('Error iniciando sesión:', error);
        alert('Ocurrió un error al iniciar la sesión.');
      }
    } else {
      alert('Completa el número de preguntas y selecciona al menos un tipo.');
    }
  };

  return (
    <section className="step-section">
      <ProgressBar currentStep={4} totalSteps={5} />
      <h2>¿Cuántas Preguntas deseas?</h2>
      <input 
        type="number" 
        placeholder="Escribe aquí" 
        value={count} 
        onChange={(e) => {
          const val = parseInt(e.target.value, 10);
          setCount(isNaN(val) ? '' : val);
        }}
      />
      <div style={{margin:'1rem 0'}}>
        <label style={{marginRight:'1rem'}}>
          <input 
            type="checkbox" 
            checked={multipleChoice} 
            onChange={() => setMultipleChoice(!multipleChoice)} 
          /> Opción Múltiple
        </label>
        <label>
          <input 
            type="checkbox" 
            checked={openQuestions} 
            onChange={() => setOpenQuestions(!openQuestions)} 
          /> Abiertas
        </label>
      </div>
      <div className="button-group">
        <button className="secondary-btn" onClick={() => navigate(-1)}>Volver</button>
        <button 
          className="primary-btn" 
          onClick={handleNext}
          disabled={!count || !(multipleChoice || openQuestions)}
        >
          Siguiente
        </button>
      </div>
    </section>
  );
};

export default QuestionCount;
