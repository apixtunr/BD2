package com.project.bd2.controller;

import com.project.bd2.dto.DbLoginRequest;
import com.project.bd2.service.ConnectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.*;

@RestController
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private ConnectionService connectionService;

    @PostMapping("/login")
public ResponseEntity<Map<String, String>> login(@RequestBody DbLoginRequest request) {
    try {
        Connection conn = connectionService.connect(
            request.getHost(), 
            request.getPort(), 
            request.getUsername(), 
            request.getPassword()
        );
        return ResponseEntity.ok(Map.of(
            "mensaje", "Conexión exitosa a MySQL",
            "database", conn.getCatalog()  // Muestra la BD conectada
        ));
    } catch (SQLException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(Map.of(
                "error", "Falló la conexión a MySQL",
                "detalle", e.getMessage()  // Mensaje específico de MySQL
            ));
    }
}
}
