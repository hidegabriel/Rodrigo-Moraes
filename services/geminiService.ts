import { GoogleGenAI } from "@google/genai";
import { ServiceOrder } from "../types";

// Initialize the client. 
// Note: In a production environment, ensure API keys are not exposed to the client if not intended.
// For this demo, we assume process.env.API_KEY is available or injected.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateLegalAdvice = async (
  prompt: string,
  contextOS?: ServiceOrder
): Promise<string> => {
  try {
    let systemInstruction = `Você é um assistente jurídico sênior de um escritório de advocacia de alto nível. 
    Seu tom deve ser profissional, objetivo, estratégico e formal (jurídico).
    Você auxilia advogados na tomada de decisão, gestão de prazos e definição de estratégias processuais.
    Responda em Português do Brasil.`;

    if (contextOS) {
      systemInstruction += `
      
      ESTÁ SENDO ANALISADA A SEGUINTE ORDEM DE SERVIÇO (OS):
      - Número: ${contextOS.osNumber}
      - Cliente: ${contextOS.clientName}
      - Área: ${contextOS.legalArea}
      - Status: ${contextOS.status}
      - Descrição do Caso: ${contextOS.description}
      - Estratégia Atual: ${contextOS.strategy}
      - Métodos: ${contextOS.methods}
      - Prazos: ${contextOS.deadlines}
      
      Use essas informações para fornecer respostas específicas e contextualizadas sobre este caso.`;
    }

    const modelId = "gemini-3-flash-preview"; 

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7, // Balance between creativity and precision for legal advice
        maxOutputTokens: 800,
      }
    });

    return response.text || "Não foi possível gerar uma resposta no momento.";
  } catch (error) {
    console.error("Erro ao chamar Gemini API:", error);
    return "Desculpe, ocorreu um erro ao consultar a Inteligência Artificial. Verifique sua chave de API.";
  }
};
