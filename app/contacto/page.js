export default function ContactoPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">
        <h1 className="text-4xl font-bold mb-6">📬 Contacto</h1>

        <p className="mb-4">
          Si tenés consultas, sugerencias o querés sumar tu refugio a la
          plataforma, podés contactarnos.
        </p>

        <div className="space-y-4 mt-6">
          <div>
            <h2 className="font-bold">📧 Email</h2>
            <p>refugiosdemascotas2026@gmail.com</p>
          </div>

          <div>
            <h2 className="font-bold">🐾 Refugios Mascotas</h2>
            <p>
              Plataforma para la difusión de mascotas en adopción, perdidas y
              encontradas.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
