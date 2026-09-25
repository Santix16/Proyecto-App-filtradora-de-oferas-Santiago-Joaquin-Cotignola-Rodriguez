const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001; 

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', require('./src/routes/products'));
app.use('/api/offers', require('./src/routes/offers'));
app.use('/api/stores', require('./src/routes/stores'));

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 2. Conexión a MongoDB e inicio del servidor
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ofertas-app';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Conectado exitosamente a MongoDB');
    // Iniciar servidor solo si la BD conecta correctamente
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al conectar a MongoDB:', err.message);
  });

module.exports = app;