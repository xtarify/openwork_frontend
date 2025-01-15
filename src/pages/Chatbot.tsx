// src/pages/Chatbot.tsx

import React, { useState, useEffect, useRef, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNavigate } from 'react-router-dom';
import { PreferencesContext } from '../context/UserPreferencesContext';

const Chatbot: React.FC<{ theme?: string }> = ({ theme }) => {
  const navigate = useNavigate();
  const { preferences } = useContext(PreferencesContext)!;
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hola! Soy tu entrenador de entrevistas. ¡Comencemos con la práctica! Hazme tus preguntas.' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  useEffect(() => {
    // Si ya tienes un session_id, no necesitas iniciar otra sesión aquí
    // Asegúrate de que el session_id ya esté almacenado en preferencias
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !preferences.session_id) return;

    // Añadir el mensaje del usuario al estado
    setMessages(prev => [...prev, { sender: 'user', text: input.trim() }]);
    setInput('');
    setIsLoading(true);

    // Añadir un mensaje de carga para indicar que la IA está respondiendo
    setMessages(prev => [...prev, { sender: 'bot', text: '' }]);

    try {
      const response = await fetch('http://127.0.0.1:8000//api/interview/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          prompt: input.trim(),
          session_id: preferences.session_id
        })
      });

      if (!response.body) {
        throw new Error('No se pudo obtener el cuerpo de la respuesta.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      let accumulatedResponse = '';
      let finalResponse = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          accumulatedResponse += chunk;

          // Procesar el chunk para extraer el contenido
          const lines = accumulatedResponse.split('\n');
          accumulatedResponse = lines.pop()!; // Guardar el último fragmento incompleto

          lines.forEach(line => {
            if (line.startsWith('data: ')) {
              const dataStr = line.replace('data: ', '').trim();
              if (dataStr === '[DONE]') {
                return;
              }
              try {
                const data = JSON.parse(dataStr);
                const content = data.choices[0].delta?.content;
                if (content) {
                  finalResponse += content;
                  setMessages(prevMessages => {
                    const updatedMessages = [...prevMessages];
                    // Actualizar el último mensaje de IA con el nuevo contenido
                    const lastMessage = updatedMessages[updatedMessages.length - 1];
                    if (lastMessage.sender === 'bot') {
                      updatedMessages[updatedMessages.length - 1] = {
                        ...lastMessage,
                        text: lastMessage.text + content
                      };
                    }
                    return updatedMessages;
                  });
                }
              } catch (error) {
                console.error('Error al procesar el chunk:', error);
              }
            }
          });
        }
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      // Reemplazar el mensaje de carga con un mensaje de error
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages];
        const lastMessage = updatedMessages[updatedMessages.length - 1];
        if (lastMessage.sender === 'bot') {
          updatedMessages[updatedMessages.length - 1] = {
            ...lastMessage,
            text: 'Hubo un error al procesar tu solicitud.'
          };
        }
        return updatedMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  //const formatMessage = (text: string) => {
    // Reemplaza el texto entre ** con elementos <strong>
    //return text.split(/(\*\*.*?\*\*)/).map((part, index) => {
      //if (part.startsWith('**') && part.endsWith('**')) {
        // Elimina los asteriscos y envuelve el texto en <strong>
      //  return <strong key={index}>{part.slice(2, -2)}</strong>;
      //}
      //return part;
    //});
  //};

  return (
    <section className="step-section">
      <h2>Práctica de Entrevista</h2>
      <div style={{ marginBottom: '1rem' }}>
        <button className="primary-btn" onClick={() => navigate('/send-email')}>
          Recibir Calificación/Feedback
        </button>
      </div>
      
      <div className={`chatbot ${theme || ''}`}>
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.sender === 'bot' ? (
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  className="markdown-message"
                >
                  {msg.text}
                </ReactMarkdown>
              ) : (
                <span>{msg.text}</span>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-area">
          <textarea
            className="message-input"
            placeholder="Escribe tu pregunta..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            ref={inputRef}
            rows={1}
            disabled={isLoading}
          />
          <button className="send-button" onClick={handleSend}>
            Enviar
          </button>
        </div>
      </div>
    </section>
  );
}

export default Chatbot;
