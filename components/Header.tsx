import React from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { ImportIcon } from './icons/ImportIcon';

interface HeaderProps {
  onAddDream: () => void;
  showAddButton: boolean;
  onImport: () => void;
  showImportButton: boolean;
}

const Header: React.FC<HeaderProps> = ({ onAddDream, showAddButton, onImport, showImportButton }) => {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between py-4 px-5 -mx-5 bg-deep-purple/60 backdrop-blur-lg border-b border-lavender-mist/20 shadow-xl shadow-black/20">
      <h1 className="text-3xl font-bold text-moon-glow drop-shadow-lg">Dream Logger AI</h1>
        <div className="flex items-center gap-2">
            <button
              onClick={onImport}
              className={`bg-dusk-blue hover:bg-lavender-mist hover:text-deep-purple text-moon-glow font-bold p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform active:scale-95 ${showImportButton ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
              aria-label="Import dreams"
              disabled={!showImportButton}
            >
              <ImportIcon />
            </button>
            <button
              onClick={onAddDream}
              className={`bg-dusk-blue hover:bg-lavender-mist hover:text-deep-purple text-moon-glow font-bold p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform active:scale-95 ${showAddButton ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
              aria-label="Add new dream"
              disabled={!showAddButton}
            >
              <PlusIcon />
            </button>
        </div>
    </header>
  );
};

export default Header;