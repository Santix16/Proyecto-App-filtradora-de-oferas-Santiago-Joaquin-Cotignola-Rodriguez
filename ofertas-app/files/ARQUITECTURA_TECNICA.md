# 🏗️ ARQUITECTURA TÉCNICA
## Comparador de Ofertas - Documentación de Arquitectura

---

## 📊 VISIÓN GENERAL

### Descripción del Sistema
Aplicación web responsive para comparar precios de productos en tiendas físicas cercanas, permitiendo a los usuarios encontrar las mejores ofertas basándose en su ubicación geográfica.

### Objetivos Técnicos
- **Performance**: Carga inicial < 3 segundos, búsquedas < 500ms
- **Escalabilidad**: Soportar 10,000 usuarios concurrentes
- **Disponibilidad**: 99.5% uptime
- **Experiencia**: Mobile-first, PWA-ready

---

## 🔧 STACK TECNOLÓGICO

### Frontend
| Componente | Tecnología | Versión | Propósito |
|------------|-----------|---------|-----------|
| Framework | Angular | 17+ | SPA framework |
| UI Library | Angular Material | 17+ | Componentes UI |
| Estilos | Tailwind CSS | 3.4+ | Utility-first CSS |
| Mapas | Leaflet + ngx-leaflet | 1.9+ | Mapas interactivos |
| Gráficos | Chart.js | 4.0+ | Visualización de datos |
| State | RxJS + Services | 7.8+ | Gestión de estado |
| HTTP | HttpClient | 17+ | Comunicación API |

### Backend
| Componente | Tecnología | Versión | Propósito |
|------------|-----------|---------|-----------|
| Runtime | Node.js | 18+ | Entorno de ejecución |
| Framework | Express | 4.18+ | API REST |
| Base de Datos | MongoDB | 6.0+ | Almacenamiento NoSQL |
| ODM | Mongoose | 8.0+ | Modelado de datos |
| Validación | express-validator | 7.0+ | Validación de requests |
| Auth | JWT + bcrypt | - | Autenticación |

### DevOps & Tools
| Componente | Tecnología | Propósito |
|------------|-----------|-----------|
| Version Control | Git + GitHub | Control de versiones |
| CI/CD | GitHub Actions | Automatización |
| Hosting Frontend | Vercel/Netlify | Deploy estáticos |
| Hosting Backend | Railway/Render | Deploy API |
| Database | MongoDB Atlas | BaaS (Backend as a Service) |
| Cache | Redis | Cache en memoria |
| Monitoring | Sentry | Error tracking |

---

## 🏛️ ARQUITECTURA DE ALTO NIVEL

```
┌─────────────────────────────────────────────────────────┐
│                     USUARIO FINAL                        │
│                  (Browser / Mobile Web)                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  FRONTEND (Angular)                      │
│  ┌─────────┬─────────┬─────────┬──────────┬──────────┐ │
│  │  Home   │ Search  │ Results │ Product  │   Map    │ │
│  │  Page   │   Bar   │  Grid   │  Detail  │   View   │ │
│  └─────────┴─────────┴─────────┴──────────┴──────────┘ │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Services & State                     │  │
│  │  Products | Geolocation | Auth | Cache | API     │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS / REST API
                     ▼
┌─────────────────────────────────────────────────────────┐
│               API GATEWAY / BACKEND                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Middleware Layer                     │  │
│  │  CORS | Auth | Rate Limit | Validation | Logging │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌─────────┬─────────┬─────────┬──────────┐           │
│  │Products │ Stores  │ Offers  │   Auth   │           │
│  │ Routes  │ Routes  │ Routes  │  Routes  │           │
│  └─────────┴─────────┴─────────┴──────────┘           │
│  ┌──────────────────────────────────────────────────┐  │
│  │             Business Logic Layer                  │  │
│  │       Controllers | Services | Helpers           │  │
│  └──────────────────────────────────────────────────┘  │
└────────┬────────────────┬────────────────┬─────────────┘
         │                │                │
         ▼                ▼                ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────────┐
│   MongoDB   │  │    Redis    │  │  External APIs  │
│  (Primary)  │  │   (Cache)   │  │  - Google Maps  │
│             │  │             │  │  - Food Facts   │
│  Products   │  │  Sessions   │  │  - Barcode API  │
│  Stores     │  │  Searches   │  └─────────────────┘
│  Offers     │  │  Prices     │
│  Users      │  └─────────────┘
└─────────────┘
```

