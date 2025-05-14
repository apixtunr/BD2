package com.project.bd2.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/test-db-connection")
    public ResponseEntity<String> testDatabaseConnection() {
        try {
            // Realiza una consulta simple para verificar la conexión
            String query = "SELECT 1"; // Esto es solo para verificar si MySQL responde
            jdbcTemplate.execute(query); // Si esto no lanza error, la conexión está bien
            return ResponseEntity.ok("Conexión a la base de datos exitosa");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error de conexión: " + e.getMessage());
        }
    }
}