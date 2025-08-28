import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const { youtubeLinks, author_name, ...contentData } = body;

    // Find author by name (in a real app, you'd use proper user management)
    let authorId = null;
    if (author_name) {
      const { data: author, error: authorError } = await supabase
        .from('users')
        .select('id')
        .eq('full_name', author_name)
        .single();

      if (!authorError) {
        authorId = author.id;
      }
    }

    // Update content item
    const { data: content, error: contentError } = await supabase
      .from('content_items')
      .update({
        ...contentData,
        author_id: authorId,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (contentError) {
      console.error('Error updating content:', contentError);
      return NextResponse.json({ error: contentError.message }, { status: 500 });
    }

    // Handle YouTube links update
    if (youtubeLinks !== undefined) {
      // Delete existing YouTube links
      const { error: deleteError } = await supabase
        .from('content_youtube_links')
        .delete()
        .eq('content_id', params.id);

      if (deleteError) {
        console.error('Error deleting existing YouTube links:', deleteError);
      }

      // Insert new YouTube links if provided
      if (youtubeLinks && youtubeLinks.length > 0) {
        const youtubeLinksData = youtubeLinks.map((link: any, index: number) => ({
          content_id: params.id,
          title: link.title,
          url: link.url,
          description: link.description,
          order_index: index + 1,
        }));

        const { error: linksError } = await supabase
          .from('content_youtube_links')
          .insert(youtubeLinksData);

        if (linksError) {
          console.error('Error creating YouTube links:', linksError);
        }
      }
    }

    // Return the updated content with YouTube links
    const { data: fullContent, error: fetchError } = await supabase
      .from('content_items')
      .select(`
        *,
        content_youtube_links (
          id,
          title,
          url,
          description,
          order_index
        ),
        author:users!content_items_author_id_fkey (
          full_name
        )
      `)
      .eq('id', params.id)
      .single();

    if (fetchError) {
      console.error('Error fetching updated content:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    const transformedContent = {
      id: fullContent.id,
      title: fullContent.title,
      subtitle: fullContent.subtitle,
      description: fullContent.description,
      content_type: fullContent.content_type,
      level: fullContent.level,
      status: fullContent.status,
      views_count: fullContent.views_count || 0,
      author_name: fullContent.author?.full_name || author_name,
      youtubeLinks: fullContent.content_youtube_links || [],
      created_at: fullContent.created_at,
      updated_at: fullContent.updated_at,
    };

    return NextResponse.json(transformedContent);
  } catch (error) {
    console.error('Error updating content:', error);
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
      .from('content_youtube_links')
      .delete()
      .eq('content_id', params.id);

    if (linksError) {
      console.error('Error deleting YouTube links:', linksError);
    }

    // Delete the content item
    const { error: contentError } = await supabase
      .from('content_items')
      .delete()
      .eq('id', params.id);

    if (contentError) {
      console.error('Error deleting content:', contentError);
      return NextResponse.json({ error: contentError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 