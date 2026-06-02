'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function FavoritosPage() {

  const [mascotas, setMascotas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFavoritos()
  }, [])

  async function fetchFavoritos() {

    const favoritos =
      JSON.parse(localStorage.getItem('favoritos')) || []

    if (favoritos.length === 0) {
      setMascotas([])
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('mascotas')
      .select('*')
      .in('id', favoritos)

    if (!error && data) {
      setMascotas(data)
    }

    setLoading(false)
  }

  async function removeFavorite(mascotaId) {

  await supabase
    .from('favoritos')
    .delete()
    .eq('mascota_id', mascotaId)

  setFavoritos((prev) =>
    prev.filter((m) => m.id !== mascotaId)
  )
}

  return (
    <div style={page}>

      <h1 style={title}>
        ❤️ Mis favoritos
      </h1>

      <p style={subtitle}>
        Mascotas que guardaste
      </p>

      {loading ? (
        <p>Cargando...</p>
      ) : mascotas.length === 0 ? (
        <p>No tenés favoritos todavía</p>
      ) : (
        <div style={grid}>
          {mascotas.map((m) => (
            <Link
              key={m.id}
              href={`/mascotas/${m.id}`}
              style={{
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <div style={card}>

                <div style={imageWrapper}>
                  {m.imagen_url ? (
                    <img
                      src={m.imagen_url}
                      alt={m.tipo}
                      style={image}
                    />
                  ) : (
                    <div style={noImage}>
                      Sin foto
                    </div>
                  )}
                </div>

                <div style={cardBody}>

                  <span style={badge(m.estado)}>
                    {labelEstado(m.estado)}
                  </span>

                  <h3 style={cardTitle}>
                    {m.tipo} {m.raza && `· ${m.raza}`}
                  </h3>

                  {m.ciudad && (
                    <p style={info}>
                      📍 {m.ciudad}
                    </p>
                  )}

                  <button
  onClick={() => removeFavorite(m.id)}
  style={removeButton}
>
  💔 Quitar favorito
</button>

                </div>

              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  )
}

/* HELPERS */

function labelEstado(estado) {
  if (estado === 'adopcion') return 'En adopción'
  if (estado === 'perdida') return 'Perdida'
  if (estado === 'encontrada') return 'Encontrada'

  return estado
}

/* ESTILOS */

const page = {
  minHeight: '100vh',
  padding: 32,
  background: '#f3f4f6'
}

const title = {
  fontSize: 28,
  marginBottom: 4
}

const subtitle = {
  color: '#6b7280',
  marginBottom: 24
}

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: 20
}

const card = {
  background: '#fff',
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
}

const imageWrapper = {
  width: '100%',
  height: 240,
  background: '#fff'
}

const image = {
  width: '100%',
  height: 260,
  objectFit: 'contain',
  background: '#fff'
}
const noImage = {
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#6b7280'
}

const cardBody = {
  padding: 16
}

const cardTitle = {
  fontSize: 16,
  fontWeight: 600,
  marginTop: 10
}

const info = {
  fontSize: 14,
  color: '#374151',
  marginTop: 6
}

const removeButton = {
  marginTop: 14,
  width: '100%',
  padding: 12,
  border: 'none',
  borderRadius: 10,
  background: '#ef4444',
  color: '#fff',
  fontWeight: 600,
  cursor: 'pointer'
}

const badge = (estado) => ({
  display: 'inline-block',
  padding: '4px 10px',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 500,

  background:
    estado === 'adopcion'
      ? '#dcfce7'
      : estado === 'perdida'
      ? '#fee2e2'
      : '#dbeafe',

  color:
    estado === 'adopcion'
      ? '#166534'
      : estado === 'perdida'
      ? '#991b1b'
      : '#1e40af'
})