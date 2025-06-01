import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Restaurante } from './restaurante.model';
@Component({
  selector: 'app-restaurantes',
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './restaurantes.component.html',
  styleUrl: './restaurantes.component.css'
})

export class RestaurantesComponent implements OnInit {
  private http = inject(HttpClient);
  restaurantes: Restaurante[] = [];
  public usuario :any;
  localidad:any;
  ngOnInit(): void{
    if (sessionStorage.getItem('usuario')) {
      this.usuario=this.recuperarUsuario()
      this.localidad=this.usuario.localidad
    }

    this.http.get<Restaurante[]>('https://grubdashapi-production.up.railway.app/api/restaurantes/'+this.localidad)
      .subscribe({
        next: (data) => this.restaurantes = data,
        error: (err) => console.error('Error al cargar restaurantes', err)
      });
  }

  recuperarUsuario() :any|null{
      const data = sessionStorage.getItem('usuario');
      return data ? JSON.parse(data) : null;
  }

}
