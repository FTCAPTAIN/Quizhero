import { GoogleGenAI } from "@google/genai";

let genAI: GoogleGenAI | null = null;

/**
 * Returns a shared instance of the GoogleGenAI client.
 * Initializes it if it hasn't been already.
 */
export function getGeminiClient(): GoogleGenAI {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not set in environment variables.");
  }

  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return genAI;
}