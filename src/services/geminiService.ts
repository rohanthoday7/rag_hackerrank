import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askRAG(question: string, context: string[]) {
  const prompt = `
    Context Information:
    ${context.map((c, i) => `[Source ${i + 1}]: ${c}`).join('\n')}

    Question: ${question}

    Based on the provided context, answer the question accurately. 
    If the answer is not in the context, say you don't know but suggest what documentation might be needed.
    Keep the tone professional and concise.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("RAG Error:", error);
    throw error;
  }
}

export async function classifyTicket(description: string) {
  const prompt = `
    Classify the following support ticket description into one of these categories: 
    - Billing
    - Account Access
    - Fraud
    - Technical Issue
    - General Inquiry

    Also provide a risk level (LOW, MED, HIGH) and a confidence score (0-100).

    Ticket Description: "${description}"

    Return the result as JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Classification Error:", error);
    throw error;
  }
}
