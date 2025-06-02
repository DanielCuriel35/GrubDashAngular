import { Component, OnInit } from '@angular/core';
import { Pedido, PedidoService } from '../services/pedidos.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-pedidos-user',
  imports: [CommonModule, RouterModule],
  templateUrl: './pedidos-user.component.html',
  styleUrl: './pedidos-user.component.css'
})
export class PedidosUserComponent implements OnInit {
  pedidos: Pedido[] = [];
  error: string = '';
  usuario: any;
  constructor(private servicio: PedidoService) { }

  ngOnInit(): void {
    this.usuario = this.recuperarUsuario()
    if (this.usuario != undefined) {
      this.servicio.obtenerPedidosUser(this.usuario.id).subscribe({
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

}
