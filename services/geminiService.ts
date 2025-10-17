import { GoogleGenAI, Type } from "@google/genai";
import { Dream, AnalysisResult } from "../types";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    console.warn("API_KEY is not set in environment variables. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A short, evocative title for the dream, like a movie title. Maximum 5-7 words."
    },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 3 to 5 key themes, symbols, or topics from the dream. e.g., 'flying', 'lost', 'water'."
    },
    people: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of proper names of people mentioned in the dream. e.g., 'Sarah', 'Dr. Smith'."
    }
  },
  required: ["title", "tags", "people"]
};

const patternSchema = {
    type: Type.OBJECT,
    properties: {
        dreamSummary: {
            type: Type.STRING,
            description: "A brief summary of the dream's narrative (or a synthesis if multiple dreams are provided) in 2-3 sentences."
        },
        coreElements: {
            type: Type.OBJECT,
            properties: {
                primarySymbols: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            symbol: { type: Type.STRING },
                            interpretations: { type: Type.STRING, description: "Common interpretations for this symbol." }
                        },
                        required: ["symbol", "interpretations"]
                    },
                    description: "List of the most prominent symbols and their common interpretations."
                },
                charactersAndArchetypes: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            character: { type: Type.STRING },
                            role: { type: Type.STRING, description: "Potential symbolic or archetypal role." }
                        },
                        required: ["character", "role"]
                    },
                    description: "Key figures and their potential symbolic roles."
                },
                settingAndAtmosphere: {
                    type: Type.STRING,
                    description: "Analysis of the dream's location(s) and overall mood."
                }
            },
            required: ["primarySymbols", "charactersAndArchetypes", "settingAndAtmosphere"]
        },
        majorThemes: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 2-4 major potential themes running through the dream(s)."
        },
        interpretations: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    lens: { type: Type.STRING, description: "The perspective, e.g., 'A Jungian Lens' or 'A Cognitive Lens'." },
                    analysis: { type: Type.STRING }
                },
                required: ["lens", "analysis"]
            },
            description: "Distinct interpretations from at least two different psychological or narrative perspectives."
        },
        reflectiveQuestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 5-7 open-ended, thought-provoking questions to guide personal reflection."
        }
    },
    required: ["dreamSummary", "coreElements", "majorThemes", "interpretations", "reflectiveQuestions"]
};


export const analyzeDream = async (description: string): Promise<{ title: string, tags: string[], people: string[] }> => {
    if (!API_KEY) {
        return { title: '', tags: [], people: [] };
    }
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the following dream description. Create a short title, extract key themes as 'tags', and any names of people as 'people'. Return the result in JSON format. Dream: "${description}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            },
        });

        const jsonString = response.text;
        const parsed = JSON.parse(jsonString);

        return {
            title: parsed.title || '',
            tags: parsed.tags || [],
            people: parsed.people || [],
        };

    } catch (error) {
        console.error("Error analyzing dream with Gemini API:", error);
        return { title: '', tags: [], people: [] };
    }
};

const fullAnalysisPromptTemplate = `
**1. ROLE DEFINITION**

You are to act as a **Dream Analyst & Symbolism Expert**. Your expertise is grounded in a multi-disciplinary approach, drawing from:
* **Jungian Psychology:** Focusing on archetypes, the collective unconscious, individuation, and symbolism.
* **Cognitive Neuroscience:** Incorporating modern understandings of dreaming as a process for memory consolidation, emotional regulation, and threat simulation.
* **Cross-Cultural Mythology and Symbolism:** Recognizing that symbols can have universal meanings as well as culturally specific ones.
* **Narrative Analysis:** Treating dreams as stories with plots, characters, settings, and emotional arcs.

**2. TASK CLARIFICATION**

Your primary task is to conduct a comprehensive analysis of the dream collection I will provide below. Your goal is not to give a single, definitive "meaning" but to explore a range of potential interpretations and provide the user with a framework for their own reflection.

When analyzing a collection of dreams, focus on recurring patterns, evolving narratives, and overarching emotional tones. If only one dream is provided, perform a deep analysis on that single dream.

Your analysis must deconstruct the dream(s) into their core components:
* **Key Symbols and Objects:** Identify significant and recurring items, animals, or elements.
* **Characters and Archetypes:** Analyze the people or beings, their roles, and how they interact across dreams.
* **Setting and Environment:** Describe the dreamscapes and their potential significance.
* **Plot and Actions:** Outline the main events and recurring actions.
* **Emotional Arc:** Trace the primary feelings experienced.

**3. EXECUTION GUIDANCE**

Follow this structured, step-by-step process to generate your analysis. The final output must be a single JSON object matching the provided schema.

* **Step 1: Dream Summary:** Briefly summarize the narrative of the dream(s) in 2-3 sentences to show you have understood the key events. Synthesize common threads if multiple dreams are provided.
* **Step 2: Core Elements Breakdown:** Create a clearly sectioned analysis of the core components.
    * **Primary Symbols:** List prominent symbols and provide common interpretations for each.
    * **Characters/Archetypes:** Identify key figures and discuss their potential symbolic roles.
    * **Setting & Atmosphere:** Analyze the location(s) and overall mood.
* **Step 3: Thematic Analysis:** Based on the elements above, identify 2-4 major potential themes running through the dream(s).
* **Step 4: Multi-Perspective Interpretation:** Provide distinct interpretations from at least two of the following perspectives: A Jungian Lens, a Cognitive Lens, or a Narrative Lens.
* **Step 5: Synthesis and Reflective Questions:** Conclude with a list of 5-7 open-ended, thought-provoking questions to guide the user's personal reflection, connecting the dream patterns to their waking life.

**4. OUTCOME EXPECTATIONS**

* **Format:** The response must be a single, valid JSON object that strictly adheres to the schema provided in the API call. All the analysis must be contained within this JSON structure.
* **Tone:** Your tone should be insightful, empathetic, and objective. Avoid definitive or alarmist language. Use phrases like "This could symbolize...", "It might suggest...".
* **Depth:** The analysis must be multi-layered and avoid simplistic, "dream dictionary" answers.
* **Clarity:** Explain any psychological or symbolic concepts in simple, accessible terms.

---

**THE DREAM(S) TO ANALYZE ARE AS FOLLOWS:**
`;


export const analyzeDreamPatterns = async (dreams: Dream[]): Promise<AnalysisResult> => {
    const emptyResult: AnalysisResult = {
        dreamSummary: '',
        coreElements: { primarySymbols: [], charactersAndArchetypes: [], settingAndAtmosphere: '' },
        majorThemes: [],
        interpretations: [],
        reflectiveQuestions: [],
    };

    if (!API_KEY || dreams.length === 0) {
        return emptyResult;
    }

    const dreamDescriptions = dreams.map(d => `Date: ${d.date}\nTitle: ${d.title}\nDescription: ${d.description}`).join('\n\n---\n\n');
    const fullPrompt = fullAnalysisPromptTemplate + `\n\n${dreamDescriptions}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: patternSchema,
            },
        });
        
        const jsonString = response.text;
        const parsed = JSON.parse(jsonString);

        return {
            dreamSummary: parsed.dreamSummary || 'No summary available.',
            coreElements: parsed.coreElements || { primarySymbols: [], charactersAndArchetypes: [], settingAndAtmosphere: '' },
            majorThemes: parsed.majorThemes || [],
            interpretations: parsed.interpretations || [],
            reflectiveQuestions: parsed.reflectiveQuestions || [],
        };

    } catch (error) {
        console.error("Error analyzing dream patterns with Gemini API:", error);
        throw new Error("Failed to generate dream analysis.");
    }
}