import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase environment variables not found, using fallback data');
      
      // Return fallback data when environment variables are not available
      const fallbackUsers = [
        {
          id: '1',
          name: 'Rahul Sharma',
          email: 'rahul.sharma@example.com',
          role: 'student',
          level: 'Foundation',
          status: 'active',
          joinedDate: '2024-01-15',
          lastActive: '2024-01-15 10:30 AM',
        },
        {
          id: '2',
          name: 'Priya Patel',
          email: 'priya.patel@example.com',
          role: 'instructor',
          level: 'Intermediate',
          status: 'active',
          joinedDate: '2024-01-14',
          lastActive: '2024-01-15 09:15 AM',
        },
        {
          id: '3',
          name: 'Amit Kumar',
          email: 'amit.kumar@example.com',
          role: 'student',
          level: 'Final',
          status: 'active',
          joinedDate: '2024-01-13',
          lastActive: '2024-01-15 11:45 AM',
        },
        {
          id: '4',
          name: 'Neha Singh',
          email: 'neha.singh@example.com',
          role: 'student',
          level: 'Foundation',
          status: 'pending',
          joinedDate: '2024-01-12',
          lastActive: 'Never',
        },
        {
          id: '5',
          name: 'Rajesh Verma',
          email: 'rajesh.verma@example.com',
          role: 'instructor',
          level: 'Final',
          status: 'active',
          joinedDate: '2024-01-11',
          lastActive: '2024-01-15 08:20 AM',
        },
      ];

      // Apply filters to fallback data
      const { searchParams } = new URL(request.url);
      const role = searchParams.get('role');
      const level = searchParams.get('level');
      const search = searchParams.get('search');

      let filteredUsers = fallbackUsers;

      if (role && role !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.role === role);
      }

      if (level && level !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.level === level);
      }

      if (search) {
        filteredUsers = filteredUsers.filter(user => 
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
        );
      }

      return NextResponse.json(filteredUsers);
    }

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
    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase environment variables not found, using fallback response');
      
      const body = await request.json();
      
      // Return a mock response for demonstration
      const mockUser = {
        id: Date.now().toString(),
        name: body.name,
        email: body.email,
        role: body.role,
        level: body.level,
        status: body.status,
        joinedDate: new Date().toISOString().split('T')[0],
        lastActive: 'Never',
      };

      return NextResponse.json(mockUser);
    }

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