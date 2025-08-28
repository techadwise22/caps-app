import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Get content items with YouTube links and author information
    const { data: contentItems, error: contentError } = await supabase
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
      .order('created_at', { ascending: false });

    if (contentError) {
      console.error('Error fetching content items:', contentError);
      return NextResponse.json({ error: contentError.message }, { status: 500 });
    }

    // Transform data to match frontend expectations
    const transformedContent = contentItems?.map(content => ({
      id: content.id,
      title: content.title,
      subtitle: content.subtitle,
      description: content.description,
      content_type: content.content_type,
      level: content.level,
      status: content.status,
      views_count: content.views_count || 0,
      author_name: content.author?.full_name || 'Unknown Author',
      youtubeLinks: content.content_youtube_links || [],
      created_at: content.created_at,
      updated_at: content.updated_at,
    })) || [];

    return NextResponse.json(transformedContent);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const { youtubeLinks, author_name, ...contentData } = body;

    // Find author by name (in a real app, you'd use proper user management)
    const { data: author, error: authorError } = await supabase
      .from('users')
      .select('id')
      .eq('full_name', author_name)
      .single();

    if (authorError && authorError.code !== 'PGRST116') {
      console.error('Error finding author:', authorError);
    }

    // Insert content item
    const { data: content, error: contentError } = await supabase
      .from('content_items')
      .insert([{
        ...contentData,
        author_id: author?.id || null,
      }])
      .select()
      .single();

    if (contentError) {
      console.error('Error creating content:', contentError);
      return NextResponse.json({ error: contentError.message }, { status: 500 });
    }

    // Insert YouTube links if provided
    if (youtubeLinks && youtubeLinks.length > 0) {
      const youtubeLinksData = youtubeLinks.map((link: any, index: number) => ({
        content_id: content.id,
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
        // Don't fail the entire request, just log the error
      }
    }

    // Return the created content with YouTube links
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
      .eq('id', content.id)
      .single();

    if (fetchError) {
      console.error('Error fetching created content:', fetchError);
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
    console.error('Error creating content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 