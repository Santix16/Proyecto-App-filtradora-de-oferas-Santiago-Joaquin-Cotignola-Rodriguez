# 📖 GUÍA DE CONTRIBUCIÓN Y BUENAS PRÁCTICAS

## 🎯 Convenciones de Codificación

### TypeScript/Angular

#### Nomenclatura
```typescript
// ✅ CORRECTO
export class ProductDetailComponent { }
export interface Product { }
export function calculateDiscount() { }

// ❌ INCORRECTO
export class productDetail { }
export interface product { }
export function calculatediscount() { }
```

#### Componentes
```typescript
// ✅ CORRECTO
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  @Input() productId!: string;
  
  constructor(private productService: ProductsService) {}
  
  ngOnInit(): void {
    // Inicialización
  }
}

// ❌ INCORRECTO
export class ProductDetailComponent {
  productId: string;
  
  productService: ProductsService;
  
  ngOnInit() { }
}
```

#### Servicios
```typescript
// ✅ CORRECTO
@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();
  
  constructor(private http: HttpClient) {}
  
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }
}

// ❌ INCORRECTO
export class ProductsService {
  products: Product[] = [];
  
  getProducts() {
    // Sin tipado
  }
}
```

### JavaScript/Node.js

#### Controladores
```javascript
// ✅ CORRECTO
const getAllProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ INCORRECTO
const getAllProducts = (req, res) => {
  Product.find({}, (err, products) => {
    if (err) {
      res.json({ error: err });
    } else {
      res.json(products);
    }
  });
};
```

#### Modelos
```javascript
// ✅ CORRECTO
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, { timestamps: true });

// ❌ INCORRECTO
const productSchema = new mongoose.Schema({
  name: String,
  price: Number
});
```

## 🏗️ Estructura de Carpetas

```
Feature/
├── component-name.component.ts       # Lógica
├── component-name.component.html     # Template
├── component-name.component.css      # Estilos
└── component-name.component.spec.ts  # Tests
```

## 📝 Guías de Estilo

### HTML
```html
<!-- ✅ CORRECTO -->
<div class="product-card">
  <h3 class="card-title">{{ product.name }}</h3>
  <p class="card-description">{{ product.description }}</p>
  <button 
    (click)="onViewDetail(product.id)"
    class="btn btn-primary"
  >
    Ver Detalle
  </button>
</div>

<!-- ❌ INCORRECTO -->
<div>
  <h3>{{ product.name }}</h3>
  <p>{{ product.description }}</p>
  <button onclick="onViewDetail(product.id)">Ver Detalle</button>
</div>
```

### CSS
```css
/* ✅ CORRECTO */
.product-card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

/* ❌ INCORRECTO */
.productCard {
  padding: 20px;
}

.cardTitle {
  font-size: 18px;
}

.btn {
  background-color: blue;  /* Usar variables CSS */
}
```

## 🧪 Testing

### Frontend (Jasmine)
```typescript
describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
  });

  it('should display product name', () => {
    component.product = { name: 'Test Product' };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Test Product');
  });
});
```

### Backend (Jest)
```javascript
describe('ProductController', () => {
  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const mockProducts = [{ id: 1, name: 'Product 1' }];
      Product.find = jest.fn().mockResolvedValue(mockProducts);
      
      const req = { query: {} };
      const res = { json: jest.fn() };
      
      await getAllProducts(req, res);
      
      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });
  });
});
```

## 🔍 Code Review Checklist

- [ ] El código sigue las convenciones de nomenclatura
- [ ] Las funciones tienen un único propósito
- [ ] Hay comentarios para lógica compleja
- [ ] Los tipos están bien definidos (TypeScript)
- [ ] No hay console.log en producción
- [ ] El error handling es adecuado
- [ ] Las pruebas cubren casos principales
- [ ] El código está documentado (comentarios JSDoc)
- [ ] No hay código duplicado
- [ ] La seguridad está considerada

## 📚 Documentación de Código

### JSDoc para funciones
```typescript
/**
 * Calcula el porcentaje de descuento
 * @param originalPrice - Precio original
 * @param finalPrice - Precio final
 * @returns Porcentaje de descuento (0-100)
 * @example
 * const discount = calculateDiscount(100, 75);
 * console.log(discount); // 25
 */
function calculateDiscount(originalPrice: number, finalPrice: number): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
}
```

## 🚀 Workflow de Desarrollo

### 1. Feature Branch
```bash
git checkout -b feature/nombre-feature
```

### 2. Desarrollar y Commits
```bash
git add .
git commit -m "feat: descripción clara del cambio"
```

### 3. Push y Pull Request
```bash
git push origin feature/nombre-feature
# Crear Pull Request en GitHub
```

### 4. Code Review y Merge
```bash
# Después de aprobación
git checkout main
git merge feature/nombre-feature
```

## 📋 Commit Messages

```
feat: Agregar búsqueda de productos
fix: Corregir cálculo de distancia
docs: Actualizar README
style: Formatear código
refactor: Reorganizar servicios
test: Agregar pruebas de búsqueda
chore: Actualizar dependencias
```

## 🔒 Seguridad

### ❌ NO hacer
```typescript
// Exposición de secrets
const apiKey = "sk_live_1234567890";

// SQL/NoSQL Injection (aunque MongoDB es más seguro)
const products = await Product.find({ 
  name: userInput 
});

// XSS - HTML sin sanitizar
<div [innerHTML]="userContent"></div>

// Credenciales en código
password: "admin123"
```

### ✅ Hacer
```typescript
// Usar variables de entorno
const apiKey = process.env.API_KEY;

// Validar entrada
const query = {};
if (search && typeof search === 'string') {
  query.$or = [
    { name: { $regex: search, $options: 'i' } }
  ];
}

// Usar Property Binding
<div [textContent]="userContent"></div>

// Secrets en .env
API_KEY=sk_live_1234567890
```

## 🎓 Recursos de Aprendizaje

- [Angular Style Guide](https://angular.io/guide/styleguide)
- [Google JavaScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [OWASP Security Guidelines](https://owasp.org/)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)

## 💬 Preguntas Frecuentes

**¿Cuándo crear un nuevo componente?**
- Cuando la funcionalidad es reutilizable
- Cuando el componente tiene más de 400 líneas
- Cuando representa una unidad lógica clara

**¿Cuándo crear un nuevo servicio?**
- Para lógica compartida entre componentes
- Para llamadas HTTP
- Para estado global

**¿Cuándo usar BehaviorSubject vs Subject?**
- BehaviorSubject: Cuando necesitas el valor actual
- Subject: Para eventos simples

---

**¡Gracias por contribuir a Ofertas App!** 🎉
