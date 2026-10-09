const express = require('express');

const app = express();
const PORT = 3000;

// Permite recibir datos en formato JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log('Método:', req.method);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Body recibido:', req.body);
    next();
});

// Arreglo en memoria
let productos = [
    {
        id: 1,
        nombre: "Laptop",
        precio: 15000,
        categoria: "Tecnología"
    },
    {
        id: 2,
        nombre: "Mouse",
        precio: 350,
        categoria: "Accesorios"
    },
    {
        id: 3,
        nombre: "Teclado",
        precio: 700,
        categoria: "Accesorios"
    }
];

// Ruta base
app.get('/', (req, res) => {
    res.send('Servidor API REST funcionando correctamente');
});

// GET - Obtener todos los productos
app.get('/api/productos', (req, res) => {
    res.json(productos);
});

// GET - Obtener un producto por ID
app.get('/api/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const producto = productos.find(p => p.id === id);

    if (!producto) {
        return res.status(404).json({
            mensaje: 'Producto no encontrado'
        });
    }

    res.json(producto);
});

// POST - Crear un producto
app.post('/api/productos', (req, res) => {
    const nuevoProducto = {
        id: productos.length > 0 ? productos[productos.length - 1].id + 1 : 1,
        nombre: req.body.nombre,
        precio: req.body.precio,
        categoria: req.body.categoria
    };

    productos.push(nuevoProducto);

    res.status(201).json(nuevoProducto);
});

// PUT - Actualizar un producto
app.put('/api/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const indice = productos.findIndex(p => p.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensaje: 'Producto no encontrado'
        });
    }

    productos[indice] = {
        id: id,
        nombre: req.body.nombre,
        precio: req.body.precio,
        categoria: req.body.categoria
    };

    res.json(productos[indice]);
});

// DELETE - Eliminar un producto
app.delete('/api/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const indice = productos.findIndex(p => p.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensaje: 'Producto no encontrado'
        });
    }

    productos.splice(indice, 1);

    res.json({
        mensaje: 'Producto eliminado correctamente'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});