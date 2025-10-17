import { useState, useEffect, useCallback } from 'react';

const HIDDEN_TAGS_STORAGE_KEY = 'dream_logger_ai_hidden_tags';

export const useHiddenTags = () => {
  const [hiddenTags, setHiddenTags] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedHiddenTags = localStorage.getItem(HIDDEN_TAGS_STORAGE_KEY);
      if (storedHiddenTags) {
        setHiddenTags(JSON.parse(storedHiddenTags));
      }
    } catch (error) {
      console.error("Failed to load hidden tags from localStorage", error);
    }
  }, []);

  const saveHiddenTags = useCallback((newHiddenTags: string[]) => {
    try {
      setHiddenTags(newHiddenTags);
      localStorage.setItem(HIDDEN_TAGS_STORAGE_KEY, JSON.stringify(newHiddenTags));
    } catch (error) {
      console.error("Failed to save hidden tags to localStorage", error);
    }
  }, []);

  const addHiddenTag = useCallback((tagToAdd: string) => {
    if (!hiddenTags.includes(tagToAdd)) {
      saveHiddenTags([...hiddenTags, tagToAdd]);
    }
  }, [hiddenTags, saveHiddenTags]);

  const removeHiddenTag = useCallback((tagToRemove: string) => {
    saveHiddenTags(hiddenTags.filter(tag => tag !== tagToRemove));
  }, [hiddenTags, saveHiddenTags]);

  return { hiddenTags, addHiddenTag, removeHiddenTag };
};
