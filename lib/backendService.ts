import { Type } from "@google/genai";
import type { Question, Difficulty, Category } from '../types';
import { getGeminiClient } from './gemini';

// In-memory array to simulate a database for generated questions.
const questionDatabase: Question[] = [];

/**
 * Generates new questions using the Gemini API.
 * This is the core function for creating quiz content.
 */
async function generateQuestionsFromAI(
  topic: string,
  numQuestions: number,
  difficulty: Difficulty
): Promise<Question[]> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not set.");
  }
  const ai = getGeminiClient();
      
  const fullPrompt = `Create a ${numQuestions}-question multiple-choice quiz about "${topic}" for a general audience with a difficulty of "${difficulty}". Provide the output as a JSON array. Each object in the array should represent a question and have the following properties: "question" (string), "options" (an array of 4 unique string options), "answer" (a string that is one of the options), "category" (a relevant category as a string, e.g., "History"), and "difficulty" (a string: "Easy", "Medium", or "Hard"). Ensure the JSON is well-formed.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: fullPrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            answer: { type: Type.STRING },
            category: { type: Type.STRING },
            difficulty: { type: Type.STRING },
          },
          required: ["question", "options", "answer", "category", "difficulty"]
        }
      }
    }
  });
  
  const jsonText = response.text;
  try {
    const parsedQuestions: Question[] = JSON.parse(jsonText);
    // Use the category and difficulty from the AI for better variety, with fallbacks.
    return parsedQuestions.map(q => ({
        ...q,
        difficulty: q.difficulty || difficulty,
        category: q.category || topic
      }));
  } catch(e) {
    console.error("Failed to parse JSON from AI response:", jsonText, e);
    throw new Error("AI returned malformed data that could not be parsed.");
  }
}

/**
 * Fetches new questions for the classic quiz mode when the static pool for a category is exhausted.
 * It generates questions and caches them in the in-memory database.
 */
export async function fetchNewQuestions(
  category: Category | 'All',
  difficulty: Difficulty,
  numQuestions: number = 10
): Promise<Question[]> {
  const topic = category === 'All' ? 'General Knowledge about India' : category;

  try {
    const newQuestions = await generateQuestionsFromAI(topic, numQuestions, difficulty);
    
    // Add to our in-memory "database" for this session
    questionDatabase.push(...newQuestions);
    
    return newQuestions;
  } catch (error) {
    console.error("Failed to fetch new questions from backend:", error);
    throw new Error("Could not generate new questions.");
  }
}

/**
 * Creates a custom quiz based on a user's prompt.
 * This is used for the "Create with Gemini" and "Daily Challenge" features.
 */
export async function createCustomAiQuiz(
    prompt: string,
    numQuestions: number,
    difficulty: Difficulty
): Promise<Question[]> {
    // This is a direct call to the generator and doesn't use the cache,
    // as each prompt is expected to be unique.
    return generateQuestionsFromAI(prompt, numQuestions, difficulty);
}
