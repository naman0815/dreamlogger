import React, { useState } from 'react';
import { Dream, AnalysisResult } from '../types';
import { analyzeDreamPatterns } from '../services/geminiService';
import { LockIcon } from './icons/LockIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import Loader from './Loader';
import Tag from './Tag';

interface AnalysisCardProps {
  title: string;
  dreams: Dream[];
  isUnlocked: boolean;
  unlockMessage: string;
  period: string;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ title, dreams, isUnlocked, unlockMessage, period }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError('');
    setAnalysis(null);
    try {
      const result = await analyzeDreamPatterns(dreams);
      setAnalysis(result);
    } catch (err) {
      setError('An error occurred while analyzing. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (!isUnlocked) {
      return (
        <div className="text-center flex flex-col items-center justify-center h-full p-6 text-lavender-mist/60">
          <LockIcon />
          <p className="mt-2 font-semibold">Unlock {title} Analysis</p>
          <p className="text-sm mt-1">{unlockMessage}</p>
        </div>
      );
    }
    
    if (isLoading) {
        return (
            <div className="text-center flex flex-col items-center justify-center h-full p-6">
                <Loader />
                <p className="mt-2 text-lavender-mist animate-pulse">Analyzing dreams from {period}...</p>
            </div>
        );
    }

    if (error) {
        return (
             <div className="text-center p-6">
                <p className="text-red-400">{error}</p>
                <button onClick={handleAnalyze} className="mt-4 bg-lavender-mist text-deep-purple font-bold px-4 py-2 rounded-md hover:opacity-90">Retry</button>
            </div>
        )
    }

    if (analysis) {
        return (
             <div className="p-5 space-y-5 text-left">
                <div>
                    <h4 className="font-semibold text-md text-lavender-mist mb-2">Summary</h4>
                    <p className="text-moon-glow/90 text-sm whitespace-pre-wrap">{analysis.dreamSummary}</p>
                </div>

                <div>
                    <h4 className="font-semibold text-md text-lavender-mist mb-3">Core Elements</h4>
                    <div className="pl-4 border-l-2 border-dusk-blue space-y-4">
                        {analysis.coreElements.primarySymbols.length > 0 && (
                            <div>
                                <h5 className="font-semibold text-sm text-lavender-mist mb-2">Primary Symbols</h5>
                                <ul className="list-disc list-inside space-y-2">
                                    {analysis.coreElements.primarySymbols.map(item => (
                                        <li key={item.symbol} className="text-sm text-moon-glow/90">
                                            <span className="font-bold">{item.symbol}:</span> {item.interpretations}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {analysis.coreElements.charactersAndArchetypes.length > 0 && (
                            <div>
                                <h5 className="font-semibold text-sm text-lavender-mist mb-2">Characters & Archetypes</h5>
                                 <ul className="list-disc list-inside space-y-2">
                                    {analysis.coreElements.charactersAndArchetypes.map(item => (
                                        <li key={item.character} className="text-sm text-moon-glow/90">
                                            <span className="font-bold">{item.character}:</span> {item.role}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                         <div>
                            <h5 className="font-semibold text-sm text-lavender-mist mb-2">Setting & Atmosphere</h5>
                            <p className="text-moon-glow/90 text-sm">{analysis.coreElements.settingAndAtmosphere}</p>
                        </div>
                    </div>
                </div>

                {analysis.majorThemes.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-md text-lavender-mist mb-2">Major Themes</h4>
                        <div className="flex flex-wrap gap-2">
                            {analysis.majorThemes.map(theme => <Tag key={theme} label={theme} />)}
                        </div>
                    </div>
                )}

                {analysis.interpretations.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-md text-lavender-mist mb-2">Interpretations</h4>
                        <div className="space-y-3">
                            {analysis.interpretations.map(interp => (
                                <div key={interp.lens} className="bg-deep-purple/40 p-3 rounded-lg border border-lavender-mist/10">
                                    <h5 className="font-semibold text-sm text-lavender-mist">{interp.lens}</h5>
                                    <p className="text-sm text-moon-glow/90 mt-1 whitespace-pre-wrap">{interp.analysis}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {analysis.reflectiveQuestions.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-md text-lavender-mist mb-2">Questions for Self-Reflection</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-moon-glow/90 pl-1">
                            {analysis.reflectiveQuestions.map((q, i) => <li key={i}>{q}</li>)}
                        </ul>
                    </div>
                )}

                <button onClick={handleAnalyze} className="text-xs text-lavender-mist/60 hover:text-lavender-mist transition-colors mx-auto block pt-4">Regenerate Analysis</button>
            </div>
        )
    }


    return (
        <div className="text-center p-6 flex flex-col items-center">
            <h3 className="text-lg font-semibold text-moon-glow">Ready for Insights?</h3>
            <p className="text-lavender-mist/80 mt-1 text-sm">Analyze {dreams.length} dream(s) from {period}.</p>
            <button
                onClick={handleAnalyze}
                className="mt-4 flex items-center gap-2 bg-gradient-to-r from-dusk-blue to-purple-800 hover:from-dusk-blue hover:to-purple-700 text-moon-glow font-semibold px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
            >
                <SparklesIcon />
                <span>Generate Analysis</span>
            </button>
        </div>
    )
  };

  return (
    <div
      className={`bg-gradient-to-br from-night-sky/70 to-night-sky/50 backdrop-blur-md rounded-2xl shadow-lg border border-lavender-mist/10 transition-all duration-300 ${!isUnlocked && 'opacity-60'}`}
    >
      <h3 className="text-xl font-bold text-lavender-mist p-4 border-b border-lavender-mist/10">{title}</h3>
      <div className="min-h-[100px] flex items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default AnalysisCard;