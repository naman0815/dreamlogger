import React, { useState, useEffect } from 'react';
import { Dream } from '../types';
import { analyzeDream } from '../services/geminiService';
import Loader from './Loader';
import { SparklesIcon } from './icons/SparklesIcon';
import Tag from './Tag';

interface DreamFormProps {
  dream: Dream | null;
  onSave: (dream: Dream) => void;
  onCancel: () => void;
}

const TagInput: React.FC<{ tags: string[]; setTags: (tags: string[]) => void; placeholder: string; type?: 'default' | 'person'; }> = ({ tags, setTags, placeholder, type = 'default' }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2 min-h-[34px]">
        {tags.map(tag => (
          <Tag key={tag} label={tag} onRemove={() => removeTag(tag)} type={type} />
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-deep-purple/70 border border-lavender-mist/20 rounded-md px-3 py-2 text-moon-glow placeholder-lavender-mist/50 focus:outline-none focus:ring-2 focus:ring-lavender-mist/60 focus:border-lavender-mist/60"
      />
    </div>
  );
};


const DreamForm: React.FC<DreamFormProps> = ({ dream, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [tags, setTags] = useState<string[]>([]);
  const [people, setPeople] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (dream) {
      setTitle(dream.title);
      setDescription(dream.description);
      setDate(dream.date);
      setTags(dream.tags);
      setPeople(dream.people);
    }
  }, [dream]);

  const handleAnalyze = async () => {
    if (!description.trim()) {
      setError('Please write down your dream first.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const result = await analyzeDream(description);
      if (result.title) {
          setTitle(result.title);
      }
      setTags(prev => [...new Set([...prev, ...result.tags])]);
      setPeople(prev => [...new Set([...prev, ...result.people])]);
    } catch (err) {
      setError('Failed to analyze dream. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
        setError('Dream description cannot be empty.');
        return;
    }
    setError('');
    const dreamData: Dream = {
      id: dream?.id || new Date().toISOString(),
      date,
      title: title.trim() || 'Untitled Dream',
      description,
      tags,
      people,
    };
    onSave(dreamData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-night-sky/70 to-night-sky/50 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-lavender-mist/10 space-y-6">
      <h2 className="text-2xl font-bold text-lavender-mist">{dream ? 'Edit Dream' : 'Log a New Dream'}</h2>
      
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-lavender-mist mb-1">Date</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full bg-deep-purple/70 border border-lavender-mist/20 rounded-md px-3 py-2 text-moon-glow focus:outline-none focus:ring-2 focus:ring-lavender-mist/60 focus:border-lavender-mist/60"
        />
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-lavender-mist mb-1">Title</label>
        <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A title for your dream"
            className="w-full bg-deep-purple/70 border border-lavender-mist/20 rounded-md px-3 py-2 text-moon-glow placeholder-lavender-mist/50 focus:outline-none focus:ring-2 focus:ring-lavender-mist/60 focus:border-lavender-mist/60"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-lavender-mist mb-1">Dream Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={8}
          required
          className="w-full bg-deep-purple/70 border border-lavender-mist/20 rounded-md px-3 py-2 text-moon-glow placeholder-lavender-mist/50 focus:outline-none focus:ring-2 focus:ring-lavender-mist/60 focus:border-lavender-mist/60"
          placeholder="What did you dream about?"
        />
      </div>

       {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="bg-deep-purple/50 p-4 rounded-xl border border-lavender-mist/10">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-lavender-mist">AI Analysis</h3>
            <button
                type="button"
                onClick={handleAnalyze}
                disabled={isLoading}
                className="flex items-center gap-2 bg-gradient-to-r from-dusk-blue to-purple-800 hover:from-dusk-blue hover:to-purple-700 text-moon-glow font-semibold px-4 py-2 rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg"
            >
                {isLoading ? <Loader /> : <SparklesIcon />}
                <span>{tags.length > 0 || people.length > 0 ? 'Enhance with AI' : 'Analyze Dream'}</span>
            </button>
        </div>
        
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-lavender-mist mb-2">Themes & Symbols</label>
                <TagInput tags={tags} setTags={setTags} placeholder="Add a tag and press Enter" />
            </div>
             <div>
                <label className="block text-sm font-medium text-lavender-mist mb-2">People</label>
                <TagInput tags={people} setTags={setPeople} placeholder="Add a person and press Enter" type="person" />
            </div>
        </div>
      </div>


      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-transparent border border-dusk-blue text-lavender-mist px-6 py-2 rounded-md hover:bg-dusk-blue transition-colors active:scale-95"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-lavender-mist text-deep-purple font-bold px-6 py-2 rounded-md hover:opacity-90 transition-opacity hover:shadow-lg hover:shadow-lavender-mist/20 active:scale-95"
        >
          Save Dream
        </button>
      </div>
    </form>
  );
};

export default DreamForm;
