const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
