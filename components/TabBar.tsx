import React from 'react';
import { ActiveTab } from '../App';
import { JournalIcon } from './icons/JournalIcon';
import { AnalyticsIcon } from './icons/AnalyticsIcon';
import { SearchIcon } from './icons/SearchIcon';

interface TabBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, setActiveTab }) => {
  const TabButton: React.FC<{ tabName: ActiveTab; label: string; children: React.ReactNode }> = ({ tabName, label, children }) => {
    const isActive = activeTab === tabName;
    return (
      <button
        onClick={() => setActiveTab(tabName)}
        className={`flex-1 flex flex-col items-center justify-center p-2 transition-all duration-300 rounded-lg ${isActive ? 'text-lavender-mist' : 'text-lavender-mist/50 hover:text-lavender-mist/80 hover:bg-white/5'}`}
        aria-current={isActive}
      >
        {children}
        <span className={`text-xs font-bold mt-1 transition-all ${isActive ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
      </button>
    );
  };

  return (
    <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm z-50">
      <div className="flex justify-around items-center h-16 bg-deep-purple/60 backdrop-blur-xl border border-lavender-mist/20 rounded-2xl shadow-xl shadow-black/30">
        <TabButton tabName="journal" label="Journal">
          <JournalIcon />
        </TabButton>
        <TabButton tabName="dreamview" label="Dream View">
          <AnalyticsIcon />
        </TabButton>
        <TabButton tabName="search" label="Search">
          <SearchIcon />
        </TabButton>
      </div>
    </footer>
  );
};

export default TabBar;