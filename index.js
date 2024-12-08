// Importar dependencias
const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware para manejar JSON y evitar problemas de CORS
app.use(express.json());
app.use(cors());

// Archivo JSON con los datos
const dataFile = "./data.json";

// Ruta base para verificar que el servidor funciona
app.get("/", (req, res) => {
    res.send("Servidor funcionando correctamente");
});

// Manejador para solicitudes GET en /cotizar (solo como mensaje informativo)
app.get("/cotizar", (req, res) => {
    res.status(405).send("Esta ruta solo acepta solicitudes POST");
});

// Endpoint principal para cotizar (acepta solo POST)
app.post("/cotizar", (req, res) => {
    const { zona, duracion, m2 } = req.body;

    // Validar que los datos necesarios estén presentes
    if (!zona || !duracion || !m2) {
        return res.status(400).json({
            success: false,
            message: "Faltan datos. Por favor envía 'zona', 'duracion' y 'm2'."
        });
    }

    // Leer los datos del archivo data.json
    fs.readFile(dataFile, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error al leer el archivo de datos"
            });
        }

        // Convertir el contenido del archivo a un objeto JSON
        const precios = JSON.parse(data);

        // Buscar coincidencias en el archivo JSON
        const resultado = precios.find(
            (item) => item.zona === zona && item.duracion === Number(duracion)
        );

        if (resultado) {
            // Calcular el precio total
            const precioTotal = resultado.precio_por_m2 * Number(m2);
            res.json({ success: true, precio: precioTotal });
        } else {
            // Si no se encuentra una coincidencia
            res.status(404).json({
                success: false,
                message: "No se encontraron datos para la zona y duración especificadas"
            });
        }
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
