import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restaurante } from '../restaurantes/restaurante.model';
import { Producto } from '../producto/producto.model';
import { Ingrediente } from '../producto/ingrediente.model';

@Injectable({
  providedIn: 'root'
})
export class RestauranteService {
  private apiUrl = 'https://grubdashapi-production.up.railway.app/api';

  constructor(private http: HttpClient) { }

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
    const formData = new FormData();
    formData.append('usuario_id', data.usuario_id.toString());
    formData.append('nombreLocal', data.nombreLocal || '');
    formData.append('precioMedio', data.precioMedio || '');
    formData.append('descripcion', data.descripcion || '');
    formData.append('localidad', data.localidad || '');
    formData.append('ubicacion', data.ubicacion || '');

    if (data.img) {
      formData.append('img', data.img);
    }

    return this.http.post(`${this.apiUrl}/restaurante`, formData);
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
    const formData = new FormData();
    formData.append('restaurante_id', data.restaurante_id);
    formData.append('nombreProducto', data.nombreProducto);
    formData.append('precio', data.precio);
    formData.append('descripcion', data.descripcion);
    formData.append('tiempoPreparacion', data.tiempoPreparacion);

    if (data.img) {
      formData.append('img', data.img);
    }

    data.ingredientes.forEach((ingrediente, index) => {
      formData.append(`ingredientes[${index}]`, ingrediente.id.toString());
    });

    return this.http.post(`${this.apiUrl}/producto`, formData);
  }

  obtenerIngredientes(): Observable<Ingrediente[]> {
    return this.http.get<Ingrediente[]>(`${this.apiUrl}/ingredientes`);
  }

  crearIngrediente(ingrediente: Partial<Ingrediente>): Observable<{ message: string, data: Ingrediente }> {
    return this.http.post<{ message: string, data: Ingrediente }>(`${this.apiUrl}/ingrediente`, ingrediente);
  }
}
