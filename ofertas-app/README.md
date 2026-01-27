# Ofertas App - MVP de Digitalización

Una aplicación web full-stack para descubrir ofertas de productos en tiendas cercanas, con búsqueda geolocalizada y gestión de descuentos.

## 📋 Estructura del Proyecto

```
ofertas-app/
├── backend/                    # Node.js + Express
│   ├── src/
│   │   ├── controllers/        # Controladores de rutas
│   │   ├── models/             # Esquemas de base de datos
│   │   ├── routes/             # Definición de rutas API
│   │   └── services/           # Lógica de negocio
│   ├── server.js              # Punto de entrada del servidor
│   └── package.json           # Dependencias del backend
│
├── frontend/                   # Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/     # Componentes reutilizables
│   │   │   ├── pages/          # Páginas principales
│   │   │   ├── services/       # Servicios HTTP
│   │   │   ├── models/         # Interfaces TypeScript
│   │   │   ├── app.routes.ts   # Rutas de la aplicación
│   │   │   └── app.component.ts # Componente raíz
│   │   ├── assets/             # Recursos estáticos
│   │   └── environments/       # Configuraciones de entorno
│   └── angular.json           # Configuración de Angular
│
└── README.md                  # Este archivo
```

## 🚀 Características Principales

### Frontend (Angular)
- **Búsqueda de productos**: Búsqueda por nombre, categoría y precio
- **Vista de mapa**: Visualización de tiendas cercanas
- **Tarjetas de ofertas**: Mostrar productos con descuentos
- **Geolocalización**: Encontrar ofertas cerca de tu ubicación
- **Detalles de producto**: Página completa con información detallada

### Backend (Node.js + Express)
- **API REST**: Endpoints para productos, ofertas y tiendas
- **Base de datos**: MongoDB para almacenamiento
- **Búsqueda geolocalizada**: Encontrar tiendas por ubicación
- **Gestión de ofertas**: Crear, actualizar y listar ofertas

## 📦 Instalación

### Requisitos Previos
- Node.js (v16+)
- npm o yarn
- MongoDB (local o cloud)
- Angular CLI

### Backend

```bash
cd backend
npm install
```

Crear archivo `.env`:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ofertas-app
```

Ejecutar:
```bash
npm run dev  # Modo desarrollo con nodemon
npm start    # Modo producción
```

### Frontend

```bash
cd frontend
npm install
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

## 🏗️ Estructura de Componentes

### Componentes
- **SearchBar**: Barra de búsqueda principal
- **OfferCard**: Tarjeta individual de producto/oferta
- **MapView**: Visualización de mapa de tiendas
- **StoreList**: Lista de tiendas

### Páginas
- **Home**: Página de inicio con búsqueda y mapa
- **Results**: Resultados de búsqueda
- **ProductDetail**: Detalle completo de un producto

## 🔗 API Endpoints

### Productos
- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Ofertas
- `GET /api/offers` - Obtener todas las ofertas
- `GET /api/offers/:id` - Obtener oferta por ID
- `POST /api/offers` - Crear nueva oferta
- `PUT /api/offers/:id` - Actualizar oferta
- `DELETE /api/offers/:id` - Eliminar oferta

### Tiendas
- `GET /api/stores` - Obtener todas las tiendas
- `GET /api/stores/:id` - Obtener tienda por ID
- `POST /api/stores` - Crear nueva tienda
- `PUT /api/stores/:id` - Actualizar tienda
- `DELETE /api/stores/:id` - Eliminar tienda

## 📚 Servicios

### Frontend Services
- **ApiService**: Llamadas HTTP a la API
- **ProductsService**: Lógica de productos
- **GeolocationService**: Manejo de geolocalización

### Backend Services
- **ProductService**: Lógica de negocio de productos
- **OfferService**: Lógica de ofertas
- **StoreService**: Búsqueda geolocalizada

## 🎨 Modelos de Datos

### Product
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category: string;
  storeId: string;
  storeName: string;
  location: { latitude: number; longitude: number };
  rating?: number;
  reviews?: number;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Offer
```typescript
interface Offer {
  id: string;
  productId: string;
  storeId: string;
  discount: number;
  originalPrice: number;
  finalPrice: number;
  startDate: Date;
  endDate: Date;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Store
```typescript
interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  location: { latitude: number; longitude: number };
  openingHours?: { [key: string]: string };
  rating?: number;
  reviews?: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🛠️ Herramientas y Dependencias

### Frontend
- Angular 16+
- TypeScript
- RxJS
- CSS

### Backend
- Express.js
- MongoDB/Mongoose
- CORS
- dotenv
- bcryptjs (para contraseñas)
- jsonwebtoken (para autenticación)

## 📝 Próximos Pasos

- [ ] Implementar autenticación y autorización
- [ ] Agregar sistema de carrito de compras
- [ ] Integrar con Google Maps API
- [ ] Sistema de reseñas y calificaciones
- [ ] Notificaciones en tiempo real
- [ ] Panel de administración
- [ ] Tests unitarios y E2E

## 📄 Licencia

ISC

## 👤 Autor

Tu nombre aquí

## 📧 Contacto

Para preguntas o sugerencias, por favor contacta a...

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
