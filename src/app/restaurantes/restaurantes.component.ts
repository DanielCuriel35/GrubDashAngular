import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Restaurante } from './restaurante.model';
import { RestauranteService } from '../services/restaurante.service';

@Component({
  selector: 'app-restaurantes',
  imports: [CommonModule, RouterModule],
  templateUrl: './restaurantes.component.html',
  styleUrl: './restaurantes.component.css'
})
export class RestaurantesComponent implements OnInit {
  private restauranteService = inject(RestauranteService);
  restaurantes: Restaurante[] = [];
  usuario: any;
  localidad: string | undefined;

  ngOnInit(): void {
    this.usuario = this.recuperarUsuario();
    this.localidad = this.usuario?.localidad;

    if (this.localidad) {
      this.restauranteService.obtenerRestaurantesPorLocalidad(this.localidad).subscribe({
        next: (data) => (this.restaurantes = data),
        error: (err) => console.error('Error al cargar restaurantes', err)
      });
    } else {
      console.warn('No se encontró localidad para el usuario');
      this.restaurantes = [];
    }
  }

  recuperarUsuario(): any | null {
    const data = sessionStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }
}
