import React, { useState } from 'react';
import { useDreams } from './hooks/useDreams';
import JournalView from './components/JournalView';
import DreamView from './components/DreamView';
import SearchView from './components/SearchView';
import TabBar from './components/TabBar';
import DreamForm from './components/DreamForm';
import { Dream } from './types';

export type ActiveTab = 'journal' | 'dreamview' | 'search';

const App: React.FC = () => {
  const { dreams, addDream, updateDream, deleteDream, addMultipleDreams } = useDreams();
  const [activeTab, setActiveTab] = useState<ActiveTab>('journal');
  
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingDream, setEditingDream] = useState<Dream | null>(null);

  const handleShowForm = (dream: Dream | null) => {
    setEditingDream(dream);
    setIsFormVisible(true);
  };

  const handleHideForm = () => {
    setIsFormVisible(false);
    setEditingDream(null);
  };

  const handleSaveDream = (dream: Dream) => {
    if (editingDream) {
      updateDream(dream);
    } else {
      addDream(dream);
    }
    handleHideForm();
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'journal':
        return (
          <JournalView
            dreams={dreams}
            deleteDream={deleteDream}
            addMultipleDreams={addMultipleDreams}
            onAddDream={() => handleShowForm(null)}
            onEditDream={handleShowForm}
          />
        );
      case 'dreamview':
        return <DreamView dreams={dreams} />;
      case 'search':
        return <SearchView 
          dreams={dreams} 
          deleteDream={deleteDream}
          onEditDream={handleShowForm}
        />;
      default:
        return null;
    }
  };


  return (
    <div className="min-h-screen font-sans">
      <div className={`container mx-auto max-w-2xl p-4 transition-filter duration-500 ${isFormVisible ? 'blur-md' : 'blur-none'}`}>
          {renderActiveTab()}
      </div>
      
      <div className={`fixed inset-0 z-30 transition-all duration-500 flex items-center justify-center ${isFormVisible ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 pointer-events-none'}`}>
          {isFormVisible && (
              <div className="w-full max-w-2xl p-4">
                 <DreamForm
                    dream={editingDream}
                    onSave={handleSaveDream}
                    onCancel={handleHideForm}
                  />
              </div>
          )}
      </div>

      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;