---

## 📦 ARQUITECTURA FRONTEND (Angular)

### Estructura de Carpetas
```
src/
├── app/
│   ├── components/          # Componentes reutilizables
│   │   ├── search-bar/
│   │   ├── offer-card/
│   │   ├── map-view/
│   │   ├── store-list/
│   │   └── barcode-scanner/
│   │
│   ├── pages/               # Páginas/Rutas principales
│   │   ├── home/
│   │   ├── results/
│   │   └── product-detail/
│   │
│   ├── services/            # Servicios (lógica de negocio)
│   │   ├── api.service.ts
│   │   ├── products.service.ts
│   │   ├── geolocation.service.ts
│   │   ├── auth.service.ts
│   │   └── cache.service.ts
│   │
│   ├── models/              # Interfaces y tipos
│   │   ├── product.model.ts
│   │   ├── offer.model.ts
│   │   └── store.model.ts
│   │
│   ├── guards/              # Route guards
│   │   └── auth.guard.ts
│   │
│   ├── interceptors/        # HTTP interceptors
│   │   ├── auth.interceptor.ts
│   │   └── error.interceptor.ts
│   │
│   ├── pipes/               # Custom pipes
│   │   ├── distance.pipe.ts
│   │   └── currency.pipe.ts
│   │
│   ├── app.routes.ts        # Configuración de rutas
│   └── app.component.ts     # Componente raíz
│
├── assets/                  # Recursos estáticos
├── environments/            # Configuración por entorno
└── styles.scss              # Estilos globales
```

### Flujo de Datos (Unidirectional Data Flow)

```
User Action (Click/Input)
        ↓
   Component
        ↓
   Service (API Call)
        ↓
   HTTP Request
        ↓
   Backend API
        ↓
   HTTP Response
        ↓
   Service (Transform Data)
        ↓
   Observable/Signal
        ↓
   Component (Update View)
        ↓
   Template Render
```

### Patrón de Servicios

```typescript
// Servicio centralizado para una entidad
@Injectable({ providedIn: 'root' })
export class ProductsService {
  private apiUrl = environment.apiUrl;
  private cache = new Map<string, Observable<any>>();

  constructor(
    private http: HttpClient,
    private cacheService: CacheService
  ) {}

  // Métodos públicos con caché y manejo de errores
  searchProducts(query: string): Observable<Product[]> {
    const cacheKey = `search:${query}`;
    
    // Verificar caché primero
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const request$ = this.http.get<Product[]>(
      `${this.apiUrl}/products/search`,
      { params: { q: query } }
    ).pipe(
      catchError(this.handleError),
      shareReplay(1) // Compartir resultado entre suscriptores
    );

    this.cache.set(cacheKey, request$);
    return request$;
  }

  private handleError(error: HttpErrorResponse) {
    // Lógica centralizada de manejo de errores
    console.error('Error en API:', error);
    return throwError(() => new Error('Error al buscar productos'));
  }
}
```

---

## 🗄️ ARQUITECTURA BACKEND (Node.js + Express)

