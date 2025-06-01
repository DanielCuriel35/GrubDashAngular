import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MainComponent } from '../main/main.component';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  modoEdicion = false;
  usuario: any;
  restaurante: any
  imagenSeleccionada: File | null = null;
  constructor(private http: HttpClient, private router: Router, private main: MainComponent) { }

  ngOnInit(): void {
    this.usuario = this.recuperarUsuario()
    this.restaurante = this.usuario.restaurantes
    console.log(this.restaurante);

  }
  actualizarUsuario(): void {
    this.http.put(`https://grubdashapi-production.up.railway.app/api/usuario/${this.usuario.id}`, this.usuario)
      .subscribe({
        next: (res: any) => {
          alert('Datos actualizados con éxito');
          sessionStorage.setItem('usuario', JSON.stringify(res.user));
          this.modoEdicion = false;
          this.main.ngOnInit()
          this.router.navigate(['/']);

        },
        error: (err: any) => {
          console.error('Error al actualizar:', err);
          alert('Hubo un error al actualizar');
        }
      });
  }


 actualizarRestaurante() {
  const formData = new FormData();

  formData.append('_method', 'PUT');  // para que Laravel entienda que es PUT
  formData.append('nombreLocal', this.restaurante.nombreLocal || '');
  formData.append('precioMedio', this.restaurante.precioMedio || '');
  formData.append('descripcion', this.restaurante.descripcion || '');
  formData.append('localidad', this.restaurante.localidad || '');
  formData.append('ubicacion', this.restaurante.ubicacion || '');

  if (this.imagenSeleccionada) {
    formData.append('img', this.imagenSeleccionada);
  }
  console.log(this.imagenSeleccionada);

  this.http.post(`https://grubdashapi-production.up.railway.app/api/restaurantesUpdate/${this.restaurante.id}`, formData)
    .subscribe({
      next: (res) => {
        alert('Restaurante actualizado con éxito');
        this.router.navigate(['/mRestaurantes']);
      },
      error: (err) => {
        console.error('Error actualizando restaurante', err);
        alert('Error al actualizar restaurante');
      }
    });
}

  recuperarUsuario(): any | null {
    const data = sessionStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  imgSel(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
    }
  }
}
