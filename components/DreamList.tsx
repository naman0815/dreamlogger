import React from 'react';
import { Dream } from '../types';
import DreamListItem from './DreamListItem';

interface DreamListProps {
  dreams: Dream[];
  onEdit: (dream: Dream) => void;
  onDelete: (id: string) => void;
}

const DreamList: React.FC<DreamListProps> = ({ dreams, onEdit, onDelete }) => {
  if (dreams.length === 0) {
    return (
      <div className="text-center py-20 px-6 bg-gradient-to-br from-night-sky/70 to-night-sky/50 backdrop-blur-md rounded-2xl border border-lavender-mist/10 shadow-lg">
        <h2 className="text-2xl font-semibold text-moon-glow">Your Dream Journal is Empty</h2>
        <p className="text-lavender-mist/80 mt-2">Tap the '+' button to log your first dream.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {dreams.map((dream) => (
        <DreamListItem
          key={dream.id}
          dream={dream}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default DreamList;