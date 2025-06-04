import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
declare var bootstrap: any;
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  //Variables que usaré después
  verPassword = false;
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
  //Llamadas para consumir de diferentes librerias
  private authService = inject(AuthService);
  private router = inject(Router);
  //Función que se ejecuta al lanzarse el componente
  onSubmit() {
    //Llama al servicio para registrar un nuevo usuario
    this.authService.registrar(this.usuario).subscribe({
      next: (res: any) => {
        console.log('Registro exitoso:', res);
        // Lanza alert de confirmación
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          timer: 1500,
          showConfirmButton: false,
        });
        //Te redirige a login
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        if (err.status === 422) {
          //Lanza alert de errores de validación
          Swal.fire({
            icon: 'error',
            title: 'Errores de validación',
            html: this.formatearErrores(err.error.errors),
          });
        } else {
          //Lanza alert de errores inesperados
          Swal.fire({
            icon: 'error',
            title: 'Error inesperado',
            text: 'Error inesperado al registrar usuario.',
          });
        }
      }
    });
  }
  //Función que formatea los errores que manda el backend
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
  //Función que cambia la visibilidad de la password
  cambiarVisibilidadPassword() {
    this.verPassword = !this.verPassword;
  }

  //Función que da funcionamiento al tooltip de la contraseña
  ngAfterViewInit(): void {
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
}
