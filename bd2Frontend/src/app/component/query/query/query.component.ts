import { Component } from '@angular/core';
import { QueryService } from '../../../service/query.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent {
  currentUser: any;
  queryText: string = '';
  resultado: any;
  logs: any[] = [];

  constructor(
    private queryService: QueryService,
    private router: Router
  ) {
    const userData = localStorage.getItem('currentUser');
    this.currentUser = userData ? JSON.parse(userData) : null;
  }

  ejecutarConsulta() {
    if (!this.queryText.trim()) {
        this.agregarLog('error', 'La consulta no puede estar vacía');
        return;
    }

    const consulta = this.queryText.trim().toUpperCase();
    this.agregarLog('info', `Ejecutando: ${consulta.substring(0, 50)}${consulta.length > 50 ? '...' : ''}`);

    this.queryService.ejecutar(consulta).subscribe({
        next: (respuesta: any) => {
            if (respuesta.tipo === 'consulta') {
                // Manejo de resultados SELECT
                this.resultado = {
                    tipo: 'tabla',
                    columnas: respuesta.columnas || [],
                    datos: respuesta.datos || [],
                    mensaje: respuesta.datos.length === 0 ? 'La consulta no devolvió registros' : ''
                };
                
                this.agregarLog('success', 
                    respuesta.datos.length === 0 ? 'Consulta ejecutada (0 registros)' : 'Consulta ejecutada',
                    respuesta.datos.length);
            } else {
                // Manejo de INSERT, UPDATE, DELETE, etc.
                this.resultado = {
                    tipo: 'mensaje',
                    mensaje: respuesta.mensaje
                };
                this.agregarLog('success', respuesta.mensaje, respuesta.filasAfectadas);
            }
        },
        error: (error) => {
            this.agregarLog('error', error.error?.mensaje || 'Error en la consulta');
            this.resultado = {
                tipo: 'mensaje',
                mensaje: error.error?.mensaje || 'Error en la consulta'
            };
        }
    });
}

  limpiarTodo() {
    this.queryText = '';
    this.resultado = null;
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  private agregarLog(tipo: string, mensaje: string, filasAfectadas?: number) {
    this.logs.unshift({
      timestamp: new Date(),
      tipo: tipo,
      mensaje: mensaje,
      filasAfectadas: filasAfectadas
    });
    
    // Mantener un máximo de 50 logs
    if (this.logs.length > 50) {
      this.logs.pop();
    }
  }
}