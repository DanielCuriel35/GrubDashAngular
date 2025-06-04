import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { MainComponent } from '../main/main.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  //Variables que usaré después
  modoEdicion = false;
  usuario: any;
  restaurante: any;
  imagenSeleccionada: File | null = null;
  tiposRestaurante: string[] = ['Carne', 'Pescado', 'Mixto', 'Vegano'];


  //Llamadas para consumir de diferentes librerias
  private authService = inject(AuthService)
  private router = inject(Router)
  private main = inject(MainComponent)

  //Función que se ejecuta al lanzarse el componente
  ngOnInit(): void {
    this.usuario = this.recuperarUsuario;
    this.restaurante = this.usuario.restaurantes;
  }
  //Función que llama al servicio para actualizar un usuario
  actualizarUsuario(): void {
    this.authService.actualizarUsuario(this.usuario).subscribe({
      next: (res: any) => {
        // Lanza alert de confirmación
        Swal.fire({
          icon: 'success',
          title: 'Datos actualizados',
          text: 'Datos actualizados con éxito',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
        //Almacena el usuario modificado en el storage
        sessionStorage.setItem('usuario', JSON.stringify(res.user));
        this.modoEdicion = false;
        //Recarga la barra de navegación
        this.main.ngOnInit();
        //Te redirige a inicio
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        console.error('Error al actualizar:', err);
        //Lanza alert de error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al actualizar',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }
  //Función que llama al servicio para modificar el restaurante del usuario
  actualizarRestaurante(): void {
    this.authService.actualizarRestaurante(this.restaurante, this.imagenSeleccionada).subscribe({
      next: (res) => {
        // Lanza alert de confirmación
        Swal.fire({
          icon: 'success',
          title: 'Restaurante actualizado',
          text: 'Restaurante actualizado con éxito',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
        //Te redirige a la pagina de tu restaurante
        this.router.navigate(['/mRestaurantes']);
      },
      error: (err) => {
        console.error('Error actualizando restaurante', err);
        //Lanza alert de error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al actualizar restaurante',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }
  //Funcion que sirve para recuperar el usuario del session storage
  recuperarUsuario(): any | null {
    const data = sessionStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  imgSel(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imagenSeleccionada = file;
    }
  }
}
