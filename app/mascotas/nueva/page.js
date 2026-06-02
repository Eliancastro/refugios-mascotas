'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function NuevaMascota() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)

  const [form, setForm] = useState({
  urgent: false,
  estado: 'adopcion',
  tipo: '',
  raza: '',
  edad: '',
  tamano: '',
  descripcion: '',
  ciudad: '',
  telefono: '',
  nombre_contacto: '',
})

  const [file, setFile] = useState(null)
  useEffect(() => {

  async function checkUser() {

    const {
      data: { session }
    } = await supabase.auth.getSession()

    if (!session) {
      router.push('/login')
    }

  }

  checkUser()

}, [])

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  function handleFileChange(e) {
    const selected = e.target.files?.[0]
    if (!selected) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(selected.type)) {
      alert('Formato inválido. Solo JPG, PNG o WEBP.')
      return
    }

    if (selected.size > 5 * 1024 * 1024) {
      alert('La imagen no puede superar los 5MB.')
      return
    }

    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (loading) return

    setLoading(true)

    try {
      let imageUrl = null

      if (file) {
        const fileExt = file.name.split('.').pop()
        const filePath = `${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase
          .storage
          .from('mascotas')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data } = supabase
          .storage
          .from('mascotas')
          .getPublicUrl(filePath)

        imageUrl = data.publicUrl
      }

      const { error } = await supabase
        .from('mascotas')
        .insert({
          ...form,
          tipo: form.tipo.trim(),
          raza: form.raza.trim(),
          edad: form.edad.trim(),
          tamano: form.tamano.trim(),
          descripcion: form.descripcion.trim(),
          imagen_url: imageUrl,
        })

      if (error) throw error

      alert('Mascota cargada correctamente 🐾')

      setForm({
  estado: 'adopcion',
  tipo: '',
  raza: '',
  edad: '',
  tamano: '',
  descripcion: '',
  ciudad: '',
  telefono: '',
  nombre_contacto: '',
})

      setFile(null)
      setPreview(null)

    } catch (err) {
      alert(err.message)
    }

    setLoading(false)
  }

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={title}>Nueva mascota</h1>
        <p style={subtitle}>
          Publicá una mascota en adopción, perdida o encontrada
        </p>

        <form onSubmit={handleSubmit} style={formStyle}>

          {/* Estado */}
          <div>
            <label style={label}>Estado</label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              style={input}
            >
              <option value="adopcion">En adopción</option>
              <option value="perdida">Perdida</option>
              <option value="encontrada">Encontrada</option>
            </select>
            <label style={checkboxLabel}>
  <input
    type="checkbox"
    checked={form.urgent}
    onChange={(e) =>
      setForm({
        ...form,
        urgent: e.target.checked
      })
    }
  />

  🚨 Publicación urgente
</label>
          </div>

          {/* Tipo + Raza */}
          <div style={row}>
            <div style={column}>
              <label style={label}>Tipo *</label>
              <input
                name="tipo"
                value={form.tipo}
                placeholder="Perro, gato, tortuga…"
                onChange={handleChange}
                required
                style={input}
              />
            </div>

            <div style={column}>
              <label style={label}>Raza</label>
              <input
                name="raza"
                value={form.raza}
                placeholder="Opcional"
                onChange={handleChange}
                style={input}
              />
            </div>
          </div>

          {/* Edad + Tamaño */}
          <div style={row}>
            <div style={column}>
              <label style={label}>Edad</label>
              <input
                name="edad"
                value={form.edad}
                placeholder="Ej: 2 años"
                onChange={handleChange}
                style={input}
              />
            </div>

            <div style={column}>
              <label style={label}>Tamaño</label>
              <input
                name="tamano"
                value={form.tamano}
                placeholder="Chico / Mediano / Grande"
                onChange={handleChange}
                style={input}
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label style={label}>Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              rows={4}
              placeholder="Contá algo sobre la mascota..."
              onChange={handleChange}
              style={{ ...input, resize: 'vertical' }}
            />
          </div>

          {/* Contacto */}
<div style={row}>
  <div style={column}>
    <label style={label}>Nombre de contacto</label>
    <input
      name="nombre_contacto"
      value={form.nombre_contacto}
      placeholder="Tu nombre"
      onChange={handleChange}
      style={input}
    />
  </div>

  <div style={column}>
    <label style={label}>Teléfono / WhatsApp</label>
    <input
      name="telefono"
      value={form.telefono}
      placeholder="Ej: 5491122334455"
      onChange={handleChange}
      style={input}
    />
  </div>
</div>

<div>
  <label style={label}>Ciudad</label>
  <input
    name="ciudad"
    value={form.ciudad}
    placeholder="Ej: Morón"
    onChange={handleChange}
    style={input}
  />
</div>

          {/* Imagen PRO */}
          <div>
            <label style={label}>Foto de la mascota</label>

            <label style={uploadBox}>
              {!preview ? (
                <>
                  <div style={{ fontSize: 18 }}>📸</div>
                  <div style={{ fontWeight: 600 }}>
                    Click para subir una imagen
                  </div>
                  <div style={uploadHint}>
                    JPG, PNG o WEBP · Máx 5MB
                  </div>
                </>
              ) : (
                <img
  src={preview}
  alt="preview"
  style={{
    width: '100%',
    height: 320,
    objectFit: 'contain',
    borderRadius: 12,
    background: '#f3f4f6'
  }}
/>
              )}

              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Guardando...' : 'Guardar mascota'}
          </button>

        </form>
      </div>
    </div>
  )
}

/* 🎨 ESTILOS PRO */

const container = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #eef2ff, #f3f4f6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20
}

const card = {
  width: '100%',
  maxWidth: 760,
  background: '#fff',
  borderRadius: 20,
  padding: 30,
  boxShadow: '0 25px 60px rgba(0,0,0,0.08)'
}

const title = {
  fontSize: 30,
  marginBottom: 6
}

const subtitle = {
  color: '#6b7280',
  marginBottom: 20
}

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24
}

const label = {
  display: 'block',
  fontSize: 14,
  fontWeight: 600,
  marginBottom: 8,
  color: '#374151'
}

const input = {
  width: '100%',
  padding: 14,
  borderRadius: 12,
  border: '1px solid #e5e7eb',
  fontSize: 14,
  outline: 'none'
}

const row = {
  display: 'flex',
  gap: 20,
  flexWrap: 'wrap'
}

const column = {
  flex: 1,
  minWidth: 260
}


const uploadBox = {
  width: '100%',
  border: '2px dashed #c7d2fe',
  borderRadius: 14,
  padding: 30,
  cursor: 'pointer',
  background: '#f9fafb',
  transition: 'all 0.2s ease',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center'
}


const uploadHint = {
  fontSize: 13,
  color: '#6b7280',
  marginTop: 6
}

const button = {
  marginTop: 10,
  padding: 16,
  background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
  color: '#fff',
  fontSize: 16,
  fontWeight: 600,
  border: 'none',
  borderRadius: 14
}

const checkboxLabel = {
  display: 'flex',
  gap: 10,
  alignItems: 'center',
  fontWeight: 600,
  marginTop: 10
}


