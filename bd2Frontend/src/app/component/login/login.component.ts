import { Component } from '@angular/core';
import { LoginService } from '../../service/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    host: 'localhost',
    port: '3306',
    username: '',
    password: ''
  };

  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  login() {
    if (!this.loginData.host || !this.loginData.port || 
        !this.loginData.username || !this.loginData.password) {
      this.errorMessage = 'Todos los campos son requeridos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.loginService.login(this.loginData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/query']);
        localStorage.setItem('currentUser', JSON.stringify(this.loginData));
        this.router.navigate(['/query']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error("Error en login:", error);
        this.errorMessage = error.error?.mensaje || 
          'Error de conexión. Verifica tus credenciales y el servidor.';
      }
    });
  }
}