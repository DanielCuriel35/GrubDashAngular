import { Component, inject, OnInit } from '@angular/core';
import { Pedido, PedidoService } from '../services/pedidos.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedidos-user',
  imports: [CommonModule, RouterModule],
  templateUrl: './pedidos-user.component.html',
  styleUrl: './pedidos-user.component.css'
})
export class PedidosUserComponent implements OnInit {
  //Variables que usaré después
  pedidos: Pedido[] = [];
  error: string = '';
  usuario: any;
  sessionId: string | null = null;

  //Llamadas para consumir de diferentes librerias
  private pedidosService = inject(PedidoService)
  private route = inject(ActivatedRoute)

  //Función que se ejecuta al lanzarse el componente
  ngOnInit(): void {
    this.usuario = this.recuperarUsuario()
    this.sessionId = this.route.snapshot.queryParamMap.get('session_id');

    if (this.sessionId) {
      this.guardarCarrito()
    }
    if (this.usuario != undefined) {
      //LLamo al servicio para obtener los pedidos de un usuario atraves de su id
      this.pedidosService.obtenerPedidosUser(this.usuario.id).subscribe({
        next: (data) => {
          this.pedidos = data;
        },
        error: (err) => {
          console.error('Error al cargar pedidos', err);
        }
      });
    }

  }
  guardarCarrito() {
    this.pedidosService.marcarPedidoComoPendiente(this.usuario.id).subscribe({
      next: (res: any) => {
        console.log('Estado cambiado:', res);
        // Lanza alert de confirmación
        Swal.fire({
          icon: 'success',
          title: 'Pedido actualizado',
          text: res.message,
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      },
      error: (err) => {
        console.error('Error al cambiar estado:', err);
        //Lanza alert de error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || 'Error al cambiar estado',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }

  //Función que sirve para recuperar el usuario del session storage
  recuperarUsuario(): any | null {
    const data = sessionStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }
  //Función que calcula el total de los pedidos
  totalPedido(pedido: any): number {
    if (!pedido.productos) return 0;
    return pedido.productos.reduce((total: number, producto: any) => {
      return total + (producto.cantidad * producto.precio_unitario);
    }, 0);
  }

}
