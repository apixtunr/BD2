import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QueryService {
  private apiUrl = 'http://localhost:8080/api/query'; // Cambia según tu backend

  constructor(private http: HttpClient) {}

  // query.service.ts
ejecutar(query: string): Observable<any> {
  const userData = JSON.parse(localStorage.getItem('mysql_user') || '{}');
  return this.http.post('http://localhost:8080/api/query', { 
    query,
    host: userData.host,  // Envía credenciales en cada petición (o usa JWT)
    username: userData.username
  });
}
}
