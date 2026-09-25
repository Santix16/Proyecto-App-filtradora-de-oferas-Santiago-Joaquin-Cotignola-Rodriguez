const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Product = require('./src/models/Product');
const Store = require('./src/models/Store');
const Offer = require('./src/models/Offer');
const Category = require('./src/models/Category');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ofertas-app';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a MongoDB para hacer el seed...');

    const dbPath = path.join(__dirname, '../frontend/server/db.json');
    
    if (!fs.existsSync(dbPath)) {
      console.error('No se encontró el archivo db.json en la ruta:', dbPath);
      process.exit(1);
    }

    const rawData = fs.readFileSync(dbPath, 'utf8');
    const data = JSON.parse(rawData);

    console.log('Limpiando colecciones existentes...');
    await Product.deleteMany({});
    await Store.deleteMany({});
    await Offer.deleteMany({});
    await Category.deleteMany({});

    console.log('Insertando datos en MongoDB...');

    if (data.stores && data.stores.length > 0) {
      await Store.insertMany(data.stores);
      console.log(`${data.stores.length} tiendas insertadas.`);
    }

    if (data.products && data.products.length > 0) {
      await Product.insertMany(data.products);
      console.log(`${data.products.length} productos insertados.`);
    }

    if (data.offers && data.offers.length > 0) {
      await Offer.insertMany(data.offers);
      console.log(`${data.offers.length} ofertas insertadas.`);
    }

    if (data.categories && data.categories.length > 0) {
      await Category.insertMany(data.categories);
      console.log(`${data.categories.length} categorías insertadas.`);
    }

    console.log('¡Migración de datos completada con éxito!');
    process.exit(0);
  } catch (error) {
    console.error('Error durante la migración de datos:', error);
    process.exit(1);
  }
}

seedDatabase();