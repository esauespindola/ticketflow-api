const Database = require('better-sqlite3');
const path = require('path');

// Ruta fisica de la base de datos SQLite
const dbPath = path.join(__dirname, 'tickets.db');

// crea una conexion a la base de datos SQLite
const db = new Database(dbPath, { verbose: console.log});
console.log ('Conexión con SQLite establecida con éxito.')

// Crea la tabla 'tickets' si no existe
const createTableQuery = `
CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descripcion TEXT NOT NULL,
    priotidad TEXT NOT NULL,
    estado TEXT DEFAULT 'Abierto',
    fecha_creacion DATETIME DEFAULT CURRENT_tIMESTAMP
    );
`;

//Ejecuta la orden en la base de datos para crear la tabla
db.exec(crearTableQuery);
console.log ('Tabla "tickets" creada o verificada con exito.');

// Exporta la conexión a la base de datos para su uso en otros módulos
module.exports = db;