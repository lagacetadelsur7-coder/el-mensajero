import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET() {
  // Return all posts (id, title) for selector
  const { data, error } = await supabase
    .from('posts')
    .select('id, title')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  // Expected JSON: { postId: string, coverTitle?: string, coverImageUrl?: string }
  const { postId, coverTitle, coverImageUrl } = await request.json();
  if (!postId) {
    return NextResponse.json({ error: 'postId required' }, { status: 400 });
  }
  // Reset previous featured
  await supabase.from('posts').update({ is_featured: false }).neq('id', postId);

  interface CoverUpdate {
    is_featured: boolean;
    cover_title_override?: string;
    cover_image_url?: string;
  }

  const updates: CoverUpdate = { is_featured: true };

  if (coverTitle) updates.cover_title_override = coverTitle;
  if (coverImageUrl) updates.cover_image_url = coverImageUrl;

  const { error } = await supabase.from('posts').update(updates).eq('id', postId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
