import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../producto/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'https://grubdashapi-production.up.railway.app/api';

  constructor(private http: HttpClient) {}

  obtenerProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/Dproducto/${id}`);
  }

  actualizarProducto(producto: Producto, imagen?: File): Observable<any> {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('nombreProducto', producto.nombreProducto || '');
    formData.append('precio', producto.precio != null ? producto.precio.toString() : '0');
    formData.append('descripcion', producto.descripcion || '');
    formData.append('tiempoPreparacion', producto.tiempoPreparacion || '');
    if (imagen) {
      formData.append('img', imagen);
    }
    return this.http.post(`${this.apiUrl}/productosUpdate/${producto.id}`, formData);
  }

   aniadirProductoAlPedido(productoId: number, usuarioId: number, cantidad = 1): Observable<any> {
    const url = `${this.apiUrl}/pedido`;
    const data = {
      producto_id: productoId,
      cantidad,
      usuario_id: usuarioId
    };
    return this.http.post(url, data);
  }

   eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/productos/${id}`);
  }
}
