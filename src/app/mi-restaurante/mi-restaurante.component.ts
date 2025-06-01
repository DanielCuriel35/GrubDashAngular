import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Producto } from '../producto/producto.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ingrediente } from '../producto/ingrediente.model';

@Component({
  selector: 'app-mi-restaurante',
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './mi-restaurante.component.html',
  styleUrl: './mi-restaurante.component.css'
})
export class MiRestauranteComponent {

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  productos: Producto[] = [];
  idRestaurante!: string;
  local!: string;
  mostrarFormulario = false;
  mostrarModalIngrediente = false;
  imagenSeleccionada: File | null = null;

  ingredientesDisponibles: Ingrediente[] = [];

  formData = {
    restaurante_id: '',
    nombreProducto: '',
    img: null as File | null,
    precio: '',
    descripcion: '',
    tiempoPreparacion: '',
    ingredientes: [] as Ingrediente[]
  };

  nuevoIngrediente: Partial<Ingrediente> = {
    nombre: '',
    descripcion: ''
  };

  ngOnInit(): void {
    this.idRestaurante = this.route.snapshot.paramMap.get('usuario_id')!;
    this.local = this.route.snapshot.paramMap.get('nombreLocal')!;
    this.http.get<Ingrediente[]>(`https://grubdashapi-production.up.railway.app/api/ingredientes`)
      .subscribe({
        next: (data) => this.ingredientesDisponibles = data,
        error: (err) => console.error('Error al cargar ingredientes', err)
      });
    this.http.get<Producto[]>(`https://grubdashapi-production.up.railway.app/api/productos/${this.idRestaurante}`)
      .subscribe({
        next: (data) => this.productos = data,
        error: (err) => console.error('Error al cargar productos', err)
      });
  }

  crearProducto(): void {
  this.mostrarFormulario = false;

  const formDataToSend = new FormData();

  formDataToSend.append('restaurante_id', this.idRestaurante);
  formDataToSend.append('nombreProducto', this.formData.nombreProducto);
  formDataToSend.append('precio', this.formData.precio);
  formDataToSend.append('descripcion', this.formData.descripcion);
  formDataToSend.append('tiempoPreparacion', this.formData.tiempoPreparacion);

  if (this.imagenSeleccionada) {
    formDataToSend.append('img', this.imagenSeleccionada);
  }

  this.formData.ingredientes.forEach((ingrediente, index) => {
    formDataToSend.append(`ingredientes[${index}]`, ingrediente.id.toString());
  });

  this.http.post(`https://grubdashapi-production.up.railway.app/api/producto`, formDataToSend).subscribe({
    next: (res) => {
      console.log('Producto creado:', res);
      this.ngOnInit();
    },
    error: (err) => {
      console.error('Error al crear producto:', err);
    }
  });
}


  cerrarModal(event: MouseEvent) {
    this.mostrarFormulario = false;
  }

  crearIngrediente(): void {
    this.http.post<{ message: string, data: Ingrediente }>(`https://grubdashapi-production.up.railway.app/api/ingrediente`, this.nuevoIngrediente)
      .subscribe({
        next: (res) => {
          console.log('Ingrediente creado:', res.data);
          this.ingredientesDisponibles.push(res.data);
          this.mostrarModalIngrediente = false;
          this.nuevoIngrediente = { nombre: '', descripcion: '' };
        },
        error: (err) => {
          console.error('Error al crear ingrediente:', err);
        }
      });
  }

  imgSel(event: any): void {
    const file = event.target.files?.[0];
    this.imagenSeleccionada = file || null;
  }


  cerrarModalIngrediente(event: MouseEvent) {
    this.mostrarModalIngrediente = false;

  }

}
