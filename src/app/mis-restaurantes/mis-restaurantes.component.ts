import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Restaurante } from './restaurante.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { RestauranteService } from '../services/restaurante.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-restaurantes',
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './mis-restaurantes.component.html',
  styleUrl: './mis-restaurantes.component.css'
})
export class MisRestaurantesComponent {
  //Variables que usaré después
  restaurantes: Restaurante[] = [];
  usuario: any;
  id: any;
  mostrarFormulario = false;
  tiposRestaurante: string[] = ['Carne', 'Pescado', 'Mixto', 'Vegano'];
  imagenSeleccionada: File | null = null;
  formData = {
    usuario_id: '',
    nombreLocal: '',
    precioMedio: '',
    descripcion: '',
    localidad: '',
    ubicacion: '',
    tipoRest: ''
  };
  //Llamadas para consumir de diferentes librerias
  private restauranteService = inject(RestauranteService)

  //Función que se ejecuta al lanzarse el componente
  ngOnInit(): void {
    if (sessionStorage.getItem('usuario')) {
      this.usuario = this.recuperarUsuario();
      this.id = this.usuario.id;
      //Llamada al servicio para cargar el restaurante del usuario
      this.restauranteService.obtenerRestaurantesPorUsuario(this.id)
        .subscribe({
          next: (data) => this.restaurantes = data,
          error: (err) => console.error('Error al cargar restaurantes', err)
        });
    }
  }
  //Función que llama al servicio para crear restaurantes
  crearRestaurante(): void {
    console.log(this.formData);

    this.mostrarFormulario = false;
    this.restauranteService.crearRestaurante({
      usuario_id: this.id,
      nombreLocal: this.formData.nombreLocal,
      precioMedio: this.formData.precioMedio,
      descripcion: this.formData.descripcion,
      localidad: this.formData.localidad,
      ubicacion: this.formData.ubicacion,
      img: this.imagenSeleccionada,
      tipoRest: this.formData.tipoRest
    }).subscribe({
      next: (res) => {
        console.log('Restaurante creado:', res);
        // Lanza alert de confirmación
        Swal.fire({
          icon: 'success',
          title: 'Restaurante creado',
          text: res.message,
          timer: 1500
        });
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Error al crear restaurante:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || 'Error eliminando producto',
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
  //Función que cierra el modal de creación de restaurante
  cerrarModal(event: MouseEvent) {
    this.mostrarFormulario = false;
  }


}
