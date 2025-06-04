import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Restaurante } from './restaurante.model';
import { RestauranteService } from '../services/restaurante.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-restaurantes',
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './restaurantes.component.html',
  styleUrl: './restaurantes.component.css'
})
export class RestaurantesComponent implements OnInit {
  //Variables que usaré después
  filtroTipo: string = '';
  restaurantes: Restaurante[] = [];
  restaurantesFiltrados: any[] = [];
  usuario: any;
  localidad!: string;
  //Llamadas para consumir de diferentes librerias
  private restauranteService = inject(RestauranteService);
  //Función que se ejecuta al lanzarse el componente
  ngOnInit(): void {
    this.usuario = this.recuperarUsuario();
    if (this.usuario) {
    this.localidad = this.usuario.localidad;
    }
    //Llamo al servicio para obtener los restaurantes de la localidad del usuario
    this.restauranteService.obtenerRestaurantesPorLocalidad(this.localidad).subscribe({
      next: (data) => (this.restaurantes = data, this.restaurantesFiltrados = data),
      error: (err) => console.error('Error al cargar restaurantes', err)
    });

  }
  //Funcion que sirve para recuperar el usuario del session storage
  recuperarUsuario(): any | null {
    const data = sessionStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }
  //Función que filtra los restaurantes en base a su tipo de comida
  filtrarRestaurantes() {
    if (this.filtroTipo) {
      this.restaurantesFiltrados = this.restaurantes.filter(r => r.tipoRest === this.filtroTipo);
    } else {
      this.restaurantesFiltrados = this.restaurantes;
    }
  }
}
