# Script de pruebas rápidas para la API (PowerShell)
# Uso: .\test-api.ps1

Write-Host "🧪 Iniciando pruebas de API..." -ForegroundColor Cyan
Write-Host ""

$apiUrl = "http://localhost:3000/api"

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Endpoint
    )
    Write-Host $Name -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "$apiUrl$Endpoint" -Method Get
        $response | ConvertTo-Json | Write-Host
    }
    catch {
        Write-Host "❌ Error: $_" -ForegroundColor Red
    }
    Write-Host ""
}

# 1. Health Check
Write-Host "1️⃣ Health Check" -ForegroundColor Green
Test-Endpoint "Health Check" "/health"

# 2. Obtener productos
Write-Host "2️⃣ Obtener todos los productos" -ForegroundColor Green
Test-Endpoint "Productos" "/products"

# 3. Obtener tiendas
Write-Host "3️⃣ Obtener todas las tiendas" -ForegroundColor Green
Test-Endpoint "Tiendas" "/stores"

# 4. Obtener ofertas
Write-Host "4️⃣ Obtener todas las ofertas" -ForegroundColor Green
Test-Endpoint "Ofertas" "/offers"

# 5. Buscar productos
Write-Host "5️⃣ Buscar productos (búsqueda: 'laptop')" -ForegroundColor Green
Test-Endpoint "Búsqueda" "/products?search=laptop"

# 6. Filtrar por categoría
Write-Host "6️⃣ Filtrar por categoría ('Electrónica')" -ForegroundColor Green
Test-Endpoint "Categoría" "/products?category=Electrónica"

Write-Host "✅ Pruebas completadas" -ForegroundColor Green
