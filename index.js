
const express = require('express');
const db = require('./config/db');
require('dotenv').config();

const app = express();
app.use(express.json());

// 1. GET: consultar todos los recursos
app.get('/api/recursos', async (req, res) => {
    try {
        const [recursos] = await db.query(
            'SELECT * FROM recursos'
        );

        res.status(200).json(recursos);
    } catch (error) {
        console.error('Error al consultar recursos:', error);
        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
});

// 2. GET por ID: consultar un recurso específico
app.get('/api/recursos/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'El ID debe ser un número positivo'
            });
        }

        const [recursos] = await db.query(
            'SELECT * FROM recursos WHERE id = ?',
            [id]
        );

        if (recursos.length === 0) {
            return res.status(404).json({
                mensaje: 'Recurso no encontrado'
            });
        }

        res.status(200).json(recursos[0]);
    } catch (error) {
        console.error('Error al consultar recurso:', error);
        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
});

// 3. POST: registrar un recurso
app.post('/api/recursos', async (req, res) => {
    try {
        const { nombre, descripcion, cantidad } = req.body;

        if (
            typeof nombre !== 'string' ||
            nombre.trim() === ''
        ) {
            return res.status(400).json({
                mensaje: 'El nombre es obligatorio'
            });
        }

        if (
            cantidad !== undefined &&
            (!Number.isInteger(cantidad) || cantidad < 0)
        ) {
            return res.status(400).json({
                mensaje: 'La cantidad debe ser un entero no negativo'
            });
        }

        const [resultado] = await db.query(
            `INSERT INTO recursos (nombre, descripcion, cantidad)
             VALUES (?, ?, ?)`,
            [
                nombre.trim(),
                descripcion ?? null,
                cantidad ?? 0
            ]
        );

        const [nuevoRecurso] = await db.query(
            'SELECT * FROM recursos WHERE id = ?',
            [resultado.insertId]
        );

        res.status(201).json(nuevoRecurso[0]);
    } catch (error) {
        console.error('Error al registrar recurso:', error);
        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
});

// 4. PUT: actualizar un recurso
app.put('/api/recursos/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { nombre, descripcion, cantidad } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'El ID debe ser un número positivo'
            });
        }

        if (
            typeof nombre !== 'string' ||
            nombre.trim() === ''
        ) {
            return res.status(400).json({
                mensaje: 'El nombre es obligatorio'
            });
        }

        if (
            cantidad !== undefined &&
            (!Number.isInteger(cantidad) || cantidad < 0)
        ) {
            return res.status(400).json({
                mensaje: 'La cantidad debe ser un entero no negativo'
            });
        }

        const [existente] = await db.query(
            'SELECT id FROM recursos WHERE id = ?',
            [id]
        );

        if (existente.length === 0) {
            return res.status(404).json({
                mensaje: 'Recurso no encontrado'
            });
        }

        await db.query(
            `UPDATE recursos
             SET nombre = ?, descripcion = ?, cantidad = ?
             WHERE id = ?`,
            [
                nombre.trim(),
                descripcion ?? null,
                cantidad ?? 0,
                id
            ]
        );

        const [actualizado] = await db.query(
            'SELECT * FROM recursos WHERE id = ?',
            [id]
        );

        res.status(200).json(actualizado[0]);
    } catch (error) {
        console.error('Error al actualizar recurso:', error);
        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
});

// 5. DELETE: eliminar un recurso
app.delete('/api/recursos/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'El ID debe ser un número positivo'
            });
        }

        const [resultado] = await db.query(
            'DELETE FROM recursos WHERE id = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Recurso no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Recurso eliminado correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar recurso:', error);
        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
});

// Iniciar servidor y verificar conexión con MySQL
async function iniciarServidor() {
    try {
        const conexion = await db.getConnection();
        console.log('Conectado exitosamente a la base de datos');
        conexion.release();

        const puerto = process.env.PORT || 3000;

        app.listen(puerto, () => {
            console.log(
                `Servidor ejecutándose en http://localhost:${puerto}`
            );
        });
    } catch (error) {
        console.error(
            'No se pudo conectar a la base de datos:',
            error.message
        );
        process.exit(1);
    }
}

iniciarServidor();