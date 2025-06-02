import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Producto } from './producto.model';
import { ProductoService } from '../services/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productoService = inject(ProductoService);

  producto!: Producto;
  usuario: any;

  ngOnInit(): void {
    this.usuario = this.recuperarUsuario();
    const idProducto = this.route.snapshot.paramMap.get('producto_id');
    if (idProducto) {
      this.cargarProducto(Number(idProducto));
    }
  }

  cargarProducto(id: number) {
    this.productoService.obtenerProducto(id).subscribe({
      next: (data) => {
        this.producto = data;
        console.log(this.producto);
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar el producto',
          text: 'No se pudo obtener la información del producto. Por favor, intenta nuevamente.',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }

  aniadirProducto() {
    if (!this.usuario) {
      Swal.fire({
        icon: 'warning',
        title: 'No autenticado',
        text: 'Debes iniciar sesión para añadir productos al pedido.',
        confirmButtonText: 'Ir a login',
        showCancelButton: true,
        cancelButtonText: 'Cancelar'
      })
    }
    this.productoService.aniadirProductoAlPedido(this.producto.id, this.usuario.id).subscribe({
      next: (res) => {
        console.log('Producto añadido correctamente:', res);
        Swal.fire({
          icon: 'success',
          title: 'Producto añadido',
          text: 'El producto se ha añadido a tu pedido correctamente.',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      },
      error: (err) => {
        console.error('Error al añadir producto:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo añadir el producto al pedido. Intenta de nuevo más tarde.',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }

  recuperarUsuario(): any | null {
    const data = sessionStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }
}
