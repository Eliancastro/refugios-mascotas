'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import {
  esFavorito,
  toggleFavorito
} from '../../lib/favoritos'

export default function MascotasPage() {
  const [mascotas, setMascotas] = useState([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const estadoFiltro =
  searchParams.get('estado') || ''
  const router = useRouter()
  const [busqueda, setBusqueda] = useState('')
  const [favoritos, setFavoritos] = useState([])


  useEffect(() => {
    fetchMascotas()
  }, [estadoFiltro])

  useEffect(() => {
  const favoritosGuardados =
    JSON.parse(localStorage.getItem('favoritos')) || []

  setFavoritos(favoritosGuardados)
}, [])


  async function fetchMascotas() {
    setLoading(true)

    let query = supabase
      .from('mascotas')
      .select('*')
      .order('urgent', { ascending: false })
      .order('created_at', { ascending: false })

    if (estadoFiltro) {
      query = query.eq('estado', estadoFiltro)
    }

    const { data, error } = await query

    if (!error && data) {
      setMascotas(data)
    }

    setLoading(false)
  }

  return (
    <div style={page}>
      <h1 style={title}>Mascotas</h1>

      <p style={subtitle}>
        Mascotas disponibles en refugios de todo el país
      </p>

      {/* FILTRO */}
      <div style={filterBox}>
        <select
          value={estadoFiltro}
          onChange={(e) =>
  router.push(
    `/mascotas?estado=${e.target.value}`
  )
}
          style={select}
        >
          <option value="">Todas</option>
          <option value="adopcion">En adopción</option>
          <option value="perdida">Perdidas</option>
          <option value="encontrada">Encontradas</option>
        </select>
      </div>

      {/* BUSCADOR */}
<div style={searchBox}>
  <input
    type="text"
    placeholder="Buscar por tipo, raza o ciudad..."
    value={busqueda}
    onChange={(e) => setBusqueda(e.target.value)}
    style={searchInput}
  />
</div>

      {/* CONTENIDO */}
      {loading ? (
        <p>Cargando mascotas...</p>
      ) : mascotas.length === 0 ? (
        <p>No hay mascotas para mostrar</p>
      ) : (
        <div style={grid}>
          {mascotas
  .filter((m) => {
    const texto = busqueda.toLowerCase()

    return (
      m.tipo?.toLowerCase().includes(texto) ||
      m.raza?.toLowerCase().includes(texto) ||
      m.ciudad?.toLowerCase().includes(texto)
    )
  })
  .map((m) => (
    
    <div
    key={m.id}
    style={{
      ...card,
      
      border: m.urgent
      ? '3px solid #ef4444'
      : 'none',
      
      animation: m.urgent
      ? 'pulse 2s infinite'
      : 'none'
    }}
    onClick={() => router.push(`/mascotas/${m.id}`)}
>
        {/* IMAGEN */}
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

        {/* BODY */}
        <div style={cardBody}>

          <span style={badge(m.estado)}>
            {labelEstado(m.estado)}
          </span>

          {m.urgent && (
  <span style={urgentBadge}>
    🚨 URGENTE
  </span>
)}

          <h3 style={cardTitle}>
            {m.tipo} {m.raza && `· ${m.raza}`}
          </h3>

          <p style={info}>
            Edad: {m.edad || 'No especificada'}
          </p>

          <p style={info}>
            Tamaño: {m.tamano || 'No especificado'}
          </p>

          {m.ciudad && (
            <p style={info}>
              📍 {m.ciudad}
            </p>
          )}

          {m.descripcion && (
            <p style={desc}>
              {m.descripcion}
            </p>
          )}
            
            <div style={{ flex: 1 }} />
          <div style={actions}>

  <button style={button}>
    Ver mascota
  </button>

  <button
  onClick={(e) => {
    e.stopPropagation()

    const nuevos = toggleFavorito(m.id)

    setFavoritos(nuevos)
  }}
  style={favButton}
  type="button"
>
  {favoritos.includes(m.id)
    ? '❤️'
    : '🤍'}
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
  padding: '24px 16px',
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

const filterBox = {
  marginBottom: 24
}

const searchBox = {
  marginBottom: 24
}

const searchInput = {
  width: '100%',
  maxWidth: 400,
  padding: 12,
  borderRadius: 10,
  border: '1px solid #d1d5db',
  fontSize: 14
}

const select = {
  padding: 10,
  borderRadius: 8,
  border: '1px solid #d1d5db',
  fontSize: 14
}

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 24,
  marginTop: 30
}

const card = {
  width: '100%',
  background: '#fff',
  borderRadius: 20,
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0,0,0,0.06)',

  display: 'flex',
  flexDirection: 'column',

  minHeight: 560
}

const imageWrapper = {
  width: '100%',
  height: 260,
  background: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const image = {
  width: '100%',
  height: 260,
  objectFit: 'contain',
  background: '#fff'
}

const noImage = {
  color: '#6b7280'
}

const cardBody = {
  padding: 18,

  display: 'flex',
  flexDirection: 'column',

  flex: 1
}

const cardTitle = {
  fontSize: 16,
  fontWeight: 600
}

const info = {
  fontSize: 14,
  color: '#374151'
}

const desc = {
  fontSize: 13,
  color: '#6b7280',
  marginTop: 6
}

const badge = (estado) => ({
  alignSelf: 'flex-start',
  padding: '4px 10px',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 500,
  marginBottom: 6,

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

const button = {
  
  marginTop: 14,
  width: '100%',
  padding: 12,
  border: 'none',
  borderRadius: 10,
  background: '#4f46e5',
  color: '#fff',
  fontWeight: 600,
  cursor: 'pointer'
}

const container = {
  padding: 20,
  maxWidth: 1400,
  margin: '0 auto'
}

const actions = {
  display: 'flex',
  gap: 10,
  marginTop: 14
}

const favButton = {
  width: 52,
  border: 'none',
  borderRadius: 10,
  background: '#f3f4f6',
  cursor: 'pointer',
  fontSize: 22
}

const urgentBadge = {
  background: '#ef4444',
  color: '#fff',
  padding: '6px 10px',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  alignSelf: 'flex-start',
  marginTop: 8
}