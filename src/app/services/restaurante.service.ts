import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restaurante } from '../restaurantes/restaurante.model';
import { Producto } from '../producto/producto.model';
import { Ingrediente } from '../producto/ingrediente.model';
import { subirImagenCloudinary } from './cloudinary.service';

@Injectable({
  providedIn: 'root'
})
export class RestauranteService {
  //Ruta de mi api
  private apiUrl = 'https://grubdashapi-production.up.railway.app/api';
  //Libreria de http
  private http = inject(HttpClient)

  obtenerRestaurantesPorLocalidad(localidad: string): Observable<Restaurante[]> {
    return this.http.get<Restaurante[]>(`${this.apiUrl}/restaurantes/${localidad}`);
  }

  obtenerProductosPorRestaurante(restauranteId: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos/${restauranteId}`);
  }

  obtenerRestaurantesPorUsuario(usuarioId: string | number): Observable<Restaurante[]> {
    return this.http.get<Restaurante[]>(`${this.apiUrl}/restaurantesU/${usuarioId}`);
  }

  crearRestaurante(data: {
    usuario_id: string | number;
    nombreLocal: string;
    precioMedio: string;
    descripcion: string;
    localidad: string;
    ubicacion: string;
    img?: File | null;
  }): Observable<any> {
    return new Observable(observer => {
      const continuar = (imageUrl: string | null) => {
        const body: any = {
          usuario_id: data.usuario_id,
          nombreLocal: data.nombreLocal || '',
          precioMedio: data.precioMedio || '',
          descripcion: data.descripcion || '',
          localidad: data.localidad || '',
          ubicacion: data.ubicacion || ''
        };

        if (imageUrl) {
          body.img = imageUrl;
        }

        this.http.post(`${this.apiUrl}/restaurante`, body).subscribe({
          next: res => observer.next(res),
          error: err => observer.error(err),
          complete: () => observer.complete()
        });
      };

      if (data.img) {
        subirImagenCloudinary(data.img, 'restaurante')
          .then(url => continuar(url))
          .catch(err => observer.error(err));
      } else {
        continuar(null);
      }
    });
  }

  crearProducto(data: {
    restaurante_id: string;
    nombreProducto: string;
    precio: string;
    descripcion: string;
    tiempoPreparacion: string;
    img?: File | null;
    ingredientes: Ingrediente[];
  }): Observable<any> {
    return new Observable(observer => {
      const continuar = (imageUrl: string | null) => {
        const body: any = {
          restaurante_id: data.restaurante_id,
          nombreProducto: data.nombreProducto,
          precio: data.precio,
          descripcion: data.descripcion,
          tiempoPreparacion: data.tiempoPreparacion,
          ingredientes: data.ingredientes.map(i => i.id)
        };

        if (imageUrl) {
          body.img = imageUrl;
        }

        this.http.post(`${this.apiUrl}/producto`, body).subscribe({
          next: res => observer.next(res),
          error: err => observer.error(err),
          complete: () => observer.complete()
        });
      };

      if (data.img) {
        subirImagenCloudinary(data.img, 'producto')
          .then(url => continuar(url))
          .catch(err => observer.error(err));
      } else {
        continuar(null);
      }
    });
  }

  obtenerIngredientes(): Observable<Ingrediente[]> {
    return this.http.get<Ingrediente[]>(`${this.apiUrl}/ingredientes`);
  }

  crearIngrediente(ingrediente: Partial<Ingrediente>): Observable<{ message: string, data: Ingrediente }> {
    return this.http.post<{ message: string, data: Ingrediente }>(`${this.apiUrl}/ingrediente`, ingrediente);
  }
}
