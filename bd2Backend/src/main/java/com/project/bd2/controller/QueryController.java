package com.project.bd2.controller;

import com.project.bd2.service.ConnectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.sql.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class QueryController {

    @Autowired
    private ConnectionService connectionService;

   @PostMapping("/transaction")
public ResponseEntity<?> ejecutarTransaccion(@RequestBody Map<String, Object> body) {
    Object queriesObj = body.get("queries");
    List<String> queries = new ArrayList<>();
    if (queriesObj instanceof List<?>) {
        for (Object item : (List<?>) queriesObj) {
            if (item instanceof String) {
                queries.add((String) item);
            }
        }
    }
    if (queries.isEmpty()) {
        return ResponseEntity.badRequest().body(Map.of("tipo", "error", "mensaje", "No hay consultas para ejecutar"));
    }

    for (String query : queries) {
    String q = query.trim().toUpperCase();
    if (q.startsWith("START TRANSACTION") || q.equals("COMMIT") || q.equals("ROLLBACK")) {
        return ResponseEntity.badRequest().body(Map.of(
            "tipo", "error",
            "mensaje", "No incluyas comandos de control de transacción (START TRANSACTION, COMMIT, ROLLBACK) en la lista de queries"
        ));
    }
}
    try (Connection conn = connectionService.getConnection()) {
        conn.setAutoCommit(false);
        try (Statement stmt = conn.createStatement()) {
            for (String query : queries) {
                stmt.execute(query);
            }
            conn.commit();
            return ResponseEntity.ok(Map.of("tipo", "transaccion", "mensaje", "Transacción completada"));
        } catch (SQLException e) {
            conn.rollback();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("tipo", "error", "mensaje", "Error en la transacción", "detalle", e.getMessage()));
        } finally {
            try { conn.setAutoCommit(true); } catch (Exception ignore) {}
        }
    } catch (SQLException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("tipo", "error", "mensaje", "Error de conexión", "detalle", e.getMessage()));
    }
}

    @PostMapping("/query")
    public ResponseEntity<?> ejecutarQuery(@RequestBody Map<String, String> body) {
        String query = body.get("query");
        
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("tipo", "error", "mensaje", "La consulta no puede estar vacía"));
        }

        try (Statement stmt = connectionService.getConnection().createStatement()) {
            long startTime = System.currentTimeMillis();
            boolean isResultSet = stmt.execute(query);
            long executionTime = System.currentTimeMillis() - startTime;

            if (isResultSet) {
                // Procesar resultados SELECT
                ResultSet rs = stmt.getResultSet();
                ResultSetMetaData meta = rs.getMetaData();
                int columnCount = meta.getColumnCount();
                
                List<Map<String, Object>> resultados = new ArrayList<>();
                List<String> columnas = new ArrayList<>();
                
                // Obtener nombres de columnas
                for (int i = 1; i <= columnCount; i++) {
                    columnas.add(meta.getColumnLabel(i));
                }
                
                // Procesar filas
                while (rs.next()) {
                    Map<String, Object> fila = new LinkedHashMap<>();
                    for (String columna : columnas) {
                        fila.put(columna, rs.getObject(columna));
                    }
                    resultados.add(fila);
                }
                
                return ResponseEntity.ok(Map.of(
                    "tipo", "consulta",
                    "columnas", columnas,
                    "datos", resultados,
                    "tiempoEjecucion", executionTime + "ms",
                    "filasAfectadas", resultados.size()
                ));
                
            } else {
                // Procesar INSERT, UPDATE, DELETE, etc.
                int filasAfectadas = stmt.getUpdateCount();
                return ResponseEntity.ok(Map.of(
                    "tipo", "operacion",
                    "mensaje", "Operación completada",
                    "filasAfectadas", filasAfectadas,
                    "tiempoEjecucion", executionTime + "ms"
                ));
            }
            
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                        "tipo", "error",
                        "mensaje", "Error en la consulta SQL",
                        "detalle", e.getMessage(),
                        "codigoError", e.getErrorCode()
                    ));
        }
    }
}