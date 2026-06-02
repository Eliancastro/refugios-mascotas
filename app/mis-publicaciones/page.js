'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function MisPublicaciones() {
  const [mascotas, setMascotas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMascotas()
  }, [])

  async function fetchMascotas() {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) return

    const { data } = await supabase
      .from('mascotas')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    setMascotas(data || [])
    setLoading(false)
  }

  async function deleteMascota(id) {
    const confirmar = confirm('¿Seguro que querés eliminar esta publicación?')

    if (!confirmar) return

    await supabase.from('mascotas').delete().eq('id', id)

    setMascotas((prev) => prev.filter((m) => m.id !== id))
  }

  if (loading) {
    return <p style={{ padding: 30 }}>Cargando publicaciones...</p>
  }

  return (
    <div style={container}>
      <h1 style={title}>Mis publicaciones</h1>

      {mascotas.length === 0 ? (
        <p>No publicaste mascotas todavía.</p>
      ) : (
        <div style={grid}>
          {mascotas.map((m) => (
            <div key={m.id} style={card}>
              {m.imagen_url ? (
                <img src={m.imagen_url} alt={m.tipo} style={image} />
              ) : (
                <div style={noImage}>Sin foto</div>
              )}

              <div style={body}>
                <h3>
                  {m.tipo} {m.raza && `· ${m.raza}`}
                </h3>

                <p>{m.ciudad}</p>

                <div style={actions}>
                  <Link href={`/mascotas/${m.id}`} style={viewButton}>
                    Ver
                  </Link>

                  <button
                    onClick={() => deleteMascota(m.id)}
                    style={deleteButton}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const container = {
  padding: 30,
}

const title = {
  marginBottom: 30,
}

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 24,
}

const card = {
  background: '#fff',
  borderRadius: 20,
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
}

const image = {
  width: '100%',
  height: 240,
  objectFit: 'contain',
  background: '#fff',
}

const noImage = {
  height: 240,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f3f4f6',
}

const body = {
  padding: 18,
}

const actions = {
  display: 'flex',
  gap: 12,
  marginTop: 20,
}

const viewButton = {
  flex: 1,
  background: '#4f46e5',
  color: '#fff',
  padding: '12px',
  borderRadius: 10,
  textAlign: 'center',
  textDecoration: 'none',
  fontWeight: 600,
}

const deleteButton = {
  flex: 1,
  border: 'none',
  background: '#ef4444',
  color: '#fff',
  borderRadius: 10,
  fontWeight: 600,
  cursor: 'pointer',
}
