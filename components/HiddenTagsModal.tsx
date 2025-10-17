import React from 'react';
import Tag from './Tag';
import { PlusIcon } from './icons/PlusIcon';

interface HiddenTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hiddenTags: string[];
  onUnhide: (tag: string) => void;
}

const HiddenTagsModal: React.FC<HiddenTagsModalProps> = ({ isOpen, onClose, hiddenTags, onUnhide }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-gradient-to-br from-night-sky/90 to-night-sky/80 backdrop-blur-lg w-full max-w-md m-4 p-6 rounded-2xl shadow-lg border border-lavender-mist/10 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-lavender-mist">Manage Hidden Tags</h2>
            <button
                onClick={onClose}
                className="p-2 rounded-full text-lavender-mist/70 hover:text-lavender-mist hover:bg-lavender-mist/10 transition-colors"
                aria-label="Close"
            >
               <div className="rotate-45"><PlusIcon /></div>
            </button>
        </div>
        
        <p className="text-lavender-mist/80">Click on a tag to unhide it and show it in the filter cloud again.</p>

        {hiddenTags.length > 0 ? (
            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-1 -m-1">
                {hiddenTags.sort().map(tag => (
                    <button key={tag} onClick={() => onUnhide(tag)} className="transition-transform active:scale-95">
                        <Tag label={tag} />
                    </button>
                ))}
            </div>
        ) : (
            <p className="text-center text-lavender-mist/60 py-4">No tags are hidden.</p>
        )}
        
        <div className="text-right mt-4">
             <button
                onClick={onClose}
                className="bg-lavender-mist text-deep-purple font-bold px-6 py-2 rounded-md hover:opacity-90 transition-opacity hover:shadow-lg hover:shadow-lavender-mist/20 active:scale-95"
            >
            Done
            </button>
        </div>
      </div>
    </div>
  );
};

export default HiddenTagsModal;
