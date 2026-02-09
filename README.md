# 🐾 Refugios de Mascotas - MVP

Una aplicación web simple para que rescatistas encuentren refugios con disponibilidad para recibir mascotas rescatadas en Argentina.

## 📋 Características

✅ **Listado de refugios** - Visualiza refugios con capacidad disponible  
✅ **Información en tiempo real** - Datos sincronizados desde Supabase  
✅ **Interfaz simple** - Diseño limpio y responsive  
✅ **Seguro** - Solo lectura pública, sin ediciones desde frontend  

## 🛠 Tech Stack

- **Frontend**: Next.js 15+ (App Router)
- **Base de datos**: Supabase (PostgreSQL)
- **Estilos**: Tailwind CSS
- **Lenguaje**: JavaScript

## 🚀 Instalación y ejecución

### 1. Clonar o descargar el proyecto

```bash
cd refugios-mascotas
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Supabase

#### 3.1 Crear un proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com)
2. Crear una cuenta (plan gratuito)
3. Crear un nuevo proyecto
4. Esperar a que se cree la base de datos (2-3 minutos)

#### 3.2 Crear las tablas

1. En el dashboard de Supabase, ir a **SQL Editor**
2. Crear una nueva query
3. Copiar el contenido de `sql/schema.sql`
4. Ejecutar la query
5. (Opcional) Copiar el contenido de `sql/example_data.sql` y ejecutar para agregar datos de ejemplo

#### 3.3 Configurar variables de entorno

1. En dashboard de Supabase: **Settings → API**
2. Copiar:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Editar `.env.local` y pegar los valores:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyxxxx...
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

### 5. Build para producción

```bash
npm run build
npm start
```

## 📊 Estructura de carpetas

```
refugios-mascotas/
├── app/
│   ├── layout.js          # Layout principal
│   ├── page.js            # Página de inicio
│   ├── globals.css        # Estilos globales
├── lib/
│   └── supabase.js        # Cliente Supabase
├── sql/
│   ├── schema.sql         # Estructura de tablas + RLS
│   └── example_data.sql   # Datos de ejemplo
├── .env.local             # Variables de entorno
├── package.json           # Dependencias
├── next.config.js         # Configuración Next.js
├── tailwind.config.js     # Configuración Tailwind
└── postcss.config.js      # Configuración PostCSS
```

## 🗄️ Estructura de Base de Datos

### Tabla: `shelters` (Refugios)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT | ID único |
| nombre | VARCHAR(255) | Nombre del refugio |
| ciudad | VARCHAR(100) | Ciudad donde está ubicado |
| telefono | VARCHAR(20) | Teléfono de contacto |
| capacidad_total | INT | Total de mascotas que puede alojar |
| capacidad_disponible | INT | **Lugares disponibles (dato clave)** |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

### Tabla: `animals` (Mascotas)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT | ID único |
| nombre | VARCHAR(255) | Nombre de la mascota |
| tipo | VARCHAR(50) | Tipo: 'perro', 'gato', 'otro' |
| raza | VARCHAR(100) | Raza |
| edad_aproximada | VARCHAR(50) | Edad estimada |
| descripcion | TEXT | Descripción del animal |
| shelter_id | BIGINT | ID del refugio asociado |
| estado | VARCHAR(50) | Estado: 'disponible', 'adoptado', 'en_evaluacion' |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

## 🔒 Seguridad - Row Level Security (RLS)

Todas las tablas tienen RLS activado:

✅ **Permitido**:
- Lectura pública de refugios y mascotas
- La app lee datos en tiempo real

❌ **Bloqueado**:
- INSERT, UPDATE, DELETE desde frontend
- Solo administradores de Supabase pueden modificar datos

Los rescatistas NO pueden:
- Eliminar refugios o mascotas
- Editar información desde la web
- Crear registros fraudulentos

## 🔄 Próximas funcionalidades (fuera del MVP)

Estas características pueden agregarse después:

- Panel de administración (solo para refugios autorizados)
- Buscar mascotas por tipo/raza
- Mapa de refugios
- Notificaciones
- Autenticación
- Carga de fotos

## 📧 Contacto y soporte

Para reportar problemas o sugerencias, contacta al equipo de desarrollo.

---

**Última actualización**: 20 de enero de 2026  
**Versión**: 0.1.0
