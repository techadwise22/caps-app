import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const { youtubeLinks, ...courseData } = body;

    // Update course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .update({
        ...courseData,
        students_count: courseData.students || 0,
        instructors_count: courseData.instructors || 0,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (courseError) {
      console.error('Error updating course:', courseError);
      return NextResponse.json({ error: courseError.message }, { status: 500 });
    }

    // Handle YouTube links update
    if (youtubeLinks !== undefined) {
      // Delete existing YouTube links
      const { error: deleteError } = await supabase
        .from('course_youtube_links')
        .delete()
        .eq('course_id', params.id);

      if (deleteError) {
        console.error('Error deleting existing YouTube links:', deleteError);
      }

      // Insert new YouTube links if provided
      if (youtubeLinks && youtubeLinks.length > 0) {
        const youtubeLinksData = youtubeLinks.map((link: any, index: number) => ({
          course_id: params.id,
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
        }
      }
    }

    // Return the updated course with YouTube links
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
      .eq('id', params.id)
      .single();

    if (fetchError) {
      console.error('Error fetching updated course:', fetchError);
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
    console.error('Error updating course:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient();

    // Delete YouTube links first (due to foreign key constraint)
    const { error: linksError } = await supabase
      .from('course_youtube_links')
      .delete()
      .eq('course_id', params.id);

    if (linksError) {
      console.error('Error deleting YouTube links:', linksError);
    }

    // Delete the course
    const { error: courseError } = await supabase
      .from('courses')
      .delete()
      .eq('id', params.id);

    if (courseError) {
      console.error('Error deleting course:', courseError);
      return NextResponse.json({ error: courseError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 