import { generateResponse } from '../services/geminiService.js';

export async function createPrompt(req, res, next) {
  try {
    const input = req.body?.input;
    const response = await generateResponse(input);

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    next(error);
  }
}
