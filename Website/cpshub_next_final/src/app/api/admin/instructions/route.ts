import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Get current AI instructions
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

    return NextResponse.json({ 
      instructions: data?.instructions || null,
      lastUpdated: data?.created_at || null 
    });

  } catch (error) {
    console.error('Get instructions error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI instructions' },
      { status: 500 }
    );
  }
}

// Update AI instructions
export async function POST(request: NextRequest) {
  try {
    const { instructions } = await request.json();

    if (!instructions || typeof instructions !== 'string') {
      return NextResponse.json(
        { error: 'Instructions are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('ai_instructions')
      .insert([
        {
          instructions: instructions.trim(),
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true,
      data,
      message: 'AI instructions updated successfully' 
    });

  } catch (error) {
    console.error('Update instructions error:', error);
    return NextResponse.json(
      { error: 'Failed to update AI instructions' },
      { status: 500 }
    );
  }
}

// Get all instruction history
export async function PUT() {
  try {
    const { data, error } = await supabase
      .from('ai_instructions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    return NextResponse.json({ history: data || [] });

  } catch (error) {
    console.error('Get instruction history error:', error);
    return NextResponse.json(
      { error: 'Failed to get instruction history' },
      { status: 500 }
    );
  }
}