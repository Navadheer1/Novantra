import { Router } from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import Groq from 'groq-sdk';

const router = Router();
// Initialize later or provide fallback to avoid crashing during module import
const getGroqClient = () => new Groq({ apiKey: process.env.GROQ_API_KEY || 'missing_key' });

router.post('/generate', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const { promptType, data } = req.body;
    
    if (!promptType || !data) {
      return res.status(400).json({ error: 'Missing promptType or data payload' });
    }

    let systemPrompt = "You are an expert AI startup assistant.";
    let userPrompt = "";

    switch (promptType) {
      case 'description':
        systemPrompt += " Your task is to generate a compelling, professional, and concise startup description (elevator pitch) based on the provided keywords and industry. Return only the description text.";
        userPrompt = `Industry: ${data.industry}. Keywords/Idea: ${data.idea}. Please write a 2-3 paragraph professional description.`;
        break;
      
      case 'pitch_summary':
        systemPrompt += " Your task is to summarize a startup's complex details into a clear, investor-friendly pitch summary.";
        userPrompt = `Please summarize the following details into a punchy 1-minute pitch: ${JSON.stringify(data)}`;
        break;
        
      case 'investor_outreach':
        systemPrompt += " Your task is to write a short, personalized cold-outreach message to a VC on behalf of a startup founder.";
        userPrompt = `Startup Name: ${data.startupName}. VC Focus: ${data.vcFocus}. What we do: ${data.description}. Write a 3-4 sentence cold outreach message.`;
        break;
        
      case 'profile_improvement':
        systemPrompt += " Your task is to analyze a startup profile and provide 3 concrete suggestions for improvement to attract investors.";
        userPrompt = `Current Profile: ${JSON.stringify(data)}. What should we improve?`;
        break;

      default:
        return res.status(400).json({ error: 'Invalid promptType' });
    }

    const groq = getGroqClient();
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama3-8b-8192', // Fast, reliable model for text generation
      temperature: 0.7,
      max_tokens: 1024
    });

    const resultText = chatCompletion.choices[0]?.message?.content || '';

    res.json({ result: resultText });
  } catch (error) {
    console.error('Groq AI Error:', error);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

export default router;
