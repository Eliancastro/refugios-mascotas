export default function ShelterCard({ shelter, urgent }) {
  // ===== ESTADO VISUAL =====
  let statusLabel = '';
  let statusColor = '';

  if (urgent && shelter.has_capacity) {
    statusLabel = '🚨 DISPONIBLE AHORA';
    statusColor = 'bg-red-600';
  } else if (shelter.has_capacity) {
    statusLabel = '🟢 DISPONIBLE';
    statusColor = 'bg-green-600';
  } else {
    statusLabel = '🔴 SIN LUGAR';
    statusColor = 'bg-gray-400';
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
      <span
        className={`inline-block mb-3 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide ${statusColor}`}
      >
        {statusLabel}
      </span>

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

      {/* BOTONES */}
      <div className={`flex gap-2 mt-4 ${urgent ? 'flex-col' : 'flex-row'}`}>
        <a
          href={`tel:${shelter.phone}`}
          className={`flex-1 text-center rounded-xl font-bold transition
            ${
              urgent
                ? 'bg-blue-600 text-white py-4 text-lg'
                : 'bg-blue-600 text-white py-2'
            }
          `}
        >
          📞 Llamar
        </a>

        <a
          href={`https://wa.me/${shelter.phone}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex-1 text-center rounded-xl font-bold transition
            ${
              urgent
                ? 'bg-green-600 text-white py-4 text-lg'
                : 'bg-green-600 text-white py-2'
            }
          `}
        >
          💬 WhatsApp
        </a>
      </div>

      <p className="text-sm text-gray-400 mt-2">
        Tel: {shelter.phone}
      </p>
    </div>
  );
}