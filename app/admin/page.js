'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminPage() {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const pass = prompt('Contraseña de administrador');
    if (pass === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthorized(true);
    } else {
      alert('Acceso denegado');
    }
  }, []);

  useEffect(() => {
    if (authorized) fetchShelters();
  }, [authorized]);

  if (!authorized) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Acceso restringido</p>
      </main>
    );
  }

  const fetchShelters = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('shelters')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPending(data.filter((s) => !s.approved));
      setApproved(data.filter((s) => s.approved));
    }

    setLoading(false);
  };

  const approveShelter = async (id) => {
    await supabase
      .from('shelters')
      .update({ approved: true })
      .eq('id', id);

    setMessage('✅ Refugio aprobado');
    fetchShelters();
  };

  const rejectShelter = async (id) => {
    const confirmDelete = confirm(
      '¿Seguro que querés rechazar este refugio?'
    );

    if (!confirmDelete) return;

    await supabase
      .from('shelters')
      .delete()
      .eq('id', id);

    fetchShelters();
  };

  // ⭐ CAMBIAR DISPONIBILIDAD (PRO)
  const toggleCapacity = async (id, current) => {
    await supabase
      .from('shelters')
      .update({ has_capacity: !current })
      .eq('id', id);

    fetchShelters();
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          🛠 Panel de Moderación
        </h1>

        {message && (
          <div className="mb-4 bg-green-100 text-green-800 p-3 rounded">
            {message}
          </div>
        )}

        {loading && <p>Cargando refugios...</p>}

        {/* PENDIENTES */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-yellow-700">
            ⏳ Pendientes de aprobación ({pending.length})
          </h2>

          {pending.length === 0 && (
            <p className="text-gray-500">
              No hay refugios pendientes
            </p>
          )}

          <div className="grid gap-4">
            {pending.map((shelter) => (
              <div
                key={shelter.id}
                className="bg-white p-4 rounded shadow border-l-4 border-yellow-400"
              >
                <h3 className="text-xl font-bold">{shelter.name}</h3>
                <p>📍 {shelter.city}, {shelter.province}</p>
                <p>📌 {shelter.address}</p>
                <p>📞 {shelter.phone}</p>

                <p className="font-semibold mt-1">
                  {shelter.has_capacity
                    ? '🟢 Tiene lugar disponible'
                    : '🔴 No tiene lugar'}
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => approveShelter(shelter.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700"
                  >
                    ✅ Aprobar
                  </button>

                  <button
                    onClick={() => rejectShelter(shelter.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700"
                  >
                    ❌ Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* APROBADOS */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-green-700">
            ✔ Refugios aprobados ({approved.length})
          </h2>

          {approved.length === 0 && (
            <p className="text-gray-500">
              Aún no hay refugios aprobados
            </p>
          )}

          <div className="grid gap-4">
            {approved.map((shelter) => (
              <div
                key={shelter.id}
                className="bg-white p-4 rounded shadow border-l-4 border-green-500"
              >
                <h3 className="text-xl font-bold">{shelter.name}</h3>
                <p>📍 {shelter.city}, {shelter.province}</p>
                <p>📌 {shelter.address}</p>
                <p>📞 {shelter.phone}</p>

                <p className="font-semibold mt-1">
                  {shelter.has_capacity
                    ? '🟢 Tiene lugar disponible'
                    : '🔴 Sin lugar'}
                </p>

                <p className="text-sm text-gray-500">
                  Aprobado ✔
                </p>

                {/* BOTON PRO */}
                <button
                  onClick={() =>
                    toggleCapacity(shelter.id, shelter.has_capacity)
                  }
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700"
                >
                  {shelter.has_capacity
                    ? '🔴 Marcar sin lugar'
                    : '🟢 Marcar con lugar'}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
