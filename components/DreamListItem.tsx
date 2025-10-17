
import React, { useState } from 'react';
import { Dream } from '../types';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';
import Tag from './Tag';

interface DreamListItemProps {
  dream: Dream;
  onEdit: (dream: Dream) => void;
  onDelete: (id: string) => void;
}

const DreamListItem: React.FC<DreamListItemProps> = ({ dream, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // FIX: Corrected typo from toLocaleDateDateString to toLocaleDateString
  const formattedDate = new Date(dream.date + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this dream?')) {
      onDelete(dream.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
      e.stopPropagation();
      onEdit(dream);
  }

  return (
    <div
      className="bg-gradient-to-br from-night-sky/70 to-night-sky/50 backdrop-blur-md rounded-2xl shadow-lg border border-lavender-mist/10 cursor-pointer transition-all duration-300 hover:border-lavender-mist/30 hover:shadow-[0_0_25px_rgba(192,183,232,0.2)] hover:-translate-y-1 active:scale-[0.99]"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-4">
            <h3 className="text-xl font-bold text-lavender-mist">{dream.title || 'Untitled Dream'}</h3>
            <p className="text-sm text-lavender-mist/70 mt-1">{formattedDate}</p>
            <p className={`mt-3 text-moon-glow/80 whitespace-pre-wrap transition-all duration-300 ${!isExpanded ? 'line-clamp-2' : ''}`}>
              {dream.description}
            </p>
          </div>
          <div className="flex space-x-1 flex-shrink-0">
            <button
              onClick={handleEdit}
              className="p-2 rounded-full text-lavender-mist/70 hover:text-lavender-mist hover:bg-lavender-mist/10 transition-colors"
              aria-label="Edit dream"
            >
              <EditIcon />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-full text-lavender-mist/70 hover:text-lavender-mist hover:bg-lavender-mist/10 transition-colors"
              aria-label="Delete dream"
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      </div>
      <div className={`transition-[max-height] duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px]' : 'max-h-0'}`}>
        {(dream.tags.length > 0 || dream.people.length > 0) && (
          <div className="px-5 pb-5 mt-2 border-t border-lavender-mist/10 pt-4">
            {dream.tags.length > 0 && (
              <div className="mb-3">
                <h4 className="font-semibold text-sm text-lavender-mist mb-2">Themes & Symbols</h4>
                <div className="flex flex-wrap gap-2">
                  {dream.tags.map((tag) => <Tag key={tag} label={tag} />)}
                </div>
              </div>
            )}
            {dream.people.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm text-lavender-mist mb-2">People</h4>
                <div className="flex flex-wrap gap-2">
                  {dream.people.map((person) => <Tag key={person} label={person} type="person" />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DreamListItem;
