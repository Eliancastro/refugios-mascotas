export function obtenerFavoritos() {
  if (typeof window === 'undefined') return []

  const favoritos = localStorage.getItem('favoritos')

  return favoritos ? JSON.parse(favoritos) : []
}

export function esFavorito(id) {
  const favoritos = obtenerFavoritos()

  return favoritos.includes(id)
}

export function toggleFavorito(id) {
  const favoritos = obtenerFavoritos()

  let nuevosFavoritos

  if (favoritos.includes(id)) {
    nuevosFavoritos = favoritos.filter((fav) => fav !== id)
  } else {
    nuevosFavoritos = [...favoritos, id]
  }

  localStorage.setItem('favoritos', JSON.stringify(nuevosFavoritos))

  return nuevosFavoritos
}
