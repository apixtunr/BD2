package com.project.bd2.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Lógica para invalidar la sesión/token
        return ResponseEntity.ok().body(Map.of(
            "mensaje", "Sesión cerrada exitosamente"
        ));
    }
}
