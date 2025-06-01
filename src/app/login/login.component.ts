import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Usuario } from '../usuario.model';
import { MainComponent } from '../main/main.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  usuario = new Usuario()
  showPassword = false;
  private router = inject(Router);
  private http = inject(HttpClient);
  private main = inject(MainComponent)
  login() {
    this.http.post('https://grubdashapi-production.up.railway.app/api/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        console.log('Login exitoso:', res);
        alert('¡Login exitoso!');
        this.usuario = res.user;
        const usuarioString = JSON.stringify(this.usuario);
        sessionStorage.setItem('usuario', usuarioString);
        this.main.ngOnInit()
        this.router.navigate(['/']);
        console.log('hoola');
      },
      error: (err) => {
        console.error('Error en el login:', err);
        if (err.status === 422) {
          alert('Errores de validación:\n' + JSON.stringify(err.error.errors, null, 2));
        } else if (err.status === 401) {
          alert('Credenciales inválidas');
        } else {
          alert('Error inesperado al iniciar sesión.');
        }
      }
    });
  }



  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}
