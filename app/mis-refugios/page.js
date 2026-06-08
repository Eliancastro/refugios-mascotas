'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function MisRefugiosPage() {
  const [refugios, setRefugios] = useState([])
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    fetchRefugios()
  }, [])

  async function fetchRefugios() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data } = await supabase
      .from('shelters')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    setRefugios(data || [])
    setLoading(false)
  }

  if (loading) return <p className="p-6">Cargando...</p>

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Mis refugios
      </h1>

      {refugios.length === 0 ? (
        <p>No tenés refugios registrados.</p>
      ) : (
        <div className="grid gap-4">
          {refugios.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-xl shadow p-4"
            >
              <h2 className="font-bold text-xl">
                {r.name}
              </h2>

              <p>
                {r.city} - {r.province}
              </p>

              <p>
                {r.approved
                  ? '✅ Aprobado'
                  : '⏳ Pendiente'}
              </p>

              <button
                onClick={() =>
                  router.push(`/refugios/editar/${r.id}`)
                }
                className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Editar
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

