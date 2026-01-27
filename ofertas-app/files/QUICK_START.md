# ⚡ QUICK START - Comparador de Ofertas

## 🚀 Comienza en 15 minutos

Esta guía te permite arrancar el proyecto rápidamente. Para detalles completos, consulta `SETUP_GUIDE.md`.

---

## ✅ Prerequisitos Rápidos

```bash
# Verifica que tienes instalado:
node --version    # >= v18.0.0
npm --version     # >= v9.0.0
git --version     # Cualquier versión
```

Si falta algo:
- **Node.js**: https://nodejs.org/ (descarga LTS)
- **Git**: https://git-scm.com/downloads

---

## 📦 Paso 1: Instalar Angular CLI (1 min)

```bash
npm install -g @angular/cli
ng version
```

---

## 🏗️ Paso 2: Crear la estructura del proyecto (2 min)

```bash
# Crear carpeta principal
mkdir ofertas-app
cd ofertas-app

# Inicializar Git
git init
echo "node_modules/
.env
dist/
.angular/
*.log" > .gitignore
```

---

## 🎨 Paso 3: Crear Frontend Angular (3 min)

```bash
# Crear proyecto Angular
ng new ofertas-frontend --routing --style=scss --standalone
cd ofertas-frontend

# Instalar Angular Material
ng add @angular/material
# Selecciona: Indigo/Pink, Yes, Yes

# Instalar Leaflet para mapas
npm install leaflet @asymmetrik/ngx-leaflet @types/leaflet --save-dev

# Volver a la raíz
cd ..
```

---

## 🔧 Paso 4: Crear Backend Node.js (2 min)

```bash
# Crear carpeta backend
mkdir backend
cd backend

# Inicializar npm
npm init -y

# Instalar dependencias
npm install express cors dotenv mongoose axios express-validator morgan helmet compression

# Instalar nodemon para desarrollo
npm install --save-dev nodemon

# Crear estructura de carpetas
mkdir -p src/{config,controllers,models,routes,services,middleware,utils}

# Volver a la raíz
cd ..
```

---

## 📝 Paso 5: Configurar variables de entorno (2 min)

### Backend `.env` file

```bash
# Crear archivo .env en /backend
cat > backend/.env << EOF
PORT=3000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/ofertas
GOOGLE_MAPS_API_KEY=TU_API_KEY_AQUI
JWT_SECRET=tu_secreto_super_seguro_123
EOF
```

### Frontend environment

```bash
# Editar ofertas-frontend/src/environments/environment.development.ts
cat > ofertas-frontend/src/environments/environment.development.ts << EOF
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  googleMapsKey: 'TU_API_KEY_AQUI',
  enableDebug: true
};
EOF
```

---

## 🎯 Paso 6: Usar GitHub Copilot (5 min)

Ahora que tienes la estructura lista, usa los prompts del archivo `COPILOT_PROMPTS.txt`:

### Para el Backend:
1. Abre `backend/src/server.js`
2. Usa **PROMPT 2** de COPILOT_PROMPTS.txt
3. Copia y pega en Copilot Chat (Ctrl+I o Cmd+I)

### Para el Frontend:
1. Abre `ofertas-frontend/src/app/`
2. Usa **PROMPTS 6-10** para crear componentes
3. Copilot generará el código automáticamente

---

## ▶️ Paso 7: Ejecutar la aplicación

### Terminal 1 - Backend:
```bash
cd backend

# Editar package.json scripts:
# "dev": "nodemon src/server.js"

npm run dev
```

### Terminal 2 - Frontend:
```bash
cd ofertas-frontend
ng serve
```

Accede a: **http://localhost:4200** 🎉

---

## 🗄️ (OPCIONAL) Configurar MongoDB Atlas

Si quieres usar una base de datos real en la nube (5 min):

1. **Crear cuenta**: https://www.mongodb.com/cloud/atlas
2. **Crear cluster gratuito**: M0 Sandbox
3. **Configurar acceso**:
   - Database Access → Add User (username/password)
   - Network Access → Add IP → 0.0.0.0/0 (allow all)
4. **Copiar connection string**:
   - Connect → Connect your application
   - Copiar la URI
5. **Actualizar .env**:
   ```
   DATABASE_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ofertas
   ```

---

## 🎨 Próximos Pasos Recomendados

### Día 1-2: Backend Básico
```bash
# Usa estos prompts de COPILOT_PROMPTS.txt:
PROMPT 11: Crear controlador de productos
PROMPT 12: Crear rutas de API
PROMPT 13: Crear modelo Mongoose para productos
```

### Día 3-4: Frontend Básico
```bash
# Usa estos prompts:
PROMPT 6: Crear componente de búsqueda
PROMPT 7: Crear componente de tarjeta de oferta
PROMPT 9: Crear página de resultados
```

### Día 5: Integración
```bash
# Usa estos prompts:
PROMPT 4: Crear servicio de productos
PROMPT 5: Crear servicio de geolocalización
```

---

## 🆘 Troubleshooting Rápido

### Error: "Port 3000 already in use"
```bash
# Linux/Mac:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <numero_PID> /F
```

### Error: "Cannot find module"
```bash
# En la carpeta con el error:
rm -rf node_modules package-lock.json
npm install
```

### Error: "Angular CLI not found"
```bash
npm install -g @angular/cli
# O usa:
npx ng serve
```

---

## 📚 Archivos Importantes que Tienes

1. **README.md** - Documentación completa del proyecto
2. **SETUP_GUIDE.md** - Guía detallada paso a paso
3. **COPILOT_PROMPTS.txt** - 28 prompts listos para Copilot
4. **ARQUITECTURA_TECNICA.md** - Arquitectura del sistema
5. **Plan_Completo_Proyecto.docx** - Documento Word profesional

---

## ✨ Comandos Útiles de Git

```bash
# Commit inicial
git add .
git commit -m "Initial project setup"

# Crear repositorio en GitHub y conectar
git remote add origin https://github.com/tu-usuario/ofertas-app.git
git push -u origin main
```

---

## 🎯 Objetivo del MVP (5 semanas)

- ✅ Búsqueda de productos
- ✅ Comparación de precios
- ✅ Geolocalización de tiendas
- ✅ Mapa interactivo
- ✅ Diseño responsive

---

## 💡 Tips Pro

1. **Usa Copilot intensivamente**: Los prompts están optimizados
2. **Comienza con el backend**: Es más rápido validar la lógica
3. **Prueba cada endpoint con Postman**: Antes de conectar frontend
4. **Usa Angular Material**: Acelera el desarrollo de UI
5. **No optimices prematuramente**: Primero hazlo funcionar, luego optimiza

---

## 🚀 ¡Listo para comenzar!

Tienes todo lo necesario. Simplemente:
1. Sigue los pasos 1-7
2. Usa los prompts de Copilot
3. ¡Desarrolla tu MVP!

**Tiempo estimado para MVP funcional: 5 semanas**

---

**¿Dudas?** Revisa los archivos de documentación detallada o abre un issue en GitHub.

**¡Éxito con tu proyecto!** 🎉
