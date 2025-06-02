import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Restaurante } from './restaurante.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { RestauranteService } from '../services/restaurante.service';

@Component({
  selector: 'app-mis-restaurantes',
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './mis-restaurantes.component.html',
  styleUrl: './mis-restaurantes.component.css'
})
export class MisRestaurantesComponent {
  restaurantes: Restaurante[] = [];
  public usuario: any;
  id: any;
  mostrarFormulario = false;
  imagenSeleccionada: File | null = null;

  formData = {
    usuario_id: '',
    nombreLocal: '',
    precioMedio: '',
    descripcion: '',
    localidad: '',
    ubicacion: ''
  };

  constructor(private restauranteService: RestauranteService) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('usuario')) {
      this.usuario = this.recuperarUsuario();
      this.id = this.usuario.id;

      this.restauranteService.obtenerRestaurantesPorUsuario(this.id)
        .subscribe({
          next: (data) => this.restaurantes = data,
          error: (err) => console.error('Error al cargar restaurantes', err)
        });
    }
  }

  crearRestaurante(): void {
    this.mostrarFormulario = false;

    this.restauranteService.crearRestaurante({
      usuario_id: this.id,
      nombreLocal: this.formData.nombreLocal,
      precioMedio: this.formData.precioMedio,
      descripcion: this.formData.descripcion,
      localidad: this.formData.localidad,
      ubicacion: this.formData.ubicacion,
      img: this.imagenSeleccionada
    }).subscribe({
      next: (res) => {
        console.log('Restaurante creado:', res);
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Error al crear restaurante:', err);
      }
    });
  }


  recuperarUsuario(): any | null {
    const data = sessionStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  imgSel(event: any): void {
    const file = event.target.files?.[0];
    this.imagenSeleccionada = file || null;
  }

  cerrarModal(event: MouseEvent) {
    this.mostrarFormulario = false;
  }


}
