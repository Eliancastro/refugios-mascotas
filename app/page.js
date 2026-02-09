'use client';

import ShelterCard from "./components/ShelterCard.jsx";
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [urgent, setUrgent] = useState(false);

  const fetchShelters = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('shelters')
        .select('id, name, city, province, address, phone, has_capacity, approved')
        .eq('has_capacity', true)
        .eq('approved', true);

      if (error) throw error;

      setShelters(data || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelters();

    const channel = supabase
      .channel('realtime shelters')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shelters',
        },
        () => {
          fetchShelters();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredShelters = shelters
    .filter((shelter) => {
      const search = filter.toLowerCase();
      if (!search) return true;

      return (
        shelter.city?.toLowerCase().includes(search) ||
        shelter.province?.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => {
      const search = filter.toLowerCase();

      const aCity = shelterScore(a, search);
      const bCity = shelterScore(b, search);

      if (urgent) {
        return (
          Number(b.has_capacity) - Number(a.has_capacity) ||
          bCity - aCity
        );
      }

      return bCity - aCity;
    });

  function shelterScore(shelter, search) {
    if (!search) return 0;
    if (shelter.city?.toLowerCase().includes(search)) return 2;
    if (shelter.province?.toLowerCase().includes(search)) return 1;
    return 0;
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🐾 Refugios de Mascotas
          </h1>

          <div className="mt-4">
            <a
              href="/registrar-refugio"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
            >
              ➕ ¿Sos refugio? Sumate
            </a>
          </div>

          <p className="text-xl text-gray-600">
            Refugios que pueden recibir mascotas rescatadas ahora
          </p>

          <div className="mt-6">
            <input
              type="text"
              placeholder="Filtrar por ciudad o provincia"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setUrgent(!urgent)}
                className={`px-6 py-3 rounded-full font-bold transition ${
                  urgent
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                🚨 {urgent ? 'URGENCIA ACTIVADA' : 'ACTIVAR URGENCIA'}
              </button>
            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-12 text-gray-600">
            Cargando refugios...
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: {error}
          </div>
        )}

        {!loading && (
          <p className="text-center text-sm text-gray-500 mb-4">
            Mostrando refugios disponibles en este momento
          </p>
        )}

        {/* LISTA */}
        {!loading && filteredShelters.length > 0 && (
          <div className="grid gap-6">
            {filteredShelters.map((shelter) => (
              <ShelterCard
                key={shelter.id}
                shelter={shelter}
                urgent={urgent}
              />
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && filteredShelters.length === 0 && !error && (
          <div className="text-center py-12 bg-white rounded">
            No hay refugios con disponibilidad en este momento
          </div>
        )}

        <p className="text-xs text-center text-gray-400 mt-6">
          Última actualización: hace unos minutos
        </p>

        {/* FOOTER */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-sm text-gray-700">
            <strong>ℹ️ Nota:</strong> Esta información es orientativa.
            Contactá siempre al refugio antes de trasladar una mascota.
          </p>
        </div>
      </div>
    </main>
  );
}
