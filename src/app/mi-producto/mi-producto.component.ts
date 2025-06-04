import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from '../producto/producto.model';
import { ProductoService } from '../services/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mi-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mi-producto.component.html',
  styleUrl: './mi-producto.component.css'
})
export class MiProductoComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productoService = inject(ProductoService);

  producto!: Producto;
  imagen!: File;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarProducto(Number(id));
    }
  }

  cargarProducto(id: number) {
    this.productoService.obtenerProducto(id).subscribe({
      next: (data) => {
        this.producto = data;
      },
      error: (err) => {
        console.error('Error cargando producto', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar los productos'
        });
      }
    });
  }

  actualizarProducto() {
    this.productoService.actualizarProducto(this.producto, this.imagen).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Producto modificado',
          text: 'El producto fue modificado exitosamente',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
        this.router.navigate(['/mRestaurantes']);
      },
      error: (err) => {
        console.error('Error actualizando producto', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el producto'
        });
      }
    });
  }

  onImageSel(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagen = file;
    }
  }

  borrarProducto(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.eliminarProducto(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El producto fue eliminado.', 'success');
            this.router.navigate(['/mRestaurantes']);
          },
          error: (err) => {
            Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
            console.error(err);
          }
        });
      }
    });
  }
}
