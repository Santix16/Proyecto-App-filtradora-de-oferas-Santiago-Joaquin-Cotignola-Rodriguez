# 📘 GUÍA DE CONFIGURACIÓN DEL PROYECTO
## Comparador de Ofertas - Setup Completo

Esta guía te llevará paso a paso desde cero hasta tener la aplicación funcionando.

---

## 📋 ÍNDICE

1. [Prerrequisitos](#prerrequisitos)
2. [Configuración del Entorno](#configuración-del-entorno)
3. [Crear Proyecto Angular](#crear-proyecto-angular)
4. [Crear Backend Node.js](#crear-backend-nodejs)
5. [Configurar Base de Datos](#configurar-base-de-datos)
6. [Integrar APIs Externas](#integrar-apis-externas)
7. [Variables de Entorno](#variables-de-entorno)
8. [Ejecutar en Desarrollo](#ejecutar-en-desarrollo)
9. [Troubleshooting](#troubleshooting)

---

## 1. PRERREQUISITOS

### Software Necesario

```bash
# Verificar instalaciones
node --version    # Debe ser v18.0.0 o superior
npm --version     # Debe ser v9.0.0 o superior
git --version     # Cualquier versión reciente
```

### Instalar Node.js
- Descargar desde: https://nodejs.org/
- Recomendado: Versión LTS (Long Term Support)

### Instalar Angular CLI
```bash
npm install -g @angular/cli
ng version  # Verificar instalación
```

### Editor de Código
- **Visual Studio Code** (recomendado)
- Extensiones recomendadas:
  - Angular Language Service
  - ESLint
  - Prettier
  - GitLens
  - GitHub Copilot (si tienes suscripción)

### Cuentas Necesarias

1. **MongoDB Atlas** (Base de datos gratuita)
   - Registrarse en: https://www.mongodb.com/cloud/atlas
   - Crear cluster gratuito (M0)

2. **Google Cloud Platform** (Para Maps API)
   - https://console.cloud.google.com/
   - Activar "Maps JavaScript API"
   - Crear API Key

3. **Barcode Lookup** (Opcional)
   - https://www.barcodelookup.com/
   - Obtener API key gratuita

---

## 2. CONFIGURACIÓN DEL ENTORNO

### Crear directorio del proyecto
```bash
mkdir ofertas-app
cd ofertas-app
```

### Inicializar Git
```bash
git init
echo "node_modules/
.env
dist/
.angular/
*.log" > .gitignore
```

---

## 3. CREAR PROYECTO ANGULAR

### Paso 1: Generar proyecto
```bash
ng new ofertas-frontend --routing --style=scss --standalone
cd ofertas-frontend
```

Responde:
- ¿Habilitar Server-Side Rendering? → **No**
- ¿Habilitar Static Site Generation? → **No**

### Paso 2: Instalar Angular Material
```bash
ng add @angular/material
```

Selecciona:
- Theme: **Indigo/Pink** (o tu preferencia)
- Typography: **Yes**
- Animations: **Yes**

### Paso 3: Instalar dependencias adicionales
```bash
# Mapas con Leaflet
npm install leaflet @asymmetrik/ngx-leaflet
npm install --save-dev @types/leaflet

# HTTP y Forms
npm install @angular/common @angular/forms

# Escáner de códigos
npm install quagga

# Utilidades
npm install date-fns
```

### Paso 4: Configurar Tailwind CSS (Opcional)
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

Editar `tailwind.config.js`:
```javascript
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Editar `src/styles.scss`:
```scss
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Paso 5: Crear estructura de carpetas
```bash
cd src/app

# Crear directorios
mkdir components pages services models guards interceptors

# Crear subdirectorios de components
cd components
mkdir search-bar offer-card map-view store-list barcode-scanner
cd ../pages
mkdir home results product-detail
cd ../..
```

---

## 4. CREAR BACKEND NODE.JS

### Paso 1: Crear proyecto backend
```bash
# Desde la raíz de ofertas-app
mkdir backend
cd backend
npm init -y
```

### Paso 2: Instalar dependencias
```bash
# Framework y middlewares
npm install express cors dotenv

# Base de datos
npm install mongoose

# Validación
npm install express-validator

# HTTP requests
npm install axios

# Autenticación (para fase 2)
npm install jsonwebtoken bcryptjs

# Utilidades
npm install morgan helmet compression

# Desarrollo
npm install --save-dev nodemon
```

### Paso 3: Configurar package.json
Editar `package.json`:
```json
{
  "name": "ofertas-backend",
  "version": "1.0.0",
  "description": "API para comparador de ofertas",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "type": "module",
  "keywords": ["api", "ofertas", "comparador"],
  "author": "Tu Nombre",
  "license": "MIT"
}
```

### Paso 4: Crear estructura de carpetas
```bash
mkdir -p src/{config,controllers,models,routes,services,middleware,utils}
touch src/server.js
touch .env
touch .env.example
```

### Paso 5: Crear servidor básico

`src/server.js`:
```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Routes
app.use('/api/products', (await import('./routes/products.routes.js')).default);
app.use('/api/stores', (await import('./routes/stores.routes.js')).default);
app.use('/api/offers', (await import('./routes/offers.routes.js')).default);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

---

## 5. CONFIGURAR BASE DE DATOS

### MongoDB Atlas

1. **Crear cuenta y cluster**
   - Ir a https://www.mongodb.com/cloud/atlas
   - Crear cuenta gratuita
   - Crear nuevo cluster (M0 - Free)

2. **Configurar acceso**
   - Database Access → Add User
   - Username: `admin`
   - Password: Generar contraseña segura (guardarla)
   - Network Access → Add IP Address → Allow from Anywhere (0.0.0.0/0)

3. **Obtener connection string**
   - Cluster → Connect → Connect your application
   - Copiar connection string
   - Reemplazar `<password>` con tu contraseña

### Configurar conexión

`backend/src/config/database.js`:
```javascript
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};
```

Actualizar `server.js`:
```javascript
import { connectDB } from './config/database.js';

// Antes de app.listen()
await connectDB();
```

---

## 6. INTEGRAR APIs EXTERNAS

### Google Maps API

1. **Crear proyecto en Google Cloud**
   - https://console.cloud.google.com/
   - Nuevo Proyecto → "Ofertas App"

2. **Habilitar APIs**
   - API Library → Buscar "Maps JavaScript API" → Habilitar
   - Buscar "Geocoding API" → Habilitar
   - Buscar "Places API" → Habilitar

3. **Crear API Key**
   - Credentials → Create Credentials → API Key
   - Copiar la key
   - Opcional: Restringir por dominio/IP

### Open Food Facts (Gratuita)

No requiere API key, pero es bueno registrarse:
- https://world.openfoodfacts.org/

Endpoint base: `https://world.openfoodfacts.org/api/v2/`

### Barcode Lookup (Opcional)

1. Registrarse en https://www.barcodelookup.com/
2. Obtener API key gratuita (100 requests/día)

---

## 7. VARIABLES DE ENTORNO

### Backend `.env`
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/ofertas?retryWrites=true&w=majority

# APIs
GOOGLE_MAPS_API_KEY=AIzaSy...
BARCODE_API_KEY=tu_api_key_aqui

# JWT (para autenticación futura)
JWT_SECRET=tu_secreto_super_seguro_aqui
JWT_EXPIRE=7d

# External APIs
OPEN_FOOD_FACTS_API=https://world.openfoodfacts.org/api/v2
```

### Frontend `src/environments/environment.development.ts`
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  googleMapsKey: 'AIzaSy...',
  enableDebug: true
};
```

### Frontend `src/environments/environment.ts`
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tu-api-produccion.com/api',
  googleMapsKey: 'AIzaSy...',
  enableDebug: false
};
```

---

## 8. EJECUTAR EN DESARROLLO

### Terminal 1: Backend
```bash
cd backend
npm run dev

# Deberías ver:
# 🚀 Server running on http://localhost:3000
# ✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
```

### Terminal 2: Frontend
```bash
cd ofertas-frontend
ng serve

# Deberías ver:
# ✔ Browser application bundle generation complete.
# ** Angular Live Development Server is listening on localhost:4200 **
```

### Verificar
- Frontend: http://localhost:4200
- Backend: http://localhost:3000/health

---

## 9. TROUBLESHOOTING

### Error: Cannot find module
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: Port already in use
```bash
# Cambiar puerto en .env (backend)
PORT=3001

# O matar proceso en puerto 3000
# Linux/Mac:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Error: MongoDB connection failed
- Verificar que IP está permitida en MongoDB Atlas
- Verificar usuario y contraseña en DATABASE_URL
- Verificar que el cluster está activo

### Error: CORS
Verificar en `backend/src/server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
```

### Angular CLI no encontrado
```bash
npm install -g @angular/cli
# O usar npx:
npx ng serve
```

---

## ✅ CHECKLIST FINAL

Antes de empezar a desarrollar, verifica:

- [ ] Node.js y npm instalados
- [ ] Angular CLI instalado
- [ ] Proyecto Angular creado
- [ ] Backend Node.js configurado
- [ ] MongoDB Atlas configurado
- [ ] Variables de entorno configuradas
- [ ] Backend corriendo sin errores
- [ ] Frontend corriendo sin errores
- [ ] Conexión a base de datos exitosa
- [ ] Google Maps API key configurada

---

## 🎯 PRÓXIMOS PASOS

Ahora que tienes todo configurado, puedes:

1. Usar los prompts de Copilot del archivo `COPILOT_PROMPTS.txt`
2. Comenzar a desarrollar componentes con los prompts 6-10
3. Implementar el backend con los prompts 11-13
4. Integrar APIs externas con los prompts 14-16

¡Éxito con tu proyecto! 🚀
