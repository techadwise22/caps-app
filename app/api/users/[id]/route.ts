import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      .update(userData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
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
      lastActive: data.last_login ? new Date(data.last_login).toISOString().replace('T', ' ').substring(0, 16) : 'Never',
    };

    return NextResponse.json(transformedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient();

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 