import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateResponse(input) {
  if (typeof input !== 'string' || input.trim() === '') {
    const error = new Error('Input text is required');
    error.statusCode = 400;
    throw error;
  }

  if (!process.env.API_KEY) {
    const error = new Error('Google AI API key is not configured');
    error.statusCode = 500;
    throw error;
  }

  try {
    const interaction = await ai.interactions.create({
      model: 'gemini-3.5-flash',
      input,
    });

    return interaction.output_text || '';
  } catch (error) {
    const wrappedError = new Error('Failed to generate AI response');
    wrappedError.statusCode = 502;
    wrappedError.cause = error;
    throw wrappedError;
  }
}
