import { supabase } from '../../lib/supabase'
export default function ShelterCard({ shelter, urgent }) {

  // ===== ESTADO VISUAL =====
  let statusLabel = ''
  let statusColor = ''

  if (urgent && shelter.has_capacity) {
    statusLabel = '🚨 DISPONIBLE AHORA'
    statusColor = 'bg-red-600'
  } else if (shelter.has_capacity) {
    statusLabel = '🟢 DISPONIBLE'
    statusColor = 'bg-green-600'
  } else {
    statusLabel = '🔴 SIN LUGAR'
    statusColor = 'bg-gray-400'
  }

  async function reportarRefugio() {

  const motivo = prompt(
    '¿Por qué querés reportar este refugio?'
  )

  if (!motivo) return

  const { error } = await supabase
    .from('reports')
    .insert({
      target_type: 'shelter',
      target_id: shelter.id,
      reason: motivo
    })

  if (error) {
    alert('Error al enviar reporte')
  } else {
    alert('Reporte enviado correctamente')
  }
}

  return (
    <div
      className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-5 border
        ${
          urgent && shelter.has_capacity
            ? 'border-red-500 animate-pulse'
            : 'border-gray-200'
        }
      `}
    >

      {/* ESTADO */}
      <div className="flex items-center justify-between mb-3">

        <span
          className={`inline-block text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide ${statusColor}`}
        >
          {statusLabel}
        </span>

        {shelter.verified && (
          <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold">
            ✅ Verificado
          </span>
        )}

      </div>

      {/* NOMBRE */}
      <h2 className="text-xl font-bold text-gray-900">
        {shelter.name}
      </h2>

      {/* UBICACION */}
      <p className="text-gray-500 text-sm mt-1">
        📍 {shelter.city}, {shelter.province}
      </p>

      {/* DIRECCION */}
      {shelter.address && (
        <p className="text-gray-700 mt-2">
          📌{' '}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${shelter.address}, ${shelter.city}, ${shelter.province}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-semibold hover:underline"
          >
            {shelter.address}
          </a>
        </p>
      )}

      <p className="text-sm text-gray-400 mt-3">
        Tel: {shelter.phone}
      </p>

      <div className="mt-5 flex flex-col gap-3">

  {/* CONTACTO */}
  <div className="flex gap-3 flex-wrap">

    <a
      href={`tel:${shelter.phone}`}
      className="flex-1 min-w-40 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-center transition"
    >
      📞 Llamar
    </a>

    <a
      href={`https://wa.me/${shelter.phone}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1 min-w-40 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-center transition"
    >
      💬 WhatsApp
    </a>

  </div>

  {/* DONACIONES */}
  {(shelter.alias || shelter.cvu || shelter.mp_link) && (
    <div className="bg-gray-50 border rounded-2xl p-4">

      <p className="font-bold text-gray-800 mb-3">
        ❤️ Ayudar al refugio
      </p>

      {shelter.alias && (
        <div className="mb-2">
          <p className="text-xs text-gray-500">
            Alias
          </p>

          <p className="font-mono text-sm break-all">
            {shelter.alias}
          </p>
        </div>
      )}

      {shelter.cvu && (
        <div className="mb-2">
          <p className="text-xs text-gray-500">
            CVU
          </p>

          <p className="font-mono text-sm break-all">
            {shelter.cvu}
          </p>
        </div>
      )}

      {shelter.mp_link && (
        <a
          href={shelter.mp_link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-xl font-bold text-center transition"
        >
          💳 Donar con MercadoPago
        </a>
      )}

    </div>
  )}

  {/* REPORTAR */}
  <button className="text-red-500 text-sm font-bold hover:underline text-left">
    🚨 Reportar refugio
  </button>

</div>

    </div>
  )
}
