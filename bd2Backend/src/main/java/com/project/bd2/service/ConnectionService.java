package com.project.bd2.service;

import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

@Service
public class ConnectionService {

    private Connection currentConnection;

    public Connection connect(String host, String port, String username, String password) throws SQLException {
        String url = "jdbc:mysql://" + host + ":" + port + "/databaseproject?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
        this.currentConnection = DriverManager.getConnection(url, username, password);
        return this.currentConnection;
    }

    public Connection getConnection() throws SQLException {
        if (this.currentConnection == null || this.currentConnection.isClosed()) {
            throw new SQLException("No hay conexión activa. Debes conectarte primero.");
        }
        return this.currentConnection;
    }
}
