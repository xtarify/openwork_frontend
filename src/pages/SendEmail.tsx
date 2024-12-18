// src/pages/SendEmail.tsx

import React, { useState, useContext } from 'react';
//import ProgressBar from '../components/ProgressBar';
import { useNavigate } from 'react-router-dom';
import { PreferencesContext } from '../context/UserPreferencesContext';

const SendEmail: React.FC = () => {
  const { preferences, setPreferences } = useContext(PreferencesContext)!;
  const [email, setEmail] = useState<string>(preferences.email);
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSend = async () => {
    if (email.trim()) {
      setPreferences(prev => ({ ...prev, email: email.trim() }));
      setIsSending(true);
      setMessage(null);

      try {
        // Enviar el correo electrónico al backend para almacenarlo
        const response = await fetch('http://127.0.0.1:8000/api/set_email/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            session_id: preferences.session_id,
            email: email.trim()
          })
        });

        const data = await response.json();

        if (response.ok) {
          setMessage('El feedback se enviará a tu correo electrónico.');
          // Opcional: Redirigir o limpiar el estado
          navigate('/');
        } else {
          setMessage(data.error || 'Ocurrió un error al enviar el feedback.');
        }
      } catch (error) {
        console.error('Error enviando el feedback:', error);
        setMessage('Ocurrió un error al enviar el feedback.');
      } finally {
        setIsSending(false);
      }
    } else {
      alert('Por favor, ingresa un correo electrónico.');
    }
  };

  return (
    <section className="step-section">
      {/* Si SendEmail es un último paso extra, podrías mostrar o no la ProgressBar */}
      {/* Por simplicidad, si ya tienes 5 pasos, esta sería la 6: */}
      <div className="progress-container">
        <div className="progress-step active">1</div>
        <div className="progress-step active">2</div>
        <div className="progress-step active">3</div>
        <div className="progress-step active">4</div>
        <div className="progress-step active">5</div>
        <div className="progress-step active">6</div>
      </div>
      <h2>Recibir Resultados</h2>
      <p>Ingresa tu email y recibirás los resultados de tu entrevista completamente gratis.</p>
      <input 
        type="email" 
        placeholder="email..." 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="button-group">
        <button className="secondary-btn" onClick={() => navigate(-1)}>Volver</button>
        <button 
          className="primary-btn" 
          onClick={handleSend}
          disabled={isSending || !email.trim()}
        >
          {isSending ? 'Enviando...' : 'Recibir Entrevista'}
        </button>
      </div>
      {message && <p>{message}</p>}
    </section>
  );
};

export default SendEmail;
