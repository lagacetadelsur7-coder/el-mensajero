'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// DRAFTS (BORRADORES) ACTIONS
export async function getDrafts() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('articulos')
    .select('*, columnistas(nombre)')
    .eq('estado', 'borrador')
    .order('fecha_creacion', { ascending: false })

  if (error) {
    console.error('Error fetching drafts:', error)
    return []
  }

  return data.map(article => ({
    id: article.id,
    titulo: article.titulo,
    subtitulo: article.subtitulo,
    cuerpo: article.cuerpo,
    categoria: article.categoria,
    subcategoria: article.subcategoria,
    imagen_url: article.imagen_url,
    estado: article.estado,
    fecha: new Date(article.fecha_creacion).toLocaleDateString('es-AR'),
    columnista: article.columnistas?.nombre || 'Redacción'
  }))
}

export async function publishDraft(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('articulos')
    .update({ estado: 'publicado' })
    .eq('id', id)

  if (error) {
    console.error('Error publishing draft:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/revision/borradores')
  return { success: true }
}

export async function deleteDraft(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('articulos')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting draft:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/revision/borradores')
  return { success: true }
}

// COMMENTS (COMENTARIOS) ACTIONS
export async function getComments() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('comentarios')
    .select('*, articulos(titulo)')
    .order('fecha', { ascending: false })

  if (error) {
    console.error('Error fetching comments:', error)
    return []
  }

  return data.map(comment => ({
    id: comment.id,
    articuloId: comment.articulo_id,
    articuloTitulo: comment.articulos?.titulo || 'Artículo Eliminado',
    nick: comment.nick,
    comentario: comment.comentario,
    aprobado: comment.aprobado,
    fecha: new Date(comment.fecha).toLocaleDateString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }))
}

export async function approveComment(id: string, articuloId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('comentarios')
    .update({ aprobado: true })
    .eq('id', id)

  if (error) {
    console.error('Error approving comment:', error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/articulo/${articuloId}`)
  revalidatePath('/revision/comentarios')
  return { success: true }
}

export async function deleteComment(id: string, articuloId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('comentarios')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting comment:', error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/articulo/${articuloId}`)
  revalidatePath('/revision/comentarios')
  return { success: true }
}

// ADVERTISEMENTS (PUBLICIDADES) ACTIONS
export async function getAds() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('publicidades')
    .select('*')
    .order('ubicacion')

  if (error) {
    console.error('Error fetching advertisements:', error)
    return []
  }

  return data
}

export async function toggleAdActive(id: string, active: boolean) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('publicidades')
    .update({ activo: active })
    .eq('id', id)

  if (error) {
    console.error('Error toggling ad state:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/revision/publicidad')
  return { success: true }
}

export async function saveAd(ad: { id?: string; ubicacion: string; imagen_url: string; enlace_url: string; activo: boolean }) {
  const supabase = await createClient()
  
  if (ad.id) {
    // Update
    const { error } = await supabase
      .from('publicidades')
      .update({
        ubicacion: ad.ubicacion,
        imagen_url: ad.imagen_url,
        enlace_url: ad.enlace_url,
        activo: ad.activo
      })
      .eq('id', ad.id)

    if (error) {
      console.error('Error updating ad:', error)
      return { success: false, error: error.message }
    }
  } else {
    // Insert
    const { error } = await supabase
      .from('publicidades')
      .insert({
        ubicacion: ad.ubicacion,
        imagen_url: ad.imagen_url,
        enlace_url: ad.enlace_url,
        activo: ad.activo
      })

    if (error) {
      console.error('Error inserting ad:', error)
      return { success: false, error: error.message }
    }
  }

  revalidatePath('/')
  revalidatePath('/revision/publicidad')
  return { success: true }
}
