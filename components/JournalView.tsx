import React, { useState, useRef } from 'react';
import { Dream } from '../types';
import DreamList from './DreamList';
import Header from './Header';
import { parseDreamHtml } from '../utils/markdownParser';
import { analyzeDream } from '../services/geminiService';
import Loader from './Loader';

interface JournalViewProps {
  dreams: Dream[];
  deleteDream: (id: string) => void;
  addMultipleDreams: (dreams: Dream[]) => void;
  onAddDream: () => void;
  onEditDream: (dream: Dream) => void;
}

const JournalView: React.FC<JournalViewProps> = ({ dreams, deleteDream, addMultipleDreams, onAddDream, onEditDream }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsImporting(true);
    setImportMessage('');

    const importedDreams: Dream[] = [];
    const promises = Array.from(files).map(file => {
      return new Promise<void>((resolve, reject) => {
        if (!file.name.endsWith('.html') && !file.name.endsWith('.htm')) {
          console.warn(`Skipping non-HTML file: ${file.name}`);
          resolve();
          return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const content = e.target?.result as string;
            const defaultDate = new Date(file.lastModified).toISOString().split('T')[0];
            const { title: parsedTitle, date: parsedDate, description: parsedDescription } = parseDreamHtml(content, defaultDate);

            if (parsedDescription) {
              const { title: aiTitle, tags, people } = await analyzeDream(parsedDescription);

              const newDream: Dream = {
                id: new Date().toISOString() + Math.random(),
                date: parsedDate,
                title: parsedTitle !== 'Untitled Dream' ? parsedTitle : (aiTitle || 'Untitled Dream'),
                description: parsedDescription,
                tags,
                people,
              };
              importedDreams.push(newDream);
            }
            resolve();
          } catch (error) {
            console.error('Error processing file:', file.name, error);
            reject(error);
          }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
      });
    });

    try {
      await Promise.all(promises);
      if (importedDreams.length > 0) {
        addMultipleDreams(importedDreams);
        setImportMessage(`Successfully imported ${importedDreams.length} dream(s)!`);
      } else {
        setImportMessage('No valid dreams found in selected files.');
      }
    } catch (error) {
      setImportMessage('An error occurred during import. Please check the console.');
    } finally {
      setIsImporting(false);
      if (event.target) event.target.value = '';
    }
  };

  return (
    <>
      <Header 
        onAddDream={onAddDream} 
        showAddButton={true}
        onImport={handleImportClick}
        showImportButton={true}
      />
      
      <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple accept=".html,.htm" style={{ display: 'none' }} />

      {isImporting && (
        <div className="text-center p-4 mt-4 flex items-center justify-center gap-2 text-lavender-mist">
          <Loader /> 
          <span>Importing dreams...</span>
        </div>
      )}
      {importMessage && !isImporting && (
        <div className="text-center p-3 mt-4 bg-night-sky/50 rounded-lg mb-4 text-moon-glow">
            {importMessage}
        </div>
      )}

      <main className="mt-6">
        <DreamList
            dreams={dreams}
            onEdit={onEditDream}
            onDelete={deleteDream}
          />
      </main>
    </>
  );
};

export default JournalView;