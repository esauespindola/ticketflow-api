require('dotenv').config();
const express = require('express');
const db = require('./db');


const app = express();
const PORT = process.env.PORT || 3000;

const cors = require('cors')
app.use(cors())

app.use(express.json());


app.get('/api/ping', (req, res) => {
    res.json({ message: "Servidor operativo, listo para los tickets" });
});

function asignarPrioridad(descripcion) {
    const texto = descripcion.toLowerCase();

    const alta = ['caido', 'no funciona', 'urgente', 'critico', 'sin internet', 'bloqueado'];
    const media = ['lento', 'intermitente', 'falla', 'error', 'problema'];
    const baja = ['consulta', 'informacion', 'cuando', 'como', 'quisiera'];

    if (alta.some(palabra => texto.includes(palabra))) return 'alta';
    if (media.some(palabra => texto.includes(palabra))) return 'media';
    if (baja.some(palabra => texto.includes(palabra))) return 'baja';

    return 'media'; // prioridad por defecto
}

app.post('/api/tickets', (req, res) => {
    const { descripcion } = req.body;

    if (!descripcion) {
        return res.status(400).json({ error: 'La descripcion es requerida' });
    }

    const prioridad = asignarPrioridad(descripcion); 

    const stmt = db.prepare(`INSERT INTO tickets (descripcion, prioridad) VALUES (?, ?)`);
    const resultado = stmt.run(descripcion, prioridad);

    res.status(201).json({
        message: 'Ticket creado exitosamente',
        ticketId: resultado.lastInsertRowid,
        prioridad 
    });
});

app.get('/api/tickets', (req, res) => {
    const tickets = db.prepare('SELECT * FROM tickets').all();
    res.json(tickets);
});

// Ver un ticket por ID
app.get('/api/tickets/:id', (req, res) => {
    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(req.params.id);

    if (!ticket) {
        return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    res.json(ticket);
});

// Actualizar un ticket
app.put('/api/tickets/:id', (req, res) => {
    const { descripcion, prioridad, estado } = req.body;
    const { id } = req.params;

    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
    if (!ticket) {
        return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    db.prepare(`
        UPDATE tickets SET descripcion = ?, prioridad = ?, estado = ? WHERE id = ?
    `).run(descripcion, prioridad, estado, id);

    res.json({ message: 'Ticket actualizado exitosamente' });
});

// Eliminar un ticket
app.delete('/api/tickets/:id', (req, res) => {
    const { id } = req.params;

    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
    if (!ticket) {
        return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    db.prepare('DELETE FROM tickets WHERE id = ?').run(id);

    res.json({ message: 'Ticket eliminado exitosamente' });
});

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({ error: `Ruta ${req.method} ${req.url} no encontrada` });
});

// Manejo de errores generales (500)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor', detalle: err.message });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo impecable en el puerto ${PORT}`);
});

