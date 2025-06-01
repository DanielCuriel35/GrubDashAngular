import { Component } from '@angular/core';
import { Pedido, ServicioService } from '../servicios.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pedido-rest',
  imports: [CommonModule,RouterModule],
  templateUrl: './pedido-rest.component.html',
  styleUrl: './pedido-rest.component.css'
})
export class PedidoRestComponent {
  pedidos: Pedido[] = [];
  error: string = '';
  usuario: any;
  constructor(private servicio: ServicioService) { }

  ngOnInit(): void {
    this.usuario = this.recuperarUsuario()
    this.servicio.obtenerPedidosRest(this.usuario.restaurante.id).subscribe({
      next: (data) => {
        this.pedidos = data;
        console.log(this.pedidos);

      },
      error: (err) => {
        console.error('Error al cargar pedidos', err);
        this.error = 'No se pudieron cargar los pedidos';
      }
    });
  }

  recuperarUsuario(): any | null {
    const data = sessionStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  getTotalPedido(pedido: any): number {
    if (!pedido.productos) return 0;
    return pedido.productos.reduce((total: number, producto: any) => {
      return total + (producto.cantidad * producto.precio_unitario);
    }, 0);
  }

  marcarComoEnviado(pedido: any) {
  this.servicio.actualizarEstado(pedido.id, 'enviado').subscribe({
    next: (response) => {
      pedido.estado = 'enviado'; 
    },
    error: (err) => {
      console.error('Error al actualizar estado:', err);
    }
  });
}

marcarComoEntregado(pedido: any) {
  this.servicio.actualizarEstado(pedido.id, 'entregado').subscribe({
    next: (response) => {
      pedido.estado = 'entregado';
    },
    error: (err) => {
      console.error('Error al actualizar estado:', err);
    }
  });
}

}
