import React from 'react';
import { Dream } from '../types';
import AnalysisCard from './AnalysisCard';
import { sub, differenceInMonths } from 'date-fns';

interface DreamViewProps {
  dreams: Dream[];
}

const DreamView: React.FC<DreamViewProps> = ({ dreams }) => {
    const now = new Date();

    // User logs "last night's dream" on the morning of the next day.
    // So we should check for dreams logged with today's date OR yesterday's date.
    const todayStr = now.toDateString();
    const yesterdayStr = sub(now, { days: 1 }).toDateString();

    const lastNightDreams = dreams.filter(d => {
        const dreamDate = new Date(d.date + 'T00:00:00');
        const dreamDateStr = dreamDate.toDateString();
        return dreamDateStr === todayStr || dreamDateStr === yesterdayStr;
    });

    const lastWeekDreams = dreams.filter(d => new Date(d.date) >= sub(now, { days: 7 }));
    const lastMonthDreams = dreams.filter(d => new Date(d.date) >= sub(now, { days: 30 }));
    const lastYearDreams = dreams.filter(d => new Date(d.date) >= sub(now, { years: 1 }));

    const uniqueDaysInWeek = new Set(lastWeekDreams.map(d => d.date)).size;
    const uniqueDaysInMonth = new Set(lastMonthDreams.map(d => d.date)).size;
    
    let monthSpan = 0;
    if (dreams.length > 1) {
        const oldestDream = new Date(dreams[dreams.length - 1].date);
        const newestDream = new Date(dreams[0].date);
        monthSpan = differenceInMonths(newestDream, oldestDream);
    }

    const isWeekUnlocked = uniqueDaysInWeek >= 4;
    const isMonthUnlocked = uniqueDaysInMonth >= 15;
    const isYearUnlocked = monthSpan >= 6;


  return (
    <div>
        <header className="py-4">
             <h1 className="text-3xl font-bold text-moon-glow drop-shadow-lg text-center">Dream View</h1>
             <p className="text-lavender-mist/80 text-center mt-1">Unlock insights from your subconscious.</p>
        </header>
        <main className="mt-6 space-y-6">
            <AnalysisCard 
                title="Last Night's Dream"
                dreams={lastNightDreams}
                isUnlocked={lastNightDreams.length > 0}
                unlockMessage="Log the dream you had last night to see the analysis."
                period="last night"
            />
            <AnalysisCard 
                title="Past Week"
                dreams={lastWeekDreams}
                isUnlocked={isWeekUnlocked}
                unlockMessage={`Log dreams on ${4 - uniqueDaysInWeek} more day(s) this week to unlock.`}
                period="the past week"
            />
            <AnalysisCard 
                title="Past Month"
                dreams={lastMonthDreams}
                isUnlocked={isMonthUnlocked}
                unlockMessage={`Log dreams on ${15 - uniqueDaysInMonth} more day(s) this month to unlock.`}
                period="the past month"
            />
            <AnalysisCard 
                title="Past Year"
                dreams={lastYearDreams}
                isUnlocked={isYearUnlocked}
                unlockMessage="Log dreams over a 6-month period to unlock your yearly analysis."
                period="the past year"
            />
        </main>
    </div>
  );
};

export default DreamView;