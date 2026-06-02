'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    alert('Bienvenido 🐾')

    router.push('/mascotas')
  }

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={title}>Iniciar sesión</h1>

        <form onSubmit={handleLogin} style={form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={input}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={input}
            required
          />

          <button type="submit" style={button} disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}

/* ESTILOS */

const container = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f3f4f6',
}

const card = {
  width: '100%',
  maxWidth: 420,
  background: '#fff',
  padding: 30,
  borderRadius: 20,
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
}

const title = {
  fontSize: 28,
  marginBottom: 20,
}

const form = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
}

const input = {
  padding: 14,
  borderRadius: 10,
  border: '1px solid #d1d5db',
  fontSize: 14,
}

const button = {
  padding: 14,
  border: 'none',
  borderRadius: 10,
  background: '#4f46e5',
  color: '#fff',
  fontWeight: 600,
  cursor: 'pointer',
}
