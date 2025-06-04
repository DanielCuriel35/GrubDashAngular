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
   //Variables que usaré después
  email = '';
  password = '';
  verPassword = false;
  //Llamadas para consumir de diferentes librerias
  private authService = inject(AuthService);
  private router = inject(Router);
  private main = inject(MainComponent);
  //Función que comprueba el login
  login() {
    //Llamada al servicio de login
    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        console.log('Login exitoso:', res);

        if (res.access_token) {
          //Guardamos el token para la autentificación
          sessionStorage.setItem('token', res.access_token);
          console.log(sessionStorage.getItem('token'));

        }
        // Lanza alert de confirmación
        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: 'Has iniciado sesión correctamente.',
          timer: 2000,
          showConfirmButton: false
        });
        //Llamada para guardar el usuario en el storage
        const usuario: Usuario = res.user;
        this.authService.guardarUsuario(usuario);
        //Redirige a inicio
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error en el login:', err);
        if (err.status === 422) {
          //Lanza alert de error de validaciones
          Swal.fire({
            icon: 'error',
            title: 'Error de validación',
            html: `<pre style="text-align:left">${JSON.stringify(err.error.errors, null, 2)}</pre>`,
          });
        } else if (err.status === 401) {
          //Lanza alert de error de credenciales
          Swal.fire({
            icon: 'error',
            title: 'Credenciales inválidas',
            text: 'Por favor verifica tu correo y contraseña.'
          });
        } else {
          //Lanza alert de error inesperado
          Swal.fire({
            icon: 'error',
            title: 'Error inesperado',
            text: 'No se pudo iniciar sesión. Inténtalo más tarde.'
          });
        }
      }
    });
  }

  //Función que cambia la visibilidad de la password
  cambiarVisibilidadPassword() {
    this.verPassword = !this.verPassword;
  }
}
