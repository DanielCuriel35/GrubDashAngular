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
  //Variables que usaré después
  producto!: Producto;
  usuario: any;
  //Llamadas para consumir de diferentes librerias
  private route = inject(ActivatedRoute);
  private productoService = inject(ProductoService);
  //Función que se ejecuta al lanzarse el componente
  ngOnInit(): void {
    this.usuario = this.recuperarUsuario();
    const idProducto = this.route.snapshot.paramMap.get('producto_id');
    if (idProducto) {
      this.cargarProducto(Number(idProducto));
    }
  }
  //Función que llama al servicio para cargar el producto atraves de su id
  cargarProducto(id: number) {
    this.productoService.obtenerProducto(id).subscribe({
      next: (data) => {
        this.producto = data;
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
        //Lanza alert de error
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar el producto',
          text: 'No se pudo obtener la información del producto. Por favor, intenta nuevamente.',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }
  //Función que llama a servicio para añadir producto
  aniadirProducto() {
    this.productoService.aniadirProductoAlPedido(this.producto.id, this.usuario.id).subscribe({
      next: (res) => {
        console.log('Producto añadido correctamente:', res);
        // Lanza alert de confirmación
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
        //Lanza alert de error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo añadir el producto al pedido. Intenta de nuevo más tarde, comprube que todos los productos de su cesta son del mismo restaurante.',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }
  //Funcion que sirve para recuperar el usuario del session storage
  recuperarUsuario(): any | null {
    const data = sessionStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }
}
