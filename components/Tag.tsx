import React from 'react';
import { XIcon } from './icons/XIcon';

interface TagProps {
  label: string;
  onRemove?: () => void;
  type?: 'default' | 'person';
  onClick?: () => void;
}

const Tag: React.FC<TagProps> = ({ label, onRemove, type = 'default', onClick }) => {
  const baseClasses = "flex items-center gap-1.5 text-sm font-medium pl-3 rounded-full backdrop-blur-sm transition-all";
  const colorClasses = type === 'person' 
    ? "bg-purple-300/10 text-purple-300" 
    : "bg-indigo-300/10 text-indigo-300";
    
  const interactiveClasses = onClick ? "cursor-pointer hover:bg-opacity-20" : "";
  const paddingRight = onRemove ? 'pr-1.5' : 'pr-3';

  return (
    <div className={`${baseClasses} ${colorClasses} ${interactiveClasses} ${paddingRight}`} onClick={onClick}>
      <span>{label}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent onClick if it exists on the parent
            onRemove();
          }}
          className="rounded-full hover:bg-white/20 p-1 transition-colors group"
          aria-label={`Remove ${label}`}
        >
          <XIcon />
        </button>
      )}
    </div>
  );
};

export default Tag;
