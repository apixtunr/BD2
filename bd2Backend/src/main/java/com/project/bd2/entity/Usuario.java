package com.project.bd2.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Usuario {
    
    @Id
    private Long id;
    private String nombre;
    private String correo;
    // otros campos

    // Getters y Setters
}

