#!/bin/bash

# Script de pruebas rápidas para la API

echo "🧪 Iniciando pruebas de API..."
echo ""

# URL base del API
API_URL="http://localhost:3000/api"

# 1. Health Check
echo "1️⃣ Health Check"
curl -X GET $API_URL/health
echo ""
echo ""

# 2. Obtener productos
echo "2️⃣ Obtener todos los productos"
curl -X GET $API_URL/products
echo ""
echo ""

# 3. Obtener tiendas
echo "3️⃣ Obtener todas las tiendas"
curl -X GET $API_URL/stores
echo ""
echo ""

# 4. Obtener ofertas
echo "4️⃣ Obtener todas las ofertas"
curl -X GET $API_URL/offers
echo ""
echo ""

# 5. Buscar productos
echo "5️⃣ Buscar productos (ejemplo: 'laptop')"
curl -X GET "$API_URL/products?search=laptop"
echo ""
echo ""

# 6. Filtrar por categoría
echo "6️⃣ Filtrar por categoría (ejemplo: 'Electrónica')"
curl -X GET "$API_URL/products?category=Electrónica"
echo ""
echo ""

echo "✅ Pruebas completadas"