### Estructura de Carpetas
```
backend/
├── src/
│   ├── config/              # Configuraciones
│   │   ├── database.js
│   │   └── environment.js
│   │
│   ├── models/              # Esquemas de Mongoose
│   │   ├── Product.js
│   │   ├── Store.js
│   │   ├── Offer.js
│   │   └── User.js
│   │
│   ├── controllers/         # Lógica de negocio
│   │   ├── products.controller.js
│   │   ├── stores.controller.js
│   │   └── offers.controller.js
│   │
│   ├── routes/              # Definición de endpoints
│   │   ├── products.routes.js
│   │   ├── stores.routes.js
│   │   └── offers.routes.js
│   │
│   ├── services/            # Servicios externos
│   │   ├── openFoodFacts.service.js
│   │   ├── googleMaps.service.js
│   │   └── barcode.service.js
│   │
│   ├── middleware/          # Middlewares
│   │   ├── auth.middleware.js
│   │   ├── validation.middleware.js
│   │   ├── error.middleware.js
│   │   └── rateLimit.middleware.js
│   │
│   ├── utils/               # Utilidades
│   │   ├── logger.js
│   │   └── validators.js
│   │
│   └── server.js            # Punto de entrada
│
├── tests/                   # Tests unitarios e integración
├── .env.example
└── package.json
```

### Patrón MVC (Model-View-Controller)

```
Request → Middleware → Routes → Controller → Service → Model → Database
                                     ↓
                                 Response
```

### Ejemplo de Implementación MVC

**Model (Product.js)**
```javascript
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  barcode: { type: String, unique: true, sparse: true },
  category: { type: String, required: true, enum: ['...'] },
  brand: String,
  image: String
}, { timestamps: true });

// Índices para búsqueda eficiente
productSchema.index({ name: 'text', brand: 'text' });

export default mongoose.model('Product', productSchema);
```

**Controller (products.controller.js)**
```javascript
import Product from '../models/Product.js';
import { validationResult } from 'express-validator';

export const searchProducts = async (req, res, next) => {
  try {
    // Validar request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { q, limit = 20, page = 1 } = req.query;

    // Buscar en base de datos
    const products = await Product.find({
      $text: { $search: q }
    })
    .limit(limit)
    .skip((page - 1) * limit)
    .lean();

    res.json({ 
      success: true, 
      data: products,
      pagination: { page, limit }
    });

  } catch (error) {
    next(error); // Pasar a middleware de errores
  }
};
```

**Routes (products.routes.js)**
```javascript
import express from 'express';
import { searchProducts } from '../controllers/products.controller.js';
import { query } from 'express-validator';

const router = express.Router();

router.get('/search',
  query('q').isString().isLength({ min: 2 }),
  searchProducts
);

export default router;
```

---

## 💾 MODELO DE DATOS

### Esquema de Base de Datos (MongoDB)

```javascript
// Product
{
  _id: ObjectId,
  name: String,
  barcode: String,
  category: String,
  brand: String,
  image: String,
  description: String,
  createdAt: Date,
  updatedAt: Date
}

// Store
{
  _id: ObjectId,
  name: String,
  chain: String,
  address: String,
  location: {
    type: "Point",
    coordinates: [lng, lat]  // GeoJSON format
  },
  phone: String,
  hours: Object,
  createdAt: Date,
  updatedAt: Date
}

// Offer
{
  _id: ObjectId,
  productId: ObjectId,       // ref: Product
  storeId: ObjectId,         // ref: Store
  price: Number,
  originalPrice: Number,
  discount: Number,
  validFrom: Date,
  validUntil: Date,
  stock: Boolean,
  lastUpdated: Date
}

// User (Fase 2)
{
  _id: ObjectId,
  email: String,
  password: String,          // hashed
  name: String,
  favorites: [ObjectId],     // ref: Product
  alerts: [{
    productId: ObjectId,
    targetPrice: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Índices para Performance

```javascript
// Products
productSchema.index({ name: 'text', brand: 'text' });
productSchema.index({ barcode: 1 }, { unique: true, sparse: true });
productSchema.index({ category: 1 });

// Stores
storeSchema.index({ location: '2dsphere' }); // Geoespacial
storeSchema.index({ chain: 1 });

