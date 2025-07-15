import { NextRequest, NextResponse } from 'next/server';
import { getConstructionAIResponse, getAIResponseWithInstructions } from '@/lib/groq';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { messages, customInstructions } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Get AI response
    const aiResponse = customInstructions 
      ? await getAIResponseWithInstructions(messages, customInstructions)
      : await getConstructionAIResponse(messages);

    return NextResponse.json({ response: aiResponse });

  } catch (error) {
    console.error('Chat API error:', error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get AI instructions for admin customization
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('ai_instructions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return NextResponse.json({ instructions: data?.instructions || null });

  } catch (error) {
    console.error('Get instructions error:', error);
    
    return NextResponse.json(
      { error: 'Failed to get AI instructions' },
      { status: 500 }
    );
  }
}