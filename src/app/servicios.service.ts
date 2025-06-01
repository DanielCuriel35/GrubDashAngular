import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  id:number;
  nombre: string;
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
export class ServicioService {
  private apiUrl = 'http://localhost/Apis/GrubDashApi/public/api/pedidos';

  constructor(private http: HttpClient) { }

  obtenerPedidosUser(usuarioId: number): Observable<Pedido[]> {
    const url = `${this.apiUrl}/${usuarioId}`;
    return this.http.get<Pedido[]>(url);
  }
  obtenerPedidosRest(restauranteId: number): Observable<Pedido[]> {
    const url = `${this.apiUrl}R/${restauranteId}`;
    return this.http.get<Pedido[]>(url);
  }

  actualizarEstado(pedidoId: number, nuevoEstado: string) {
  return this.http.put(`${this.apiUrl}/${pedidoId}/estado`, { estado: nuevoEstado });
}
}
