import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {}

 // En login.service.ts
login(loginData: any): Observable<any> {
  return this.http.post('http://localhost:8080/api/login', loginData).pipe(
    tap((response: any) => {
      localStorage.setItem('mysql_user', JSON.stringify(loginData)); // Guarda credenciales
    })
  );
}
}
