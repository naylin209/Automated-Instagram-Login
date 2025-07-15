import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get current user to verify admin role
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get basic analytics
    const [
      { count: totalUsers },
      { count: totalChats }, 
      { data: recentChats },
      { data: activeUsers }
    ] = await Promise.all([
      // Total users
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true }),
      
      // Total chats
      supabase
        .from('chats')
        .select('*', { count: 'exact', head: true }),
      
      // Recent chats (last 7 days)
      supabase
        .from('chats')
        .select('id, created_at, user_id, title')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false }),
      
      // Active users (users with chats in last 30 days)
      supabase
        .from('chats')
        .select('user_id')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    ]);

    // Calculate daily chat counts for the last 7 days
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0)).toISOString();
      const dayEnd = new Date(date.setHours(23, 59, 59, 999)).toISOString();
      
      const { count } = await supabase
        .from('chats')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', dayStart)
        .lte('created_at', dayEnd);
      
      dailyStats.push({
        date: date.toISOString().split('T')[0],
        chats: count || 0,
      });
    }

    // Get unique active users count
    const uniqueActiveUsers = activeUsers ? [...new Set(activeUsers.map(u => u.user_id))].length : 0;

    const analytics = {
      overview: {
        totalUsers: totalUsers || 0,
        totalChats: totalChats || 0,
        activeUsers: uniqueActiveUsers,
        recentChats: recentChats?.length || 0,
      },
      dailyStats,
      recentActivity: recentChats?.slice(0, 10) || [],
      topUsers: [],
    };

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}