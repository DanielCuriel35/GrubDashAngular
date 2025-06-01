import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

export interface Restaurante {
  id: number;
  nombre: string;
}

export interface Producto {
  id: number;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  img:string;
}

export interface Pedido {
  id: number;
  estado: string;
  fecha_pedido: string;
  productos: Producto[];
  restaurante: Restaurante;
}
@Component({
  selector: 'app-carrito',
  imports: [RouterModule, CommonModule,FormsModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {

  usuario: any;
  ngOnInit(): void {
    this.usuario = this.recuperarUsuario()
        if (this.usuario) {
      this.cargarPedido();
    }
  }
  recuperarUsuario(): any | null {
    const data = sessionStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }
  productos: Producto[] = [];
  total: number = 0;

  private apiUrl = 'https://grubdashapi-production.up.railway.app/api/pedidosC';

  constructor(private http: HttpClient) { }


  cargarPedido() {
    this.http.get<Pedido>(`${this.apiUrl}/${this.usuario.id}`).subscribe({
      next: (pedido) => {
        this.productos = pedido.productos;
        console.log(this.productos[0].img);
        this.calcularTotal();
      },
      error: (error) => {
        console.error('Error cargando pedido:', error);
      }
    });
  }

  calcularTotal() {
    this.total = this.productos.reduce((acc, p) => acc + p.precio_unitario * p.cantidad, 0);
  }

  eliminarProducto(productoId: number) {
    this.productos = this.productos.filter(p => p.id !== productoId);
    this.calcularTotal();
  }
}
