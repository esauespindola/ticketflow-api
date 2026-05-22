require('dotenv').config();
const express = require('express');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());


app.get('/api/ping', (req, res) => {
    res.json({ message: "Servidor operativo, listo para los tickets" });
});

app.post('/api/tickets', (req, res) =>{
    const { descripcion, prioridad } = req.body;

    // Validar los datos de entrada
    if (!descripcion || !prioridad) {
        return res.status(400).json ({ error: 'Descripcion y prioridad son requeridos'});
    }

    const stmt = db.prepare(`INSERT INTO tickets (descripcion, prioridad) VALUES (?,?)`);

    const resultado = stmt.run(descripcion, prioridad);

    res.status(201).json({ message: 'Ticket creado exitosamente', ticketId: resultado.lastInsertRowid});
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo impecable en el puerto ${PORT}`);
});

