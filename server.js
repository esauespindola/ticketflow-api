require('dotenv').config();
const express = require('express');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());


app.get('/api/ping', (req, res) => {
    res.json({ message: "Servidor operativo, listo para los tickets" });
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo impecable en el puerto ${PORT}`);
});