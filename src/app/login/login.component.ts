import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Usuario } from '../usuario.model';
import { AuthService } from '../services/auth.service';
import { MainComponent } from '../main/main.component';
import Swal from 'sweetalert2';

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
  showPassword = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private main = inject(MainComponent);

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        console.log('Login exitoso:', res);

        if (res.access_token) {
          sessionStorage.setItem('token', res.access_token);
          console.log(sessionStorage.getItem('token'));

        }

        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: 'Has iniciado sesión correctamente.',
          timer: 2000,
          showConfirmButton: false
        });

        const usuario: Usuario = res.user;
        this.authService.guardarUsuario(usuario);

        this.main.ngOnInit();
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error en el login:', err);
        if (err.status === 422) {
          Swal.fire({
            icon: 'error',
            title: 'Error de validación',
            html: `<pre style="text-align:left">${JSON.stringify(err.error.errors, null, 2)}</pre>`,
          });
        } else if (err.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'Credenciales inválidas',
            text: 'Por favor verifica tu correo y contraseña.'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error inesperado',
            text: 'No se pudo iniciar sesión. Inténtalo más tarde.'
          });
        }
      }
    });
  }


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
