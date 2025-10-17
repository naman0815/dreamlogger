import React, { useState, useMemo } from 'react';
import { Dream } from '../types';
import DreamList from './DreamList';
import Tag from './Tag';
import { useHiddenTags } from '../hooks/useHiddenTags';
import HiddenTagsModal from './HiddenTagsModal';
import { SettingsIcon } from './icons/SettingsIcon';


interface SearchViewProps {
  dreams: Dream[];
  deleteDream: (id: string) => void;
  onEditDream: (dream: Dream) => void;
}

const SearchView: React.FC<SearchViewProps> = ({ dreams, deleteDream, onEditDream }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { hiddenTags, addHiddenTag, removeHiddenTag } = useHiddenTags();

  const filteredDreams = useMemo(() => {
    if (!searchTerm.trim()) {
      return [];
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return dreams.filter(dream =>
      dream.title.toLowerCase().includes(lowercasedTerm) ||
      dream.description.toLowerCase().includes(lowercasedTerm) ||
      dream.tags.some(tag => tag.toLowerCase().includes(lowercasedTerm)) ||
      dream.people.some(person => person.toLowerCase().includes(lowercasedTerm))
    );
  }, [dreams, searchTerm]);

  const { people, tags } = useMemo(() => {
    const allPeople = new Set<string>();
    const allTags = new Set<string>();
    dreams.forEach(dream => {
      dream.people.forEach(person => allPeople.add(person));
      dream.tags.forEach(tag => allTags.add(tag));
    });
    return { 
        people: Array.from(allPeople).sort(),
        tags: Array.from(allTags).sort()
    };
  }, [dreams]);
  
  const visiblePeople = useMemo(() => people.filter(p => !hiddenTags.includes(p)), [people, hiddenTags]);
  const visibleTags = useMemo(() => tags.filter(t => !hiddenTags.includes(t)), [tags, hiddenTags]);


  return (
    <div>
      <header className="py-4 text-center">
        <h1 className="text-3xl font-bold text-moon-glow drop-shadow-lg">Search Dreams</h1>
        <p className="text-lavender-mist/80 mt-1">Find dreams by keyword, tag, or person.</p>
      </header>

      <main className="mt-6 space-y-8">
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for flying, Sarah, the beach..."
            className="w-full bg-deep-purple/70 border-2 border-dusk-blue rounded-full px-5 py-3 text-moon-glow placeholder-lavender-mist/50 focus:outline-none focus:ring-2 focus:ring-lavender-mist/60 focus:border-lavender-mist/60 text-lg"
          />
        </div>

        {searchTerm.trim() === '' && (visiblePeople.length > 0 || visibleTags.length > 0 || hiddenTags.length > 0) && (
          <div className="space-y-6">
            {visiblePeople.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-lavender-mist mb-3 text-center">People</h2>
                    <div className="flex flex-wrap gap-2 justify-center">
                    {visiblePeople.map(item => (
                        <Tag key={item} label={item} type="person" onRemove={() => addHiddenTag(item)} />
                    ))}
                    </div>
                </div>
            )}
            
            {visibleTags.length > 0 && (
                 <div>
                    <h2 className="text-lg font-semibold text-lavender-mist mb-3 text-center">Themes & Symbols</h2>
                    <div className="flex flex-wrap gap-2 justify-center">
                    {visibleTags.map(item => (
                        <Tag key={item} label={item} onRemove={() => addHiddenTag(item)} />
                    ))}
                    </div>
                </div>
            )}
            
            {hiddenTags.length > 0 && (
                <div className="text-center mt-8">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 mx-auto text-sm text-lavender-mist/60 hover:text-lavender-mist transition-colors"
                    >
                       <SettingsIcon />
                       Manage Hidden Tags
                    </button>
                </div>
            )}
          </div>
        )}

        <div>
            {searchTerm.trim() !== '' && (
                 <div className="mb-4 text-center">
                    <p className="text-lavender-mist">{filteredDreams.length} result(s) found for "{searchTerm}"</p>
                 </div>
            )}
           
            {searchTerm.trim() !== '' ? (
                <DreamList
                    dreams={filteredDreams}
                    onEdit={onEditDream}
                    onDelete={deleteDream}
                />
            ) : (
                <div className="text-center py-10 px-6">
                    <h2 className="text-xl font-semibold text-moon-glow">Start by typing above</h2>
                    <p className="text-lavender-mist/80 mt-2">...or tap a filter from the cloud.</p>
                </div>
            )}
        </div>

      </main>
      
      <HiddenTagsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        hiddenTags={hiddenTags}
        onUnhide={removeHiddenTag}
      />
    </div>
  );
};

export default SearchView;
