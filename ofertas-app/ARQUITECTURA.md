# 🏗️ GUÍA DE ARQUITECTURA - OFERTAS-APP

## Visión General

Ofertas App es una aplicación Full-Stack que permite a los usuarios descubrir ofertas de productos en tiendas cercanas usando geolocalización.

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIO (NAVEGADOR)                      │
└─────────────────────────┬───────────────────────────────────┘
                          │
                    HTTP/HTTPS
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
    ┌───▼────────┐                   ┌─────▼──────┐
    │   FRONTEND │                   │   BACKEND  │
    │  (Angular) │◄──────────────────►│ (Express)  │
    └───────────┘   REST API JSON    └─────┬──────┘
        │                                   │
        │                             ┌─────▼──────┐
        │                             │  MongoDB   │
        │                             │  Database  │
        │                             └────────────┘
        │
    ┌───▼──────────────┐
    │  Servicios        │
    │  • Geolocation    │
    │  • Google Maps    │
    │  • APIs Externas  │
    └───────────────────┘
```

## 📊 Arquitectura por Capas

### Frontend (Angular)

```
src/app/
├── app.component.ts       ◄─── Componente raíz
├── app.routes.ts          ◄─── Enrutamiento
│
├── components/            ◄─── Componentes reutilizables
│   ├── search-bar/        ◄─── UI para búsquedas
│   ├── offer-card/        ◄─── Presentación de ofertas
│   ├── map-view/          ◄─── Visualización de mapa
│   └── store-list/        ◄─── Lista de tiendas
│
├── pages/                 ◄─── Páginas/Vistas
│   ├── home/              ◄─── Página de inicio
│   ├── results/           ◄─── Resultados de búsqueda
│   └── product-detail/    ◄─── Detalle de producto
│
├── services/              ◄─── Lógica de negocio
│   ├── api.service.ts     ◄─── Llamadas HTTP
│   ├── products.service.ts◄─── Lógica de productos
│   └── geolocation.service.ts ◄─── Geolocalización
│
└── models/                ◄─── Interfaces TypeScript
    ├── product.model.ts
    ├── offer.model.ts
    └── store.model.ts
```

### Backend (Node.js + Express)

```
backend/
├── server.js              ◄─── Punto de entrada
│
└── src/
    ├── controllers/       ◄─── Lógica de rutas
    │   ├── productController.js
    │   ├── offerController.js
    │   └── storeController.js
    │
    ├── models/            ◄─── Esquemas MongoDB
    │   ├── Product.js
    │   ├── Offer.js
    │   └── Store.js
    │
    ├── routes/            ◄─── Definición de rutas
    │   ├── products.js
    │   ├── offers.js
    │   └── stores.js
    │
    └── services/          ◄─── Lógica de negocio
        ├── productService.js
        ├── offerService.js
        └── storeService.js
```

## 🔄 Flujo de Datos

### 1. Búsqueda de Productos

```
Usuario
  │
  ▼
SearchBar Component
  │
  ├─► onSearch()
  │     │
  │     ▼
  │   ProductsService
  │     │
  │     ├─► searchProducts(query)
  │     │     │
  │     │     ▼
  │     │   ApiService
  │     │     │
  │     │     ├─► GET /api/products?search=query
  │     │     │
  │     │     ▼
  │     │   Backend
  │     │     │
  │     │     ├─► ProductController
  │     │     │     │
  │     │     │     ├─► getAllProducts()
  │     │     │     │     │
  │     │     │     │     ▼
  │     │     │     │   MongoDB Query
  │     │     │     │     │
  │     │     │     │     ▼
  │     │     │     │   Resultados
  │     │     │     │
  │     │     │     ▼
  │     │     │   JSON Response
  │     │     │
  │     │     ▼
  │     │   Frontend
  │     │
  │     ▼
  │   BehaviorSubject (products$)
  │
  ▼
Results Page
  │
  ├─► *ngFor loop
  │
  ▼
OfferCard Components (mostrados)
```

### 2. Geolocalización

```
Usuario permite permiso
  │
  ▼
GeolocationService
  │
  ├─► getCurrentLocation()
  │     │
  │     ▼
  │   Navigator.geolocation
  │     │
  │     ▼
  │   Coordenadas (lat, lng)
  │     │
  │     ▼
  │   BehaviorSubject (location$)
  │     │
  │     ▼
  │   Componentes subscritos
        │
        ▼
    ProductsService
      │
      ├─► getNearbyProducts(lat, lng, radius)
          │
          ▼
        ApiService
          │
          ├─► GET /api/products?latitude=x&longitude=y&radius=5
              │
              ▼
            Backend calcula distancia (Haversine)
              │
              ▼
            Retorna productos cercanos
