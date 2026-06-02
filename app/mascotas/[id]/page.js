'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function MascotaDetalle({ params }) {
  const [mascota, setMascota] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    getUser()
    fetchMascota()
  }, [])

  async function getUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session?.user) {
      setUser(session.user)
    }
  }

  async function fetchMascota() {
    const { data, error } = await supabase
      .from('mascotas')
      .select('*')
      .eq('id', params.id)
      .single()

    if (!error) {
      setMascota(data)
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        const { data: favorito } = await supabase
          .from('favoritos')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('mascota_id', data.id)
          .single()

        if (favorito) {
          setIsFavorite(true)
        }
      }
    }
  }

  async function toggleFavorite() {
    if (!user) {
      alert('Tenés que iniciar sesión')
      return
    }

    if (isFavorite) {
      await supabase
        .from('favoritos')
        .delete()
        .eq('user_id', user.id)
        .eq('mascota_id', mascota.id)

      setIsFavorite(false)
    } else {
      await supabase.from('favoritos').insert({
        user_id: user.id,
        mascota_id: mascota.id,
      })

      setIsFavorite(true)
    }
  }

  async function reportarMascota() {
    const motivo = prompt('¿Por qué querés reportar esta publicación?')

    if (!motivo) return

    const { error } = await supabase.from('reports').insert({
      target_type: 'mascota',
      target_id: mascota.id,
      reason: motivo,
    })

    if (error) {
      alert('Error al enviar reporte')
    } else {
      alert('Reporte enviado correctamente')
    }
  }

  if (!mascota) {
    return <p style={{ padding: 40 }}>Cargando mascota...</p>
  }

  return (
    <div style={container}>
      <div style={card}>
        {mascota.imagen_url && (
          <img src={mascota.imagen_url} alt={mascota.tipo} style={image} />
        )}

        <span style={badge(mascota.estado)}>{mascota.estado}</span>

        <h1 style={title}>
          {mascota.tipo} {mascota.raza && `· ${mascota.raza}`}
        </h1>

        <p style={text}>
          <strong>Edad:</strong> {mascota.edad || 'No especificada'}
        </p>

        <p style={text}>
          <strong>Tamaño:</strong> {mascota.tamano || 'No especificado'}
        </p>

        <p style={text}>
          <strong>Ciudad:</strong> {mascota.ciudad || 'No especificada'}
        </p>

        {mascota.nombre_contacto && <p>👤 {mascota.nombre_contacto}</p>}

        {mascota.descripcion && <p style={desc}>{mascota.descripcion}</p>}

        <button
          onClick={toggleFavorite}
          style={{
            marginLeft: 20,
            marginTop: 10,
            padding: '12px 18px',
            border: 'none',
            borderRadius: 12,
            background: isFavorite ? '#ef4444' : '#e5e7eb',
            color: isFavorite ? '#fff' : '#111827',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {isFavorite ? '❤️ Guardado' : '🤍 Guardar'}
        </button>

        {mascota.telefono && (
          <a
            href={`https://wa.me/${mascota.telefono}`}
            target="_blank"
            className="bg-green-600 text-white px-4 py-3 rounded-xl inline-block mt-4"
          >
            💬 Contactar por WhatsApp
          </a>
        )}

        <button onClick={reportarMascota} style={reportButton}>
          🚨 Reportar publicación
        </button>
      </div>
    </div>
  )
}

const container = {
  minHeight: '100vh',
  background: '#f3f4f6',
  padding: 30,
  display: 'flex',
  justifyContent: 'center',
}

const card = {
  maxWidth: 700,
  width: '100%',
  background: '#fff',
  borderRadius: 20,
  overflow: 'hidden',
  boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
  paddingBottom: 30,
}

const contactName = {
  marginTop: 20,
  fontWeight: 600,
  color: '#374151',
}

const whatsappButton = {
  display: 'inline-block',
  marginTop: 16,
  padding: '14px 20px',
  background: '#16a34a',
  color: '#fff',
  borderRadius: 12,
  textDecoration: 'none',
  fontWeight: 700,
}

const image = {
  width: '100%',
  height: 400,
  objectFit: 'contain',
  background: '#fff',
}

const title = {
  fontSize: 32,
  margin: '20px',
}

const text = {
  margin: '10px 20px',
  fontSize: 16,
}

const desc = {
  margin: '20px',
  color: '#4b5563',
  lineHeight: 1.6,
}

const reportButton = {
  marginLeft: 20,
  marginTop: 12,
  display: 'inline-block',
  padding: '12px 20px',
  background: '#ef4444',
  color: '#fff',
  border: 'none',
  borderRadius: 12,
  fontWeight: 600,
  cursor: 'pointer',
}

const badge = (estado) => ({
  marginLeft: 20,
  marginTop: 20,
  display: 'inline-block',
  padding: '6px 14px',
  borderRadius: 999,
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
        : '#1e40af',
})
