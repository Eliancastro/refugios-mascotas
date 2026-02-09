-- ============================================
-- TABLAS PARA REFUGIOS DE MASCOTAS
-- ============================================

-- Tabla de Refugios
CREATE TABLE shelters (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  ciudad VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  capacidad_total INT NOT NULL DEFAULT 0,
  capacidad_disponible INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC'::text, NOW()) NOT NULL
);

-- Tabla de Mascotas
CREATE TABLE animals (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  tipo VARCHAR(50) NOT NULL, -- 'perro', 'gato', 'otro'
  raza VARCHAR(100),
  edad_aproximada VARCHAR(50),
  descripcion TEXT,
  shelter_id BIGINT REFERENCES shelters(id) ON DELETE CASCADE,
  estado VARCHAR(50) DEFAULT 'disponible', -- 'disponible', 'adoptado', 'en_evaluacion'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC'::text, NOW()) NOT NULL
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en ambas tablas
ALTER TABLE shelters ENABLE ROW LEVEL SECURITY;
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública para shelters
CREATE POLICY "Lectura pública shelters" ON shelters
  FOR SELECT
  USING (true);

-- Política de lectura pública para animals
CREATE POLICY "Lectura pública animals" ON animals
  FOR SELECT
  USING (true);

-- Denegar INSERT, UPDATE, DELETE en shelters desde frontend
CREATE POLICY "Denegar INSERT shelters" ON shelters
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Denegar UPDATE shelters" ON shelters
  FOR UPDATE
  USING (false);

CREATE POLICY "Denegar DELETE shelters" ON shelters
  FOR DELETE
  USING (false);

-- Denegar INSERT, UPDATE, DELETE en animals desde frontend
CREATE POLICY "Denegar INSERT animals" ON animals
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Denegar UPDATE animals" ON animals
  FOR UPDATE
  USING (false);

CREATE POLICY "Denegar DELETE animals" ON animals
  FOR DELETE
  USING (false);

-- ============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================

CREATE INDEX idx_animals_shelter_id ON animals(shelter_id);
CREATE INDEX idx_animals_estado ON animals(estado);
CREATE INDEX idx_shelters_ciudad ON shelters(ciudad);
