import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateStatementOfPurpose = async (
  experience: string,
  education: string,
  postTitle: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Gemini API Key is missing. Please configure the environment.";
  }

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      You are a professional career consultant for a government scientific organization (CSIR).
      Write a concise, professional Statement of Purpose (max 200 words) for an applicant applying for the post of ${postTitle}.
      
      Applicant Background:
      Education: ${education}
      Experience Summary: ${experience}
      
      The tone should be formal, dedicated to national service, and technically sound.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Could not generate content.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating content. Please try again manually.";
  }
};