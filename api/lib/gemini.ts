import { GoogleGenAI } from '@google/genai';

// TODO (Hackathon Day): Cấu hình và gọi Gemini API trong thời gian thi
const apiKey = process.env.GEMINI_API_KEY || '';

export function getGeminiClient(): GoogleGenAI | null {
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

export const GEMINI_MODEL = 'gemini-2.5-flash';
