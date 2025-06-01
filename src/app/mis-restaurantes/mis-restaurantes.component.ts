import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Restaurante } from './restaurante.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-mis-restaurantes',
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './mis-restaurantes.component.html',
  styleUrl: './mis-restaurantes.component.css'
})
export class MisRestaurantesComponent {
  private http = inject(HttpClient);
  restaurantes: Restaurante[] = [];
  public usuario: any;
  id: any;
  mostrarFormulario = false;
  imagenSeleccionada: File | null = null;

  formData = {
    usuario_id: '',
    nombreLocal: '',
    img: null as File | null,
    precioMedio: '',
    descripcion: '',
    localidad: '',
    ubicacion: ''
  };

  ngOnInit(): void {
    if (sessionStorage.getItem('usuario')) {
      this.usuario = this.recuperarUsuario()
      this.id = this.usuario.id
    }

    this.http.get<Restaurante[]>('https://grubdashapi-production.up.railway.app/api/restaurantesU/' + this.id)
      .subscribe({
        next: (data) => this.restaurantes = data,
        error: (err) => console.error('Error al cargar restaurantes', err)
      });
  }

  recuperarUsuario(): any | null {
    const data = sessionStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  crearRestaurante(): void {
    this.mostrarFormulario = false;

    const formDataToSend = new FormData();
    formDataToSend.append('usuario_id', this.id.toString());
    formDataToSend.append('nombreLocal', this.formData.nombreLocal || '');
    formDataToSend.append('precioMedio', this.formData.precioMedio || '');
    formDataToSend.append('descripcion', this.formData.descripcion || '');
    formDataToSend.append('localidad', this.formData.localidad || '');
    formDataToSend.append('ubicacion', this.formData.ubicacion || '');

    if (this.imagenSeleccionada) {
      formDataToSend.append('img',this.imagenSeleccionada);
    }

    this.http.post(`https://grubdashapi-production.up.railway.app/api/restaurante`, formDataToSend).subscribe({
      next: (res) => {
        console.log('Restaurante creado:', res);
        this.mostrarFormulario = false;
        this.resetForm();
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Error al crear restaurante:', err);
      }
    });
  }


  resetForm() {
  }

  imgSel(event: any): void {
    const file = event.target.files?.[0];
    this.imagenSeleccionada = file || null;
  }

  cerrarModal(event: MouseEvent) {
    this.mostrarFormulario = false;
  }
}
