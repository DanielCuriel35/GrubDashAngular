import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PedidoService, Producto } from '../services/pedidos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {
  usuario: any;
  productos: Producto[] = [];
  total: number = 0;

  constructor(private pedidosService: PedidoService) {}

  ngOnInit(): void {
    this.usuario = this.recuperarUsuario();
    if (this.usuario) {
      this.cargarPedido();
    }
  }

  recuperarUsuario(): any | null {
    const data = sessionStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  cargarPedido() {
    this.pedidosService.obtenerCarrito(this.usuario.id).subscribe({
      next: (pedido) => {
        this.productos = pedido.productos;
        if (this.productos.length > 0) {
          console.log(this.productos[0].img);
        }
        this.calcularTotal();
      }
    });
  }

  calcularTotal() {
    this.total = this.productos.reduce((acc, p) => acc + p.precio_unitario * p.cantidad, 0);
  }

  eliminarProducto(productoId: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este producto será eliminado de tu carrito.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productos = this.productos.filter(p => p.id !== productoId);
        this.calcularTotal();

        this.pedidosService.eliminarProductoDelPedido(this.usuario.id, productoId).subscribe({
          next: (res: any) => {
            console.log('Producto eliminado:', res);
            Swal.fire({
              icon: 'success',
              title: 'Producto eliminado',
              text: res.message,
              timer: 1500,
              showConfirmButton: false,
              toast: true,
              position: 'top-end'
            });
          },
          error: (err) => {
            console.error('Error eliminando producto:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: err.error?.message || 'Error eliminando producto',
              confirmButtonText: 'Cerrar'
            });
          }
        });
      }
    });
  }

  pago() {
    Swal.fire({
      title: 'Confirmar pago',
      text: '¿Quieres marcar el pedido como pendiente para proceder con el pago?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pedidosService.marcarPedidoComoPendiente(this.usuario.id).subscribe({
          next: (res: any) => {
            console.log('Estado cambiado:', res);
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
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: err.error?.message || 'Error al cambiar estado',
              confirmButtonText: 'Cerrar'
            });
          }
        });
      }
    });
  }
}
