import { GoogleGenAI } from "@google/genai";

// Helper to safeguard against missing keys in a demo environment
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const getMissionBriefing = async (): Promise<string> => {
  const ai = getAI();
  if (!ai) return "Mission: Reach the gold platform. Use WASD to move and SPACE to jump.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate a very short, 1-sentence, high-energy sci-fi mission briefing for a parkour runner about to traverse a neon city skyline. Do not use quotes.",
    });
    return response.text || "Mission Start: Traverse the sector.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "System Offline. Manual override engaged. Objective: Reach the end.";
  }
};

export const getFailureCoach = async (): Promise<string> => {
  const ai = getAI();
  if (!ai) return "Gravity is a harsh mistress. Try again.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Give a short, witty, 1-sentence roast or helpful tip to a parkour runner who just fell off a building.",
    });
    return response.text || "Watch your step!";
  } catch (error) {
    return "Re-initializing simulation...";
  }
};

export const getVictorySpeech = async (timeElapsed: number): Promise<string> => {
  const ai = getAI();
  if (!ai) return `Course complete! Time: ${timeElapsed.toFixed(2)}s`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `A parkour runner just finished a course in ${timeElapsed.toFixed(2)} seconds. Give them a very short, 1-sentence congratulation based on their speed.`,
    });
    return response.text || "Great run!";
  } catch (error) {
    return "Course Completed.";
  }
};