import { Component, OnInit } from '@angular/core';
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
  modoEdicion = false;
  usuario: any;
  restaurante: any;
  imagenSeleccionada: File | null = null;

  constructor(private authService: AuthService, private router: Router, private main: MainComponent) {}

  ngOnInit(): void {
    this.usuario = this.authService.obtenerUsuario();
    this.restaurante = this.usuario.restaurantes;
    console.log(this.restaurante);
  }

  actualizarUsuario(): void {
    this.authService.actualizarUsuario(this.usuario).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Datos actualizados',
          text: 'Datos actualizados con éxito',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
        sessionStorage.setItem('usuario', JSON.stringify(res.user));
        this.modoEdicion = false;
        this.main.ngOnInit();
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        console.error('Error al actualizar:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al actualizar',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }

  actualizarRestaurante(): void {
    this.authService.actualizarRestaurante(this.restaurante, this.imagenSeleccionada).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Restaurante actualizado',
          text: 'Restaurante actualizado con éxito',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
        this.router.navigate(['/mRestaurantes']);
      },
      error: (err) => {
        console.error('Error actualizando restaurante', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al actualizar restaurante',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }

  imgSel(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
    }
  }
}
