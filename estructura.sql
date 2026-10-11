
CREATE DATABASE IF NOT EXISTS api_practica;

USE api_practica;

CREATE TABLE IF NOT EXISTS recursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    cantidad INT DEFAULT 0
);