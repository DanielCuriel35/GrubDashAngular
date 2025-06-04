import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//Interfaces que son usadas para enviar y recibir datos de la api
export interface Producto {
  id: number;
  nombre: string;
  img:File;
  cantidad: number;
  precio_unitario: number;
}


export interface Restaurante {
  id: number;
  nombre: string;
}


export interface Pedido {
  id: number;
  usuario_id: number;
  fecha_pedido: string;
  estado: string;
  restaurante: Restaurante;
  productos: Producto[];
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  //Ruta de mi api
  private apiUrl = 'https://grubdashapi-production.up.railway.app/api';
  //Libreria de http
  private http = inject(HttpClient)

  obtenerPedidosUser(usuarioId: number): Observable<Pedido[]> {
    const url = `${this.apiUrl}/pedidos/${usuarioId}`;
    return this.http.get<Pedido[]>(url);
  }
  obtenerPedidosRest(restauranteId: number): Observable<Pedido[]> {
    const url = `${this.apiUrl}/pedidosR/${restauranteId}`;
    return this.http.get<Pedido[]>(url);
  }

  actualizarEstado(pedidoId: number, nuevoEstado: string) {
    return this.http.put(`${this.apiUrl}/pedidos/${pedidoId}/estado`, { estado: nuevoEstado });
  }

  obtenerCarrito(usuarioId: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrl}/pedidosC/${usuarioId}`);
  }

  eliminarProductoDelPedido(usuarioId: number, productoId: number) {
    return this.http.post(`${this.apiUrl}/pedidosE`, {
      usuario_id: usuarioId,
      producto_id: productoId
    });
  }

  marcarPedidoComoPendiente(usuarioId: number) {
    return this.http.post(`${this.apiUrl}/pedidoP`, {
      usuario_id: usuarioId
    });
  }

}
