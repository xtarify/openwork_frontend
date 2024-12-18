import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home: React.FC = () => {
  const navigate = useNavigate()
  
  return (
    <section className="home-section">
      <h1 className="main-title">Entrenador de Entrevistas con IA</h1>
      <h2 className="subtitle">Mejora tus habilidades, prepárate para tu próxima entrevista</h2>
      <button className="primary-btn" onClick={() => navigate('/question-type')}>Entrar</button>
    </section>
  )
}

export default Home
