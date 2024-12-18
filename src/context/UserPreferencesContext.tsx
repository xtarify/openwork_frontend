// src/context/UserPreferencesContext.tsx

import React, { createContext, useState, ReactNode } from 'react';

interface UserPreferences {
  questionType: string;
  feedbackLevel: string;
  position: string;
  questionCount: number;
  multipleChoice: boolean;
  openQuestions: boolean;
  email: string;
  session_id: string | null;
}

interface PreferencesContextProps {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
}

export const PreferencesContext = createContext<PreferencesContextProps | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    questionType: '',
    feedbackLevel: '',
    position: '',
    questionCount: 5,
    multipleChoice: false,
    openQuestions: false,
    email: '',
    session_id: null,
  });

  return (
    <PreferencesContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};
