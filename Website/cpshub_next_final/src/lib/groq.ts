import { Message } from './supabase';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const CONSTRUCTION_SYSTEM_PROMPT = `You are CPSHub AI, a specialized construction industry assistant. You provide expert guidance on:

1. **Project Management**: Planning, scheduling, resource allocation, risk management
2. **Materials & Equipment**: Selection, sourcing, specifications, cost optimization
3. **Building Codes & Regulations**: Safety standards, permits, compliance requirements
4. **Construction Methods**: Best practices, techniques, quality control
5. **Cost Estimation**: Budget planning, cost analysis, value engineering
6. **Safety Protocols**: OSHA compliance, site safety, risk mitigation

Guidelines:
- Provide practical, actionable advice
- Reference relevant building codes and standards when applicable
- Consider cost-effectiveness and safety in all recommendations
- Use construction industry terminology appropriately
- Structure responses clearly with headings and bullet points when helpful
- If unsure about specific local regulations, recommend consulting local authorities

Always prioritize safety and code compliance in your responses.`;

export async function getConstructionAIResponse(messages: Message[]): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('Groq API key not configured');
  }

  // Convert app messages to Groq format
  const groqMessages: GroqMessage[] = [
    {
      role: 'system',
      content: CONSTRUCTION_SYSTEM_PROMPT,
    },
    ...messages.map((msg): GroqMessage => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    })),
  ];

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: groqMessages,
        max_tokens: 1024,
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Groq API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from Groq API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Groq API error:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to get AI response');
  }
}

export async function getAIResponseWithInstructions(
  messages: Message[], 
  customInstructions?: string
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('Groq API key not configured');
  }

  // Use custom instructions if provided, otherwise use default
  const systemPrompt = customInstructions || CONSTRUCTION_SYSTEM_PROMPT;

  const groqMessages: GroqMessage[] = [
    {
      role: 'system',
      content: systemPrompt,
    },
    ...messages.map((msg): GroqMessage => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    })),
  ];

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: groqMessages,
        max_tokens: 1024,
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Groq API error:', error);
    throw error instanceof Error ? error : new Error('Failed to get AI response');
  }
}