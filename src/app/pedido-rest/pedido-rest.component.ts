import { Component, inject } from '@angular/core';
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
  //Variables que usaré después
  pedidos: Pedido[] = [];
  error: string = '';
  usuario: any;
  //Llamadas para consumir de diferentes librerias
  private pedidosService = inject(PedidoService)

  //Función que se ejecuta al lanzarse el componente
  ngOnInit(): void {
    this.usuario = this.recuperarUsuario();
    //Llamo al servicio para obtener los pedidos del restaurante del usuario
    this.pedidosService.obtenerPedidosRest(this.usuario.restaurantes.id).subscribe({
      next: (data) => {
        this.pedidos = data;
      },
      error: (err) => {
        console.error('Error al cargar pedidos', err);
        //Lanza alert de error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los pedidos'
        });
      }
    });
  }
  //Funcion que sirve para recuperar el usuario del session storage
  recuperarUsuario(): any | null {
    const data = sessionStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }
  //Calcula el total del pedido
  totalPedido(pedido: any): number {
    if (!pedido.productos) return 0;
    return pedido.productos.reduce((total: number, producto: any) => {
      return total + (producto.cantidad * producto.precio_unitario);
    }, 0);
  }
  //Función que llama al servicio para actualizar el estado como enviado
  marcarComoEnviado(pedido: any) {
    //Alert de pregunta de confirmación
    Swal.fire({
      title: '¿Marcar pedido como enviado?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, marcar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        //Llamo al servicio para actualizar el estado
        this.pedidosService.actualizarEstado(pedido.id, 'enviado').subscribe({
          next: () => {
            pedido.estado = 'enviado';
            // Lanza alert de confirmación
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
            //Lanza alert de error
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
    //Alert de pregunta de confirmación
    Swal.fire({
      title: '¿Marcar pedido como entregado?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, marcar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.pedidosService.actualizarEstado(pedido.id, 'entregado').subscribe({
          next: () => {
            pedido.estado = 'entregado';
            // Lanza alert de confirmación
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
            //Lanza alert de error
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
