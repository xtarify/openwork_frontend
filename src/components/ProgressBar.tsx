// src/components/ProgressBar.tsx
import React from 'react'

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="progress-container">
      {steps.map((step) => (
        <div key={step} className={`progress-step ${step <= currentStep ? 'active' : ''}`}>
          {step}
        </div>
      ))}
    </div>
  )
}

export default ProgressBar
