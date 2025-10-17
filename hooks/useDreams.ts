

import { useState, useEffect } from 'react';
import { Dream } from '../types';

const DREAMS_STORAGE_KEY = 'dream_logger_ai_dreams';

export const useDreams = () => {
  const [dreams, setDreams] = useState<Dream[]>([]);

  useEffect(() => {
    try {
      const storedDreams = localStorage.getItem(DREAMS_STORAGE_KEY);
      if (storedDreams) {
        setDreams(JSON.parse(storedDreams));
      }
    } catch (error) {
      console.error("Failed to load dreams from localStorage", error);
    }
  }, []);

  const saveDreams = (newDreams: Dream[]) => {
    try {
      const sortedDreams = [...newDreams].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setDreams(sortedDreams);
      localStorage.setItem(DREAMS_STORAGE_KEY, JSON.stringify(sortedDreams));
    } catch (error) {
      console.error("Failed to save dreams to localStorage", error);
    }
  };

  const addDream = (newDream: Dream) => {
    saveDreams([...dreams, newDream]);
  };

  const addMultipleDreams = (newDreams: Dream[]) => {
    saveDreams([...dreams, ...newDreams]);
  };

  const updateDream = (updatedDream: Dream) => {
    const updatedDreams = dreams.map((dream) =>
      dream.id === updatedDream.id ? updatedDream : dream
    );
    saveDreams(updatedDreams);
  };

  const deleteDream = (dreamId: string) => {
    const remainingDreams = dreams.filter((dream) => dream.id !== dreamId);
    saveDreams(remainingDreams);
  };

  return { dreams, addDream, updateDream, deleteDream, addMultipleDreams };
};