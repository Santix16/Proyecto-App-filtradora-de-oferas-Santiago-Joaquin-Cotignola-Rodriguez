// Script para poblar la base de datos con datos de ejemplo
// Ejecutar: node seed.js

const mongoose = require('mongoose');
require('dotenv').config();

// Modelos
const Product = require('./src/models/Product');
const Offer = require('./src/models/Offer');
const Store = require('./src/models/Store');

const seedDatabase = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    // Limpiar colecciones existentes
    await Product.deleteMany({});
    await Offer.deleteMany({});
    await Store.deleteMany({});
    console.log('Colecciones limpiadas');

    // Crear tiendas
    const stores = await Store.insertMany([
      {
        name: 'Supermercado Central',
        address: 'Calle Principal 123',
        city: 'Madrid',
        state: 'Madrid',
        zipCode: '28001',
        phone: '91-123-4567',
        email: 'info@centralmarket.com',
        website: 'www.centralmarket.com',
        location: {
          latitude: 40.4168,
          longitude: -3.7038
        },
        rating: 4.5,
        reviews: 120,
        openingHours: {
          monday: '08:00-22:00',
          tuesday: '08:00-22:00',
          wednesday: '08:00-22:00',
          thursday: '08:00-22:00',
          friday: '08:00-23:00',
          saturday: '08:00-23:00',
          sunday: '09:00-22:00'
        }
      },
      {
        name: 'Tienda Electrónica Plus',
        address: 'Avenida Tecnológica 456',
        city: 'Barcelona',
        state: 'Barcelona',
        zipCode: '08002',
        phone: '93-234-5678',
        email: 'info@electroplus.com',
        website: 'www.electroplus.com',
        location: {
          latitude: 41.3851,
          longitude: 2.1734
        },
        rating: 4.7,
        reviews: 95,
        openingHours: {
          monday: '09:00-21:00',
          tuesday: '09:00-21:00',
          wednesday: '09:00-21:00',
          thursday: '09:00-21:00',
          friday: '09:00-22:00',
          saturday: '09:00-22:00',
          sunday: '10:00-21:00'
        }
      },
      {
        name: 'Moda & Estilo',
        address: 'Centro Comercial La Vega',
        city: 'Valencia',
        state: 'Valencia',
        zipCode: '46003',
        phone: '96-345-6789',
        email: 'info@modaestilo.com',
        location: {
          latitude: 39.4699,
          longitude: -0.3763
        },
        rating: 4.3,
        reviews: 87
      }
    ]);
    console.log(`${stores.length} tiendas creadas`);

    // Crear productos
    const products = await Product.insertMany([
      {
        name: 'Laptop HP Pavilion 15',
        description: 'Laptop ultraportátil con procesador Intel i7 y 16GB RAM',
        price: 599.99,
        originalPrice: 899.99,
        image: 'https://via.placeholder.com/300x300?text=Laptop+HP',
        category: 'Electrónica',
        storeId: stores[1]._id,
        storeName: stores[1].name,
        location: stores[1].location,
        rating: 4.6,
        reviews: 45,
        inStock: true
      },
      {
        name: 'Smartphone Samsung Galaxy A52',
        description: 'Teléfono inteligente con pantalla AMOLED de 6.5 pulgadas',
        price: 349.99,
        originalPrice: 449.99,
        image: 'https://via.placeholder.com/300x300?text=Samsung+Galaxy',
        category: 'Electrónica',
        storeId: stores[1]._id,
        storeName: stores[1].name,
        location: stores[1].location,
        rating: 4.4,
        reviews: 120,
        inStock: true
      },
      {
        name: 'Blusa Elegante de Seda',
        description: 'Blusa de seda premium, disponible en varios colores',
        price: 49.99,
        originalPrice: 79.99,
        image: 'https://via.placeholder.com/300x300?text=Blusa+Seda',
        category: 'Ropa',
        storeId: stores[2]._id,
        storeName: stores[2].name,
        location: stores[2].location,
        rating: 4.5,
        reviews: 32,
        inStock: true
      },
      {
        name: 'Café Premium 500g',
        description: 'Café de grano premium tostado oscuro',
        price: 12.99,
        originalPrice: 16.99,
        image: 'https://via.placeholder.com/300x300?text=Cafe+Premium',
        category: 'Alimentos',
        storeId: stores[0]._id,
        storeName: stores[0].name,
        location: stores[0].location,
        rating: 4.7,
        reviews: 156,
        inStock: true
      },
      {
        name: 'Auriculares Bluetooth Sony',
        description: 'Auriculares con cancelación de ruido y batería de 30 horas',
        price: 179.99,
        originalPrice: 249.99,
        image: 'https://via.placeholder.com/300x300?text=Auriculares+Sony',
        category: 'Electrónica',
        storeId: stores[1]._id,
        storeName: stores[1].name,
        location: stores[1].location,
        rating: 4.8,
        reviews: 89,
        inStock: true
      },
      {
        name: 'Jeans Premium Azul Oscuro',
        description: 'Jeans de algodón 100% con corte clásico',
        price: 69.99,
        originalPrice: 99.99,
        image: 'https://via.placeholder.com/300x300?text=Jeans+Premium',
        category: 'Ropa',
        storeId: stores[2]._id,
        storeName: stores[2].name,
        location: stores[2].location,
        rating: 4.4,
        reviews: 65,
        inStock: true
      }
    ]);
    console.log(`${products.length} productos creados`);

    // Crear ofertas
    const offers = await Offer.insertMany([
      {
        productId: products[0]._id,
        storeId: stores[1]._id,
        discount: 33,
        originalPrice: 899.99,
        finalPrice: 599.99,
        startDate: new Date('2026-01-20'),
        endDate: new Date('2026-02-28'),
        description: 'Gran descuento en laptops esta temporada',
        isActive: true
      },
      {
        productId: products[1]._id,
        storeId: stores[1]._id,
        discount: 22,
        originalPrice: 449.99,
        finalPrice: 349.99,
        startDate: new Date('2026-01-15'),
        endDate: new Date('2026-02-15'),
        description: 'Promoción especial en smartphones',
        isActive: true
      },
      {
        productId: products[3]._id,
        storeId: stores[0]._id,
        discount: 24,
        originalPrice: 16.99,
        finalPrice: 12.99,
        startDate: new Date('2026-01-10'),
        endDate: new Date('2026-03-10'),
        description: 'Oferta válida todo el mes',
        isActive: true
      },
      {
        productId: products[4]._id,
        storeId: stores[1]._id,
        discount: 28,
        originalPrice: 249.99,
        finalPrice: 179.99,
        startDate: new Date('2026-01-25'),
        endDate: new Date('2026-02-25'),
        description: 'Black Friday extendido',
        isActive: true
      }
    ]);
    console.log(`${offers.length} ofertas creadas`);

    console.log('✅ Base de datos poblada exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
