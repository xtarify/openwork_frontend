// src/App.tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import QuestionType from './pages/QuestionType'
import FeedbackLevel from './pages/FeedbackLevel'
import Position from './pages/Position'
import QuestionCount from './pages/QuestionCount'
import SendEmail from './pages/SendEmail'
import Chatbot from './pages/Chatbot'

import { PreferencesProvider } from './context/UserPreferencesContext'

import './styles/global.css'

const App: React.FC = () => {
  return (
    <PreferencesProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/question-type" element={<QuestionType />} />
              <Route path="/feedback-level" element={<FeedbackLevel />} />
              <Route path="/position" element={<Position />} />
              <Route path="/question-count" element={<QuestionCount />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/send-email" element={<SendEmail />} />
            </Routes>
          </main>
        </div>
      </Router>
    </PreferencesProvider>
  )
}

export default App
