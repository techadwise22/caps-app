import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const level = searchParams.get('level');
    const search = searchParams.get('search');

    let query = supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    if (role && role !== 'all') {
      query = query.eq('role', role);
    }

    if (level && level !== 'all') {
      query = query.eq('level', level);
    }

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform data to match frontend expectations
    const transformedUsers = data?.map(user => ({
      id: user.id,
      name: user.full_name,
      email: user.email,
      role: user.role,
      level: user.level,
      status: user.status,
      joinedDate: user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : '',
      lastActive: user.last_login ? new Date(user.last_login).toISOString().replace('T', ' ').substring(0, 16) : 'Never',
    })) || [];

    return NextResponse.json(transformedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    // Transform frontend data to database format
    const userData = {
      full_name: body.name,
      email: body.email,
      role: body.role,
      level: body.level,
      status: body.status,
    };

    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform response to match frontend expectations
    const transformedUser = {
      id: data.id,
      name: data.full_name,
      email: data.email,
      role: data.role,
      level: data.level,
      status: data.status,
      joinedDate: data.created_at ? new Date(data.created_at).toISOString().split('T')[0] : '',
      lastActive: 'Never',
    };

    return NextResponse.json(transformedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 