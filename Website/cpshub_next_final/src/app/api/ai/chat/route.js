import { NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function POST(request) {
  try {
    const { messages } = await request.json();
    
    if (!GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Groq API key not configured' },
        { status: 500 }
      );
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: messages,
        temperature: 0.7,
        max_tokens: 800
      })
    };
    
    const response = await fetch(API_URL, requestOptions);
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: `Groq API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      content: data.choices[0].message.content
    });
    
  } catch (error) {
    console.error('Error in AI chat API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}