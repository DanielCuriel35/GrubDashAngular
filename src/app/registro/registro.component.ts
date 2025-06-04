import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  showPassword = false;
  usuario = {
    nombre: '',
    apellido: '',
    fecha_nac: '',
    username: '',
    localidad: '',
    direccion: '',
    email: '',
    password: '',
    restaurante: false
  };

  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit() {
    this.authService.registrar(this.usuario).subscribe({
      next: (res: any) => {
        console.log('Registro exitoso:', res);
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          timer: 1500,
          showConfirmButton: false,
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        if (err.status === 422) {
          Swal.fire({
            icon: 'error',
            title: 'Errores de validación',
            html: this.formatearErrores(err.error.errors),
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error inesperado',
            text: 'Error inesperado al registrar usuario.',
          });
        }
      }
    });
  }
  private formatearErrores(errores: any): string {
    let mensaje = '<ul style="text-align:left;">';
    for (const campo in errores) {
      if (errores.hasOwnProperty(campo)) {
        errores[campo].forEach((error: string) => {
          mensaje += `<li>${error}</li>`;
        });
      }
    }
    mensaje += '</ul>';
    return mensaje;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