// Offers
offerSchema.index({ productId: 1, storeId: 1 });
offerSchema.index({ price: 1 });
offerSchema.index({ validUntil: 1 });
offerSchema.index({ productId: 1, price: 1 }); // Compuesto
```

---

## 🔌 API ENDPOINTS

### Products
```
GET    /api/products/search?q=leche&limit=20&page=1
GET    /api/products/:id
GET    /api/products/:id/offers?lat=40.4&lng=-3.7&radius=5
POST   /api/products/barcode
```

### Stores
```
GET    /api/stores/nearby?lat=40.4&lng=-3.7&radius=5
GET    /api/stores/:id
GET    /api/stores/:id/offers
```

### Offers
```
GET    /api/offers/best?productId=xxx
GET    /api/offers/trending
GET    /api/offers?storeId=xxx
```

### Authentication (Fase 2)
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
GET    /api/auth/me
```

---

## 🔒 SEGURIDAD

### Medidas Implementadas

1. **Helmet.js**: Headers de seguridad HTTP
2. **CORS**: Control de origen cruzado
3. **Rate Limiting**: Prevención de abuse (100 req/min)
4. **Input Validation**: express-validator
5. **JWT**: Autenticación sin estado
6. **Bcrypt**: Hash de contraseñas (10 rounds)
7. **HTTPS**: Comunicación encriptada en producción
8. **Environment Variables**: Credenciales fuera del código

### Ejemplo de Rate Limiting
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100,            // 100 requests
  message: 'Demasiadas peticiones, intenta más tarde'
});

app.use('/api/', limiter);
```

---

## 📊 PERFORMANCE & OPTIMIZACIÓN

### Frontend

1. **Lazy Loading**: Carga diferida de módulos
```typescript
const routes: Routes = [
  {
    path: 'results',
    loadComponent: () => import('./pages/results/results.component')
  }
];
```

2. **Change Detection**: OnPush strategy
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

3. **Virtual Scrolling**: Para listas largas
```typescript
<cdk-virtual-scroll-viewport itemSize="100">
  <div *cdkVirtualFor="let item of items">...</div>
</cdk-virtual-scroll-viewport>
```

4. **PWA**: Service Workers para caché
```bash
ng add @angular/pwa
```

### Backend

1. **Database Indexing**: Índices en campos de búsqueda
2. **Query Optimization**: Proyección y paginación
```javascript
Product.find().select('name price').limit(20).lean()
```

3. **Caching**: Redis para queries frecuentes
4. **Connection Pooling**: MongoDB connection pool
5. **Compression**: Gzip responses
```javascript
app.use(compression());
```

---

## 🧪 TESTING

### Frontend (Jasmine + Karma)
```bash
ng test                    # Unit tests
ng test --code-coverage    # Con cobertura
```

### Backend (Jest)
```bash
npm test                   # Unit tests
npm run test:integration   # Integration tests
```

### E2E (Cypress)
```bash
npm run e2e
```

---

## 🚀 DEPLOYMENT

### Frontend (Vercel)
```bash
vercel --prod
```

### Backend (Railway)
```bash
railway up
```

### CI/CD (GitHub Actions)
- Tests automáticos en PR
- Deploy automático en merge a main
- Rollback automático si falla

---

## 📈 ESCALABILIDAD

### Estrategias Futuras

1. **Horizontal Scaling**: Múltiples instancias del backend
2. **Load Balancer**: Nginx o cloud load balancer
3. **Database Sharding**: Particionar MongoDB
4. **CDN**: CloudFlare para assets estáticos
5. **Microservicios**: Separar productos, stores, auth
6. **Message Queue**: RabbitMQ para procesamiento asíncrono

---

## 📝 MONITOREO

### Herramientas

- **Sentry**: Error tracking
- **Google Analytics**: Métricas de uso
- **MongoDB Atlas Monitoring**: Performance de DB
- **Vercel/Railway Analytics**: Métricas de infraestructura

---

**Última actualización**: Enero 2026  
**Versión del documento**: 1.0