```

## 📡 API REST Endpoints

### Products
| Método | Endpoint | Parámetros | Descripción |
|--------|----------|-----------|------------|
| GET | `/api/products` | search, category, minPrice, maxPrice, latitude, longitude, radius | Obtener productos |
| GET | `/api/products/:id` | - | Obtener por ID |
| POST | `/api/products` | body (JSON) | Crear producto |
| PUT | `/api/products/:id` | body (JSON) | Actualizar |
| DELETE | `/api/products/:id` | - | Eliminar |

### Offers
| Método | Endpoint | Parámetros | Descripción |
|--------|----------|-----------|------------|
| GET | `/api/offers` | storeId, isActive | Obtener ofertas |
| GET | `/api/offers/:id` | - | Obtener por ID |
| POST | `/api/offers` | body (JSON) | Crear oferta |
| PUT | `/api/offers/:id` | body (JSON) | Actualizar |
| DELETE | `/api/offers/:id` | - | Eliminar |

### Stores
| Método | Endpoint | Parámetros | Descripción |
|--------|----------|-----------|------------|
| GET | `/api/stores` | city, minRating | Obtener tiendas |
| GET | `/api/stores/:id` | - | Obtener por ID |
| POST | `/api/stores` | body (JSON) | Crear tienda |
| PUT | `/api/stores/:id` | body (JSON) | Actualizar |
| DELETE | `/api/stores/:id` | - | Eliminar |

## 💾 Modelos de Datos

### Product
```typescript
{
  _id: ObjectId
  name: string                    // Nombre del producto
  description: string             // Descripción
  price: number                   // Precio actual
  originalPrice?: number          // Precio original
  discount?: number               // Descuento %
  image: string                   // URL de imagen
  category: string                // Categoría
  storeId: ObjectId              // Referencia a tienda
  storeName: string              // Nombre de tienda
  location: {                    // Ubicación de la tienda
    latitude: number
    longitude: number
  }
  rating?: number                // Calificación
  reviews?: number               // Número de reseñas
  inStock: boolean               // Disponibilidad
  createdAt: Date                // Fecha de creación
  updatedAt: Date                // Fecha de actualización
}
```

### Offer
```typescript
{
  _id: ObjectId
  productId: ObjectId            // Referencia a producto
  storeId: ObjectId              // Referencia a tienda
  discount: number               // Porcentaje de descuento
  originalPrice: number          // Precio original
  finalPrice: number             // Precio final
  startDate: Date                // Fecha de inicio
  endDate: Date                  // Fecha de fin
  description: string            // Descripción de oferta
  isActive: boolean              // Activa?
  createdAt: Date
  updatedAt: Date
}
```

### Store
```typescript
{
  _id: ObjectId
  name: string                   // Nombre
  address: string                // Dirección
  city: string                   // Ciudad
  state: string                  // Estado/Provincia
  zipCode: string                // Código postal
  phone: string                  // Teléfono
  email: string                  // Email
  website?: string               // Sitio web
  location: {                    // Coordenadas
    latitude: number
    longitude: number
  }
  openingHours?: {              // Horarios
    monday: string
    tuesday: string
    // ... etc
  }
  rating?: number                // Calificación
  reviews?: number               // Reseñas
  image?: string                 // Imagen
  createdAt: Date
  updatedAt: Date
}
```

## 🔐 Seguridad (Futuro)

```
Frontend                          Backend
   │                               │
   ├─► Login                       │
   │     │                         │
   │     ▼                         │
   │   Obtener JWT                 │
   │     │                         │
   │     ├─────────────────────────►
   │     │   {credentials}
   │     │                         ├─► Validar
   │     │                         │
   │     ◄─────────────────────────┤
   │     JWT Token                 │
   │
   ├─► Header Authorization
   │   Bearer: token
   │
   ├─────────────────────────────►│
        │                         │
        │                         ├─► Verificar JWT
        │                         │
        │◄─────────────────────────┤
             Datos                │
```

## 📦 Dependencias Principales

### Frontend
- **@angular/core** - Framework
- **@angular/router** - Enrutamiento
- **rxjs** - Programación reactiva
- **typescript** - Tipado

### Backend
- **express** - Web server
- **mongoose** - ORM MongoDB
- **cors** - Control de origen
- **dotenv** - Variables de entorno
- **jsonwebtoken** - Autenticación (futuro)

## 🧪 Patrones de Diseño

### Frontend
- **Standalone Components**: Componentes independientes
- **Services**: Inyección de dependencias
- **Reactive Forms**: RxJS y BehaviorSubject
- **Routing**: Angular Router
- **HttpClient**: Interceptores y Observable

### Backend
- **MVC**: Separación de controladores, modelos, vistas
- **RESTful**: Operaciones CRUD estándar
- **Middleware**: CORS, JSON parsing
- **Error Handling**: Try-catch y respuestas HTTP

## 📈 Escalabilidad

### Mejoras futuras
1. **Autenticación JWT**
2. **Caché con Redis**
3. **Paginación y virtualization**
4. **Microservicios**
5. **Logs centralizados**
6. **Tests automatizados**
7. **CI/CD pipeline**

## 🚀 Deploy

### Frontend
- Build: `ng build --configuration production`
- Deploy a: Vercel, Netlify, AWS S3, Azure Static Web Apps

### Backend
- Deploy a: Heroku, AWS EC2, DigitalOcean, Azure App Service, Railway

## 📚 Referencias

- [Angular Architecture](https://angular.io/guide/architecture)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Design Patterns](https://docs.mongodb.com/manual/applications/data-models/)
- [RESTful API Design](https://restfulapi.net/)
