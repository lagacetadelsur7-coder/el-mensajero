import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const runtime = 'edge';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('coverImage') as File | null;
  const postId = formData.get('postId') as string | null;

  if (!file || !postId) {
    return NextResponse.json({ error: 'Missing file or postId' }, { status: 400 });
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${postId}-${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('cover-images')
    .upload(fileName, await file.arrayBuffer(), {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const publicUrl = supabase.storage.from('cover-images').getPublicUrl(data.path).data.publicUrl;
  return NextResponse.json({ publicUrl });
}
