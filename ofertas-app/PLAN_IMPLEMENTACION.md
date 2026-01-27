# 📋 PLAN DE IMPLEMENTACIÓN DESDE COPILOT_PROMPTS

## Estado Actual
- ✅ Proyecto base funcionando (Backend en 3000, Frontend en 4200)
- ✅ Modelos TypeScript creados
- ✅ Modelos Mongoose existentes
- ✅ Servicios básicos implementados
- ✅ Componentes base creados

## Próximos Pasos - Usar GitHub Copilot

### FASE 1: Mejorar Servicios (PROMPTS 4-5)
1. **ProductsService** - Copiar PROMPT 4 en Copilot Chat
   - Añadir métodos: searchProducts(), getProductById(), getProductOffers(), scanBarcode()
   - Implementar caché de búsquedas
   - Manejador de errores mejorado

2. **GeolocationService** - Copiar PROMPT 5
   - Integrar navigator.geolocation
   - Calcular distancias (Haversine)
   - Caché de última ubicación

### FASE 2: Componentes Frontend (PROMPTS 6-10)
Usar estos prompts en Copilot Chat para generar código:

- **PROMPT 6**: SearchBarComponent
  - Input con debounce
  - Autocomplete
  - Escáner de códigos

- **PROMPT 7**: OfferCardComponent
  - Mostrar ofertas con descuentos
  - Indicador de mejor oferta
  - Botón "Ver en mapa"

- **PROMPT 8**: MapViewComponent
  - Leaflet integration
  - Markers de tiendas
  - Clustering

- **PROMPT 9**: ResultsPageComponent
  - Filtros y ordenamiento
  - Paginación infinita
  - Vista mapa/lista responsive

- **PROMPT 10**: HomePageComponent
  - Hero section
  - Secciones: cómo funciona, ofertas destacadas
  - Responsivo

### FASE 3: Backend Controllers y Rutas (PROMPTS 11-13)
- **PROMPT 11**: Mejorar productController
- **PROMPT 12**: Crear/mejorar rutas API
- **PROMPT 13**: Mongoose schemas mejorados

### FASE 4: Integraciones Externas (PROMPTS 14-16)
- **PROMPT 14**: Open Food Facts API
- **PROMPT 15**: Google Maps API
- **PROMPT 16**: Escáner de código de barras

### FASE 5: Features Avanzados (PROMPTS 17-20)
- **PROMPT 17**: JWT Authentication
- **PROMPT 18**: Sistema de alertas de precios
- **PROMPT 19**: Gráficos de historial
- **PROMPT 20**: Panel de administración

### FASE 6: Optimización (PROMPTS 21-24)
- **PROMPT 21**: Lazy loading y code splitting
- **PROMPT 22**: PWA y offline
- **PROMPT 23**: Docker
- **PROMPT 24**: CI/CD con GitHub Actions

### FASE 7: Testing (PROMPTS 25-26)
- **PROMPT 25**: Unit tests (Jasmine/Karma)
- **PROMPT 26**: E2E tests (Cypress)

### FASE 8: Documentación (PROMPTS 27-28)
- **PROMPT 27**: Swagger/OpenAPI
- **PROMPT 28**: CONTRIBUTING.md

## Cómo Usar Este Plan

1. Abre GitHub Copilot Chat (Ctrl+I o Cmd+I)
2. Copia el prompt que necesitas del archivo COPILOT_PROMPTS.txt
3. Pégalo en Copilot
4. Ajusta detalles específicos si es necesario
5. Revisa el código generado
6. Cópialo a tu proyecto

## Orden Recomendado de Ejecución

```
SEMANA 1 (Semana de desarrollo inicial):
- Lunes: PROMPTS 4-5 (Servicios)
- Martes: PROMPTS 6-7 (Componentes básicos)
- Miércoles: PROMPTS 8-9 (Componentes complejos)
- Jueves: PROMPTS 11-13 (Backend)
- Viernes: PROMPTS 14-16 (Integraciones)

SEMANA 2:
- PROMPTS 17-20 (Features)
- PROMPTS 21-24 (Deploy)
- PROMPTS 25-26 (Testing)

SEMANA 3:
- PROMPTS 27-28 (Documentación)
- Polish y bug fixes
```

## Notas Importantes

✅ **Arquitectura**: Los prompts siguen MVC pattern
✅ **Standalone Components**: Todos los componentes usan standalone
✅ **TypeScript**: Tipos completos en todo
✅ **Error Handling**: Cada servicio tiene manejo de errores
✅ **Responsive**: Diseños mobile-first

⚠️ **Próximas Acciones**:
1. Conectar a MongoDB Atlas
2. Implementar Google Maps API Key
3. Usar Copilot para generar cada sección
4. Testear cada módulo conforme se complete
