import "./globals.css";
import Navbar from './components/Navbar'

export const metadata = {
  title: "Refugios de Mascotas",
  description: "Refugios con disponibilidad en Argentina",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
