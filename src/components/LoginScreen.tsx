import { signInWithPopup } from 'firebase/auth'
import { auth, gProvider } from '@/lib/firebase'
import { SparklesCore } from '@/components/ui/sparkles'
import { useState } from 'react'

export default function LoginScreen() {
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('')
    try {
      await signInWithPopup(auth, gProvider)
    } catch {
      setError('Error al iniciar sesión. Inténtalo de nuevo.')
    }
  }

  return (
    <div className="fixed inset-0 bg-surface flex items-center justify-center p-6 overflow-hidden">
      {/* Sparkles background */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="login-sparkles"
          background="transparent"
          minSize={0.4}
          maxSize={1.2}
          particleDensity={80}
          particleColor="#6366f1"
          speed={1.5}
          className="w-full h-full"
        />
      </div>

      {/* Gradient overlay to fade sparkles at edges */}
      <div className="absolute inset-0 [mask-image:radial-gradient(600px_400px_at_center,transparent_30%,white)]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm space-y-8 text-center">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-surface-card border border-border flex items-center justify-center shadow-modal">
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-primary">TaskFlow</h1>
            <p className="text-secondary text-sm mt-1">Tu gestor de tareas personal</p>
          </div>
        </div>

        {/* Login button */}
        <div className="space-y-3">
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-white text-gray-800 font-medium hover:bg-gray-100 active:bg-gray-200 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>
          {error && <p className="text-priority-high text-sm">{error}</p>}
        </div>

        <p className="text-xs text-secondary">
          Tus tareas se sincronizan entre todos tus dispositivos
        </p>
      </div>
    </div>
  )
}
