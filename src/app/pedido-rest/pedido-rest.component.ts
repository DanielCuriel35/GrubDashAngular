import { Component } from '@angular/core';
import { Pedido, PedidoService } from '../services/pedidos.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedido-rest',
  imports: [CommonModule, RouterModule],
  templateUrl: './pedido-rest.component.html',
  styleUrl: './pedido-rest.component.css'
})
export class PedidoRestComponent {
  pedidos: Pedido[] = [];
  error: string = '';
  usuario: any;

  constructor(private servicio: PedidoService) {}

  ngOnInit(): void {
    this.usuario = this.recuperarUsuario();
    this.servicio.obtenerPedidosRest(this.usuario.restaurantes.id).subscribe({
      next: (data) => {
        this.pedidos = data;
        console.log(this.pedidos);
      },
      error: (err) => {
        console.error('Error al cargar pedidos', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los pedidos'
        });
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
    Swal.fire({
      title: '¿Marcar pedido como enviado?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, marcar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.servicio.actualizarEstado(pedido.id, 'enviado').subscribe({
          next: () => {
            pedido.estado = 'enviado';
            Swal.fire({
              icon: 'success',
              title: 'Actualizado',
              text: 'El pedido fue marcado como enviado',
              timer: 1500,
              showConfirmButton: false,
              toast: true,
              position: 'top-end'
            });
          },
          error: (err) => {
            console.error('Error al actualizar estado:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo actualizar el estado del pedido'
            });
          }
        });
      }
    });
  }

  marcarComoEntregado(pedido: any) {
    Swal.fire({
      title: '¿Marcar pedido como entregado?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, marcar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.servicio.actualizarEstado(pedido.id, 'entregado').subscribe({
          next: () => {
            pedido.estado = 'entregado';
            Swal.fire({
              icon: 'success',
              title: 'Actualizado',
              text: 'El pedido fue marcado como entregado',
              timer: 1500,
              showConfirmButton: false,
              toast: true,
              position: 'top-end'
            });
          },
          error: (err) => {
            console.error('Error al actualizar estado:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo actualizar el estado del pedido'
            });
          }
        });
      }
    });
  }
}
