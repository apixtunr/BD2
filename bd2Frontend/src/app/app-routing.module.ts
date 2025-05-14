import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// Importa los componentes usados en las rutas
import { LoginComponent } from './component/login/login.component';
import { QueryComponent } from './component/query/query/query.component';

const routes: Routes = [
  {
    path: "login", component: LoginComponent  // Ruta para el login
  },
  {
path: "query", component: QueryComponent // Ruta para la consulta
  },
  {
    path: "", redirectTo: "login", pathMatch: "full" // Redirige la raíz a login
  },
  {
    path: "**", redirectTo: "login", pathMatch: "full" // Ruta wildcard para errores
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), HttpClientModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
