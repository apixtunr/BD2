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
  resultados: any[] = [];

  constructor(
    private queryService: QueryService,
    private router: Router
  ) {
    const userData = localStorage.getItem('currentUser');
    this.currentUser = userData ? JSON.parse(userData) : null;
  }

ejecutarConsulta(queryInput?: HTMLTextAreaElement) {
  let consultaSeleccionada = '';

  if (queryInput && queryInput.selectionStart !== queryInput.selectionEnd) {
    consultaSeleccionada = queryInput.value.substring(queryInput.selectionStart, queryInput.selectionEnd).trim();
  }

  const textoAEjecutar = consultaSeleccionada || this.queryText;
  

  if (!textoAEjecutar.trim()) {
    this.agregarLog('error', 'La consulta no puede estar vacía');
    return;
  }

  // Detectar bloque de transacción
  const texto = textoAEjecutar.trim().toUpperCase().replace(/\s+/g, ' ');
  const esTransaccion =
  texto.startsWith('START TRANSACTION') &&
  (texto.includes('COMMIT') || texto.includes('ROLLBACK'));

  if (esTransaccion) {
    const queries = textoAEjecutar
  .split(';')
  .map(q => q.trim())
  .filter(q =>
    q.length > 0 &&
    q.toUpperCase() !== 'START TRANSACTION' &&
    !/^COMMIT\s*$/i.test(q) // Elimina "COMMIT", "COMMIT ", "COMMIT\n", etc.
  );

    this.queryService.ejecutarTransaccion(queries).subscribe({
      next: (respuesta: any) => {
        this.resultado = {
          tipo: respuesta.tipo === 'transaccion' ? 'mensaje' : respuesta.tipo,
          mensaje: respuesta.mensaje
        };
        this.agregarLog('success', respuesta.mensaje);
      },
      error: (error) => {
        this.resultado = {
          tipo: 'mensaje',
          mensaje: error.error?.mensaje || 'Error en la transacción'
        };
        this.agregarLog('error', error.error?.mensaje || 'Error en la transacción');
      }
    });
    return;
  }

  const consultas = textoAEjecutar
    .split(';')
    .map(q => q.trim())
    .filter(q => q.length > 0);

  if (consultas.length === 0) {
    this.agregarLog('error', 'No se encontraron consultas válidas');
    return;
  }

  this.resultados = [];
  this.resultado = null;

  const ejecutarSecuencial = (index: number) => {
    if (index >= consultas.length) return;

    const consulta = consultas[index];
    this.agregarLog('info', `Ejecutando: ${consulta.substring(0, 50)}${consulta.length > 50 ? '...' : ''}`);

    this.queryService.ejecutar(consulta).subscribe({
      next: (respuesta: any) => {
        let res;
        if (respuesta.tipo === 'consulta') {
          res = {
            tipo: 'tabla',
            columnas: respuesta.columnas || [],
            datos: respuesta.datos || [],
            mensaje: respuesta.datos.length === 0 ? 'La consulta no devolvió registros' : ''
          };
          this.agregarLog('success',
            respuesta.datos.length === 0 ? 'Consulta ejecutada (0 registros)' : 'Consulta ejecutada',
            respuesta.datos.length);
        } else {
          res = {
            tipo: 'mensaje',
            mensaje: respuesta.mensaje
          };
          this.agregarLog('success', respuesta.mensaje, respuesta.filasAfectadas);
        }
        this.resultados.push(res);
        if (index === consultas.length - 1) {
          this.resultado = res;
        }
        ejecutarSecuencial(index + 1);
      },
      error: (error) => {
        this.agregarLog('error', error.error?.mensaje || 'Error en la consulta');
        const res = {
          tipo: 'mensaje',
          mensaje: error.error?.mensaje || 'Error en la consulta'
        };
        this.resultados.push(res);
        if (index === consultas.length - 1) {
          this.resultado = res;
        }
        ejecutarSecuencial(index + 1);
      }
    });
  };

  ejecutarSecuencial(0);
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