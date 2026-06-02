'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const router = useRouter()

  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  async function getUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    setUser(session?.user || null)
  }

  async function handleLogout() {
    await supabase.auth.signOut()

    setUser(null)

    router.push('/login')
  }

  return (
    <nav style={nav}>
      {/* LOGO */}
      <Link href="/" style={logo}>
        🐾 Refugios Mascotas
      </Link>

      {isMobile && (
        <button onClick={() => setMenuOpen(!menuOpen)} style={hamburger}>
          ☰
        </button>
      )}

      {/* LINKS */}
      <div
        style={
          isMobile
            ? menuOpen
              ? { ...links, ...mobileMenuOpen }
              : { display: 'none' }
            : links
        }
      >
        <Link href="/" style={link}>
          Inicio
        </Link>

        <Link href="/mascotas" style={link}>
          Mascotas
        </Link>

        {user && (
          <>
            <Link href="/mascotas/nueva" style={link}>
              Publicar
            </Link>

            <Link href="/favoritos" style={link}>
              Favoritos
            </Link>

            <Link href="/mis-publicaciones" style={link}>
              Mis publicaciones
            </Link>
          </>
        )}

        {!user ? (
          <>
            <Link href="/login" style={link}>
              Login
            </Link>

            <Link href="/register" style={registerButton}>
              Registrarse
            </Link>
          </>
        ) : (
          <button onClick={handleLogout} style={logoutButton}>
            Cerrar sesión
          </button>
        )}
      </div>
    </nav>
  )
}

/* ESTILOS */

const nav = {
  width: '100%',
  padding: '16px 24px',
  background: '#ffffff',
  borderBottom: '1px solid #e5e7eb',

  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  position: 'sticky',
  top: 0,
  zIndex: 999,

  boxSizing: 'border-box',
}

const logo = {
  fontWeight: 700,
  fontSize: 20,
  textDecoration: 'none',
  color: '#111827',

  display: 'flex',
  alignItems: 'center',

  flexShrink: 0,
}

const links = {
  display: 'flex',
  gap: 14,
  alignItems: 'center',
}

const link = {
  textDecoration: 'none',
  color: '#374151',
  fontWeight: 500,
}

const registerButton = {
  textDecoration: 'none',
  background: '#4f46e5',
  color: '#fff',
  padding: '10px 14px',
  borderRadius: 10,
  fontWeight: 600,
}

const logoutButton = {
  border: 'none',
  background: '#ef4444',
  color: '#fff',
  padding: '10px 14px',
  borderRadius: 10,
  fontWeight: 600,
  cursor: 'pointer',
}

const hamburger = {
  border: 'none',
  background: 'transparent',
  fontSize: 28,
  cursor: 'pointer',
  color: '#111827',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const mobileMenuOpen = {
  position: 'absolute',
  top: 70,
  right: 16,
  background: '#fff',
  padding: 20,
  borderRadius: 16,
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 16,
}
