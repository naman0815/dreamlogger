export interface Dream {
  id: string;
  date: string; // YYYY-MM-DD format
  title: string;
  description: string;
  tags: string[];
  people: string[];
}

export interface AnalysisResult {
  dreamSummary: string;
  coreElements: {
    primarySymbols: {
      symbol: string;
      interpretations: string;
    }[];
    charactersAndArchetypes: {
      character: string;
      role: string;
    }[];
    settingAndAtmosphere: string;
  };
  majorThemes: string[];
  interpretations: {
    lens: string;
    analysis: string;
  }[];
  reflectiveQuestions: string[];
}