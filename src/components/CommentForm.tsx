'use client'

import { useActionState } from 'react'
import { startTransition, useEffect, useRef } from 'react'
import { submitComment } from '@/app/actions/comments'
import { MessageSquare, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

interface CommentFormProps {
  articuloId: string
}

export default function CommentForm({ articuloId }: CommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  
interface SubmitCommentState {
  success: boolean;
  error?: string;
  message?: string;
}

const [state, formAction, isPending] = useActionState<SubmitCommentState, FormData>(submitComment, { success: false });

  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset()
    }
  }, [state])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <div className="bg-white border border-neutral-200 shadow-sm rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-cyan-50 text-cyan-600 rounded-lg">
          <MessageSquare className="w-5 h-5" />
        </div>
        <h4 className="font-serif text-lg font-bold text-neutral-900">Deja tu opinión</h4>
      </div>

      {state?.success && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold">¡Comentario recibido!</p>
            <p className="text-emerald-700 mt-1">{state.message}</p>
          </div>
        </div>
      )}

      {state?.error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold">Error al enviar</p>
            <p className="text-rose-700 mt-1">{state.error}</p>
          </div>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="articuloId" value={articuloId} />
        
        <div>
          <label htmlFor="nick" className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
            Nombre / Seudónimo
          </label>
          <input 
            type="text" 
            id="nick"
            name="nick" 
            required
            placeholder="Ej. Juan Pérez" 
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 focus:bg-white transition-all text-sm"
          />
        </div>

        <div>
          <label htmlFor="comentario" className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
            Tu comentario
          </label>
          <textarea 
            id="comentario"
            name="comentario" 
            required
            placeholder="Escribe tu comentario aquí de manera respetuosa..." 
            rows={4}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 focus:bg-white transition-all text-sm resize-none"
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-850 text-white font-medium py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Enviar Comentario
            </>
          )}
        </button>
        <p className="text-center text-xs text-neutral-400 mt-2">
          Los comentarios están sujetos a moderación antes de ser publicados para mantener un espacio de debate sano.
        </p>
      </form>
    </div>
  )
}
