# 🛒 Comparador de Ofertas - Aplicación Web

> Aplicación web responsive para comparar precios y encontrar las mejores ofertas de productos en tiendas cercanas.

## 📋 Descripción del Proyecto

Esta aplicación ayuda a los usuarios a:
- Buscar productos por nombre o código de barras
- Comparar precios entre diferentes tiendas
- Encontrar tiendas cercanas usando geolocalización
- Visualizar ofertas en un mapa interactivo
- Recibir alertas de precios
- Ver historial de precios

## 🎯 Características Principales

### MVP (Fase 1)
- ✅ Búsqueda de productos por nombre o código de barras
- ✅ Listado de tiendas con precios
- ✅ Filtrado por distancia (tiendas cercanas)
- ✅ Indicador visual de mejor oferta
- ✅ Visualización en mapa interactivo

### Fase 2
- ⏳ Alertas de precios
- ⏳ Historial de precios
- ⏳ Comparación de productos similares
- ⏳ Sistema de reseñas de tiendas

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: Angular 17+
- **UI Components**: Angular Material / PrimeNG
- **Estilos**: Tailwind CSS (opcional)
- **Mapas**: Leaflet / Google Maps Angular
- **Escaneo de códigos**: QuaggaJS

### Backend
- **Framework**: Node.js + Express
- **Alternativa**: NestJS (TypeScript)
- **ORM**: TypeORM (PostgreSQL) / Mongoose (MongoDB)

### Base de Datos
- **Opción 1**: MongoDB Atlas (NoSQL)
- **Opción 2**: PostgreSQL (SQL)

### APIs Externas
- **Precios**: Open Food Facts API, Amazon Product API
- **Geolocalización**: Google Maps API / OpenStreetMap
- **Códigos de barras**: Barcode Lookup API
- **Comparadores**: Idealo API, Kelkoo

## 📁 Estructura del Proyecto

```
ofertas-app/
├── frontend/                    # Angular Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── search-bar/
│   │   │   │   ├── offer-card/
│   │   │   │   ├── map-view/
│   │   │   │   └── store-list/
│   │   │   ├── pages/
│   │   │   │   ├── home/
│   │   │   │   ├── results/
│   │   │   │   └── product-detail/
│   │   │   ├── services/
│   │   │   │   ├── products.service.ts
│   │   │   │   ├── geolocation.service.ts
│   │   │   │   └── api.service.ts
│   │   │   ├── models/
│   │   │   │   ├── product.model.ts
│   │   │   │   ├── offer.model.ts
│   │   │   │   └── store.model.ts
│   │   │   ├── app.routes.ts
│   │   │   └── app.component.ts
│   │   ├── assets/
│   │   └── environments/
│   └── angular.json
│
├── backend/                     # Node.js + Express API
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── products.controller.js
│   │   │   ├── stores.controller.js
│   │   │   └── offers.controller.js
│   │   ├── models/
│   │   │   ├── Product.js
│   │   │   ├── Store.js
│   │   │   └── Offer.js
│   │   ├── routes/
│   │   │   ├── products.routes.js
│   │   │   ├── stores.routes.js
│   │   │   └── offers.routes.js
│   │   ├── services/
│   │   │   ├── externalAPI.service.js
│   │   │   └── geolocation.service.js
│   │   ├── middleware/
│   │   │   ├── error.middleware.js
│   │   │   └── validation.middleware.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── docs/                        # Documentación
│   ├── API.md
│   ├── SETUP.md
│   └── DEPLOYMENT.md
│
└── README.md
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ y npm
- Angular CLI: `npm install -g @angular/cli`
- MongoDB Atlas (cuenta gratuita) o PostgreSQL
- Cuentas en APIs externas (Google Maps, etc.)

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/ofertas-app.git
cd ofertas-app
```

### 2. Configurar el Backend

```bash
cd backend
npm install

# Crear archivo .env
cp .env.example .env
# Editar .env con tus credenciales
```

**Archivo .env:**
```env
PORT=3000
DATABASE_URL=mongodb://localhost:27017/ofertas
GOOGLE_MAPS_API_KEY=tu_api_key
BARCODE_API_KEY=tu_api_key
NODE_ENV=development
```

### 3. Configurar el Frontend

```bash
cd frontend
npm install

# Si usas Angular Material
ng add @angular/material

# Si usas Leaflet para mapas
npm install leaflet @asymmetrik/ngx-leaflet
npm install @types/leaflet --save-dev
```

### 4. Ejecutar la Aplicación

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
ng serve
```

Accede a: `http://localhost:4200`

## 📡 API Endpoints

### Productos
- `GET /api/products/search?q=leche` - Buscar productos
- `GET /api/products/:id` - Detalles del producto
- `GET /api/products/:id/offers` - Ofertas del producto

### Tiendas
- `GET /api/stores/nearby?lat=X&lng=Y&radius=5` - Tiendas cercanas
- `GET /api/stores/:id` - Detalles de tienda

### Ofertas
- `GET /api/offers/best?productId=X` - Mejores ofertas
- `GET /api/offers/trending` - Ofertas destacadas

## 🎨 Diseño Responsive

### Breakpoints
- **Móvil**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Componentes Adaptables
- Barra de búsqueda: Full width en móvil, centrada en desktop
- Grid de ofertas: 1 columna (móvil), 2-3 columnas (desktop)
- Mapa: Toggle en móvil, lateral en desktop

## 🧪 Testing

```bash
# Frontend
cd frontend
ng test

# Backend
cd backend
npm test
```

## 📦 Despliegue

### Frontend (Vercel/Netlify)
```bash
cd frontend
ng build --configuration production
```

### Backend (Railway/Render)
```bash
cd backend
npm run build
npm start
```

## 🔑 Variables de Entorno

### Backend (.env)
```env
PORT=3000
DATABASE_URL=tu_mongodb_url
GOOGLE_MAPS_API_KEY=tu_key
BARCODE_API_KEY=tu_key
OPEN_FOOD_FACTS_API=https://world.openfoodfacts.org
JWT_SECRET=tu_secreto_jwt
NODE_ENV=production
```

### Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  googleMapsKey: 'tu_key'
};
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Roadmap

- [x] Configuración inicial del proyecto
- [x] Diseño de la arquitectura
- [ ] Implementación del MVP
- [ ] Integración con APIs externas
- [ ] Sistema de autenticación
- [ ] Panel de administración
- [ ] Aplicación móvil nativa

## 📄 Licencia

MIT License - ver archivo LICENSE para más detalles

## 👥 Autores

Tu Nombre - [tu@email.com](mailto:tu@email.com)

## 🙏 Agradecimientos

- Open Food Facts por su API gratuita
- Comunidad de Angular
- Todos los contribuidores

---

**¿Necesitas ayuda?** Abre un issue en GitHub o contacta al equipo de desarrollo.
