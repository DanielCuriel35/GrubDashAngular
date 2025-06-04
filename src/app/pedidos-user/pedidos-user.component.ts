import { Component, inject, OnInit } from '@angular/core';
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
  //Variables que usaré después
  pedidos: Pedido[] = [];
  error: string = '';
  usuario: any;

  //Llamadas para consumir de diferentes librerias
  private pedidosService = inject(PedidoService)

  //Función que se ejecuta al lanzarse el componente
  ngOnInit(): void {
    this.usuario = this.recuperarUsuario()
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
