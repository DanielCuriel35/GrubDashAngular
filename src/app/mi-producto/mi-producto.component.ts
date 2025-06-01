import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from '../producto/producto.model';


@Component({
  selector: 'app-mi-producto',
  imports: [CommonModule, FormsModule],
  templateUrl: './mi-producto.component.html',
  styleUrl: './mi-producto.component.css'
})
export class MiProductoComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  imagen !: File
  producto !: Producto

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarProducto(Number(id));
    }
  }

  cargarProducto(id: number) {
    this.http.get<Producto>(`https://grubdashapi-production.up.railway.app/api/Dproducto/${id}`)
      .subscribe({
        next: (data) => {
          this.producto = data;
        },
        error: (err) => {
          console.error('Error cargando producto', err);
          alert('Error al cargar producto');
        },
      });
  }

    actualizarProducto() {
      const formData = new FormData();

      formData.append('_method', 'PUT');
      formData.append('nombreProducto', this.producto.nombreProducto || '');
      formData.append('precio', this.producto.precio != null ? this.producto.precio.toString() : '0');
      formData.append('descripcion', this.producto.descripcion || '');
      formData.append('tiempoPreparacion', this.producto.tiempoPreparacion || '');

      if (this.imagen) {
        formData.append('img', this.imagen);
      }

      this.http.post(`https://grubdashapi-production.up.railway.app/api/productosUpdate/${this.producto.id}`, formData)
        .subscribe({
          next: (res) => {
            alert('Producto actualizado con éxito');
            this.router.navigate(['/mRestaurantes']);
          },
          error: (err) => {
            console.error('Error actualizando producto', err);
            alert('Error al actualizar producto');
          }
        });
    }



    onImageSel(event: any) {
      const file = event.target.files[0];
      if (file) {
        this.imagen = file;
      }
    }

  }
