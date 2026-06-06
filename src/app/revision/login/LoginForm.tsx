"use client";

import { useState } from 'react';
import { login, signup } from './actions';

interface LoginFormProps {
  error?: string;
}

export default function LoginForm({ error }: LoginFormProps) {
  const [showEditorLogin, setShowEditorLogin] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-3xl shadow-lg border border-slate-200">
        {/* Editorial Branding */}
        <div className="text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded">
            Sala de Redacción
          </span>
          <h1 className="text-4xl font-serif font-black tracking-tight text-slate-900 mt-3 leading-none">
            EL MENSAJERO
          </h1>
          <p className="text-slate-400 text-xs mt-2 uppercase font-bold tracking-wider">
            Control Editorial
          </p>
        </div>
        {/* Dynamic Alerts */}
        {error && (
          <div className="p-3.5 text-xs bg-red-50 border border-red-200 text-red-700 rounded-2xl text-center font-bold animate-in fade-in duration-200">
            {error === 'invalid_password' && '❌ Contraseña incorrecta.'}
            {error === 'unauthorized' && '🚫 Acceso exclusivo para César y Laura.'}
            {error === 'unauthorized_email' && '🚫 Registro exclusivo para cuentas de César o Laura.'}
            {error === 'true' && '❌ Credenciales incorrectas o error de inicio.'}
          </div>
        )}
        <h2 className="text-2xl font-bold text-center mb-4">Login Editores</h2>

        <form className="space-y-4">
          {/* Email field */}
          {showEditorLogin && (
            <>
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Correo Electrónico (Cesar o Laura)
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="flex h-10 w-full rounded-xl border border-slate-250 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                />
              </div>
              <div className="space-y-1.5 mt-2">
                <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Contraseña (clave común)
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="flex h-10 w-full rounded-xl border border-slate-250 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                />
              </div>
            </>
          )}
          {/* Buttons */}
          <div className="flex flex-col gap-2 pt-4">
            <button
              formAction={login}
              className="inline-flex items-center justify-center rounded-xl text-sm font-bold uppercase tracking-wider transition-all bg-neutral-900 text-white hover:bg-neutral-800 h-11 px-5 shadow-sm"
            >
              Ingresar
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}
