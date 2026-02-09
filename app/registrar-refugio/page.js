'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function RegistrarRefugio() {
  const [form, setForm] = useState({
    name: '',
    city: '',
    province: '',
    address: '',
    phone: '',
    has_capacity: true,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError(null)

  const { error } = await supabase
    .from('shelters')
    .insert([
      {
        ...form,
        approved: false // 👈 CLAVE para la moderación
      }
    ])

  if (error) {
    setError(error.message)
  } else {
    setSuccess(true)
    setForm({
      name: '',
      city: '',
      province: '',
      address: '',
      phone: '',
      has_capacity: true,
    })
  }

  setLoading(false)
}


  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold mb-4 text-center">
          🏠 Registrar refugio
        </h1>

        <p className="text-gray-600 text-center mb-6">
          Completá este formulario para que rescatistas puedan contactarte
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            ❌ Error: {error}
          </div>
        )}

        {success && (
  <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800">
    <p className="font-bold text-lg mb-1">
      ✅ Refugio enviado correctamente
    </p>
    <p className="text-sm">
      Tu refugio quedó <strong>pendiente de aprobación</strong>.  
      Será visible en la plataforma una vez que sea revisado.
    </p>
  </div>
)}


        {!success && (
  <form onSubmit={handleSubmit} className="space-y-4">
    <input
      name="name"
      placeholder="Nombre del refugio"
      value={form.name}
      onChange={handleChange}
      required
      className="w-full p-3 border rounded"
    />

    <input
      name="city"
      placeholder="Ciudad"
      value={form.city}
      onChange={handleChange}
      required
      className="w-full p-3 border rounded"
    />

    <input
      name="province"
      placeholder="Provincia"
      value={form.province}
      onChange={handleChange}
      required
      className="w-full p-3 border rounded"
    />

    <input
      name="address"
      placeholder="Dirección"
      value={form.address}
      onChange={handleChange}
      className="w-full p-3 border rounded"
    />

    <input
      name="phone"
      placeholder="Teléfono (WhatsApp)"
      value={form.phone}
      onChange={handleChange}
      required
      className="w-full p-3 border rounded"
    />

    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        name="has_capacity"
        checked={form.has_capacity}
        onChange={handleChange}
      />
      Tengo lugar disponible ahora
    </label>

    <button
      type="submit"
      disabled={loading}
      className="w-full bg-indigo-600 text-white font-bold py-3 rounded hover:bg-indigo-700 transition"
    >
      {loading ? 'Enviando...' : 'Registrar refugio'}
    </button>
  </form>
)}
      </div>
    </main>
  );
}
