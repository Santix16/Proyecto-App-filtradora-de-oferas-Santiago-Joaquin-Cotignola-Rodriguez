# Guía de Inicio Rápido - Ofertas App

## 🚀 Arranque Rápido

### 1. Backend

```bash
# Ir al directorio del backend
cd backend

# Instalar dependencias
npm install

# Crear archivo .env (copiar de .env.example)
copy .env.example .env

# Actualizar MONGODB_URI en .env si es necesario
# Por defecto usa: mongodb://localhost:27017/ofertas-app

# Ejecutar el servidor en desarrollo
npm run dev

# El servidor correrá en http://localhost:3000
```

### 2. Frontend

```bash
# En otra terminal, ir al directorio del frontend
cd frontend

# Instalar dependencias
npm install

# Ejecutar el servidor de desarrollo de Angular
ng serve

# O usar npm
npm start

# La aplicación estará en http://localhost:4200
```

## 📁 Archivos Generados

### Backend
- ✅ `/backend/server.js` - Servidor Express principal
- ✅ `/backend/package.json` - Dependencias del backend
- ✅ `/backend/src/models/` - Modelos MongoDB (Product, Offer, Store)
- ✅ `/backend/src/controllers/` - Controladores de rutas
- ✅ `/backend/src/routes/` - Definición de rutas API
- ✅ `/backend/src/services/` - Lógica de negocio

### Frontend
- ✅ `/frontend/src/app/models/` - Interfaces TypeScript
- ✅ `/frontend/src/app/services/` - Servicios HTTP y lógica
- ✅ `/frontend/src/app/components/` - Componentes reutilizables
- ✅ `/frontend/src/app/pages/` - Páginas principales
- ✅ `/frontend/src/app/app.routes.ts` - Rutas de Angular

## 🔧 Variables de Entorno (Backend)

Crear `backend/.env` con:
```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ofertas-app
JWT_SECRET=tu_clave_secreta
JWT_EXPIRATION=7d
```

## 📊 Endpoints Disponibles

```
Productos:      GET/POST /api/products
Ofertas:        GET/POST /api/offers
Tiendas:        GET/POST /api/stores
Health Check:   GET /api/health
```

## 🎯 Próximos Pasos

1. **Instalar MongoDB** (si no lo tienes):
   - Descargarlo desde mongodb.com
   - O usar MongoDB Atlas (cloud)

2. **Poblar Base de Datos**:
   - Crear script de seed con datos de ejemplo
   - Insertar tiendas, productos y ofertas

3. **Integrar Google Maps**:
   - Obtener API key
   - Implementar en MapViewComponent

4. **Agregar Autenticación**:
   - Implementar JWT en backend
   - Crear guards en frontend

5. **Tests**:
   - Tests unitarios con Jest (backend)
   - Tests E2E con Jasmine (frontend)

## 🐛 Solución de Problemas

### Puerto ya en uso
```bash
# Cambiar puerto en .env (backend) o mediante ng serve --port 4300 (frontend)
```

### MongoDB no conecta
```bash
# Verificar que MongoDB está corriendo
# En Windows: services.msc → buscar MongoDB
# En Mac/Linux: brew services start mongodb-community
```

### Problemas de CORS
- Backend permite CORS desde http://localhost:4200
- Modificar si es necesario en server.js

## 📚 Recursos Útiles

- [Angular Documentation](https://angular.io)
- [Express.js Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
