import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Get courses with YouTube links
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select(`
        *,
        course_youtube_links (
          id,
          title,
          url,
          description,
          order_index
        )
      `)
      .order('created_at', { ascending: false });

    if (coursesError) {
      console.error('Error fetching courses:', coursesError);
      return NextResponse.json({ error: coursesError.message }, { status: 500 });
    }

    // Transform data to match frontend expectations
    const transformedCourses = courses?.map(course => ({
      id: course.id,
      name: course.name,
      description: course.description,
      level: course.level,
      status: course.status,
      students: course.students_count,
      instructors: course.instructors_count,
      youtubeLinks: course.course_youtube_links || [],
      created_at: course.created_at,
      updated_at: course.updated_at,
    })) || [];

    return NextResponse.json(transformedCourses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const { youtubeLinks, ...courseData } = body;

    // Insert course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert([{
        ...courseData,
        students_count: courseData.students || 0,
        instructors_count: courseData.instructors || 0,
      }])
      .select()
      .single();

    if (courseError) {
      console.error('Error creating course:', courseError);
      return NextResponse.json({ error: courseError.message }, { status: 500 });
    }

    // Insert YouTube links if provided
    if (youtubeLinks && youtubeLinks.length > 0) {
      const youtubeLinksData = youtubeLinks.map((link: any, index: number) => ({
        course_id: course.id,
        title: link.title,
        url: link.url,
        description: link.description,
        order_index: index + 1,
      }));

      const { error: linksError } = await supabase
        .from('course_youtube_links')
        .insert(youtubeLinksData);

      if (linksError) {
        console.error('Error creating YouTube links:', linksError);
        // Don't fail the entire request, just log the error
      }
    }

    // Return the created course with YouTube links
    const { data: fullCourse, error: fetchError } = await supabase
      .from('courses')
      .select(`
        *,
        course_youtube_links (
          id,
          title,
          url,
          description,
          order_index
        )
      `)
      .eq('id', course.id)
      .single();

    if (fetchError) {
      console.error('Error fetching created course:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    const transformedCourse = {
      id: fullCourse.id,
      name: fullCourse.name,
      description: fullCourse.description,
      level: fullCourse.level,
      status: fullCourse.status,
      students: fullCourse.students_count,
      instructors: fullCourse.instructors_count,
      youtubeLinks: fullCourse.course_youtube_links || [],
      created_at: fullCourse.created_at,
      updated_at: fullCourse.updated_at,
    };

    return NextResponse.json(transformedCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 