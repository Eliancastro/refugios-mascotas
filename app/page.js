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
  const [userLocation, setUserLocation] = useState(null);

  const fetchShelters = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('shelters')
        .select(`
  id,
  name,
  city,
  province,
  address,
  phone,
  has_capacity,
  approved,
  lat,
  lng,
  alias,
  cvu,
  mp_link
`)
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

  const getLocation = () => {

  navigator.geolocation.getCurrentPosition(
    (position) => {

      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })

    },
    () => {
      alert('No se pudo obtener tu ubicación')
    }
  )
}

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

      if (
  userLocation &&
  a.lat &&
  a.lng &&
  b.lat &&
  b.lng
) {

  const distA = getDistance(
    userLocation.lat,
    userLocation.lng,
    a.lat,
    a.lng
  )

  const distB = getDistance(
    userLocation.lat,
    userLocation.lng,
    b.lat,
    b.lng
  )

  return distA - distB
}
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

  function getDistance(lat1, lon1, lat2, lon2) {

  const R = 6371

  const dLat =
    (lat2 - lat1) * Math.PI / 180

  const dLon =
    (lon2 - lon1) * Math.PI / 180

  const a =
    Math.sin(dLat / 2) *
    Math.sin(dLat / 2) +

    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *

    Math.sin(dLon / 2) *
    Math.sin(dLon / 2)

  const c =
    2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )

  return R * c
}

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">

        {/* HERO */}
<div className="mb-12 text-center">

  <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
    🐾 Refugios Mascotas
  </h1>

  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
    Encontrá mascotas en adopción, publicá mascotas perdidas,
    ayudá a reunir familias y conectate con refugios de todo el país.
  </p>

  {/* BOTONES */}
  <div className="mt-8 flex flex-wrap justify-center gap-4">

    <a
      href="/mascotas?estado=adopcion"
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-xl font-bold transition"
    >
      🐶 Adoptar
    </a>

    <a
      href="/mascotas?estado=perdida"
      className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-xl font-bold transition"
    >
      🔍 Perdidas
    </a>

    <a
      href="/mascotas?estado=encontrada"
      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-xl font-bold transition"
    >
      🏠 Encontradas
    </a>

    <a
      href="/mascotas/nueva"
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-bold transition"
    >
      ➕ Publicar mascota
    </a>

    <a
  href="/registrar-refugio"
  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-lg transition"
>
  🏠 ¿Sos refugio? Sumate
</a>

  </div>

</div>

{/* REFUGIOS */}
<div className="mb-10">

  <h2 className="text-2xl font-bold text-gray-900 mb-2">
    Refugios disponibles
  </h2>

  <p className="text-gray-600">
    Refugios que actualmente pueden recibir mascotas.
  </p>

</div>

{/* FILTROS */}
<div className="mb-8">

  <input
    type="text"
    placeholder="Buscar por ciudad o provincia..."
    value={filter}
    onChange={(e) => setFilter(e.target.value)}
    className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />

  <div className="mt-4 flex justify-center gap-4 flex-wrap">

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

    <button
  onClick={getLocation}
  className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-full font-bold hover:bg-indigo-700 transition"
>
  📍 Buscar refugios cercanos
</button>

  </div>

  {userLocation && (
  <p className="text-center text-green-700 font-semibold mt-3">
    📍 Mostrando refugios más cercanos
  </p>
)}

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
