-- ============================================
-- DATOS DE EJEMPLO PARA REFUGIOS
-- ============================================

-- Inserts de refugios de ejemplo
INSERT INTO shelters (nombre, ciudad, telefono, capacidad_total, capacidad_disponible)
VALUES
  ('Refugio Patitas Felices', 'Buenos Aires', '(011) 4555-1234', 50, 12),
  ('Hogar Seguro para Perros', 'Córdoba', '(0351) 456-7890', 30, 8),
  ('Gatos Rescatados La Plata', 'La Plata', '(0221) 555-4321', 25, 5),
  ('Paws & Love', 'Rosario', '(0341) 789-1234', 40, 15),
  ('Refugio Animalista Mendoza', 'Mendoza', '(0261) 654-3210', 35, 20),
  ('Centro de Rescate Salta', 'Salta', '(0387) 421-5678', 20, 7),
  ('Protectora de Mascotas Mar del Plata', 'Mar del Plata', '(0223) 789-5432', 28, 3);

-- Inserts de mascotas de ejemplo
INSERT INTO animals (nombre, tipo, raza, edad_aproximada, descripcion, shelter_id, estado)
VALUES
  -- Mascotas en Refugio Patitas Felices (id=1)
  ('Rex', 'perro', 'Labrador', '2 años', 'Perro cariñoso y activo, necesita familia con espacio', 1, 'disponible'),
  ('Luna', 'gato', 'Siamés', '1 año', 'Gata juguetona y dócil, perfecta para familias', 1, 'disponible'),
  
  -- Mascotas en Hogar Seguro para Perros (id=2)
  ('Max', 'perro', 'Pastor Alemán', '3 años', 'Perro entrenado, excelente para adopción', 2, 'disponible'),
  ('Bella', 'perro', 'Mestizo', '2 años', 'Perrita tranquila y amorosa', 2, 'disponible'),
  
  -- Mascotas en Gatos Rescatados La Plata (id=3)
  ('Mittens', 'gato', 'Persa', '4 años', 'Gata tranquila, ideal para personas mayores', 3, 'disponible'),
  ('Simba', 'gato', 'Mestizo', '6 meses', 'Gatito juguetón en búsqueda de hogar', 3, 'disponible'),
  
  -- Mascotas en Paws & Love (id=4)
  ('Rocky', 'perro', 'Bulldog', '4 años', 'Perro pequeño y cariñoso, sin necesidades especiales', 4, 'disponible'),
  ('Whiskers', 'gato', 'Gato Callejero', '1 año', 'Gato rescatado, necesita ambiente tranquilo', 4, 'disponible');
