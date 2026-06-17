'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../../lib/supabase'

async function getCoordinates(address, city, province) {
  const query = encodeURIComponent(
    `${address}, ${city}, ${province}, Argentina`
  )

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
  )

  const data = await response.json()

  if (data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    }
  }

  return null
}

export default function EditarRefugioPage() {
  const params = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    name: '',
    city: '',
    province: '',
    address: '',
    phone: '',
    alias: '',
    cvu: '',
    mp_link: '',
    has_capacity: true,
  })

  useEffect(() => {
    fetchShelter()
  }, [])

  async function fetchShelter() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('shelters')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !data) {
      router.push('/')
      return
    }

    if (data.user_id !== user?.id) {
      router.push('/')
      return
    }

    setForm(data)
    setLoading(false)
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target

    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    setSaving(true)

    const coords = await getCoordinates(form.address, form.city, form.province)

    const { error } = await supabase
      .from('shelters')
      .update({
        ...form,
        lat: coords?.lat || null,
        lng: coords?.lng || null,
      })
      .eq('id', params.id)

    setSaving(false)

    if (error) {
      alert('Error al actualizar refugio')
    } else {
      alert('Refugio actualizado correctamente')

      router.push('/')
    }
  }

  if (loading) {
    return <p className="p-6">Cargando...</p>
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold mb-6">✏️ Editar refugio</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Nombre"
            value={form.name || ''}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <input
            name="city"
            placeholder="Ciudad"
            value={form.city || ''}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <input
            name="province"
            placeholder="Provincia"
            value={form.province || ''}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <input
            name="address"
            placeholder="Dirección"
            value={form.address || ''}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <input
            name="phone"
            placeholder="Teléfono"
            value={form.phone || ''}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <input
            name="alias"
            placeholder="Alias"
            value={form.alias || ''}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <input
            name="cvu"
            placeholder="CVU"
            value={form.cvu || ''}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <input
            name="mp_link"
            placeholder="Link MercadoPago"
            value={form.mp_link || ''}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="has_capacity"
              checked={form.has_capacity}
              onChange={handleChange}
            />
            Tengo lugar disponible
          </label>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </main>
  )
}
