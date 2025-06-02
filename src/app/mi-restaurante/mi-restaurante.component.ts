import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Producto } from '../producto/producto.model';
import { Ingrediente } from '../producto/ingrediente.model';
import { RestauranteService } from '../services/restaurante.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mi-restaurante',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './mi-restaurante.component.html',
  styleUrl: './mi-restaurante.component.css'
})
export class MiRestauranteComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private restauranteService = inject(RestauranteService);

  productos: Producto[] = [];
  ingredientesDisponibles: Ingrediente[] = [];

  idRestaurante!: string;
  local!: string;
  public usuario: any;
  id!:number;
  mostrarFormulario = false;
  mostrarModalIngrediente = false;
  imagenSeleccionada: File | null = null;

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
    if (sessionStorage.getItem('usuario')) {
      this.usuario = this.recuperarUsuario();
      this.id = this.usuario.id;
    }
    this.idRestaurante = this.route.snapshot.paramMap.get('usuario_id')!;
    this.local = this.route.snapshot.paramMap.get('nombreLocal')!;
    this.formData.restaurante_id = this.idRestaurante;

    this.restauranteService.obtenerIngredientes().subscribe({
      next: (data) => this.ingredientesDisponibles = data,
      error: (err) => {
        console.error('Error al cargar ingredientes', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los ingredientes'
        });
      }
    });

    this.cargarProductos();
  }

  cargarProductos(): void {
    this.restauranteService.obtenerProductosPorRestaurante(this.idRestaurante).subscribe({
      next: (data) => this.productos = data,
      error: (err) => {
        console.error('Error al cargar productos', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los productos'
        });
      }
    });
  }

  crearProducto(): void {
    if (!this.formData.nombreProducto || !this.formData.precio) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Por favor completa el nombre y precio del producto'
      });
      return;
    }

    this.mostrarFormulario = false;

    this.restauranteService.crearProducto({
      restaurante_id: this.formData.restaurante_id,
      nombreProducto: this.formData.nombreProducto,
      precio: this.formData.precio,
      descripcion: this.formData.descripcion,
      tiempoPreparacion: this.formData.tiempoPreparacion,
      img: this.imagenSeleccionada,
      ingredientes: this.formData.ingredientes
    }).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Producto creado',
          text: 'El producto fue creado exitosamente',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
        this.cargarProductos();
        this.limpiarFormularioProducto();
      },
      error: (err) => {
        console.error('Error al crear producto:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo crear el producto'
        });
      }
    });
  }

  crearIngrediente(): void {
    if (!this.nuevoIngrediente.nombre) {
      Swal.fire({
        icon: 'warning',
        title: 'Nombre requerido',
        text: 'Por favor ingresa el nombre del ingrediente'
      });
      return;
    }

    this.restauranteService.crearIngrediente(this.nuevoIngrediente).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Ingrediente creado',
          text: 'El ingrediente fue agregado exitosamente',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
        this.ingredientesDisponibles.push(res.data);
        this.mostrarModalIngrediente = false;
        this.nuevoIngrediente = { nombre: '', descripcion: '' };
      },
      error: (err) => {
        console.error('Error al crear ingrediente:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo crear el ingrediente'
        });
      }
    });
  }

  imgSel(event: any): void {
    const file = event.target.files?.[0];
    this.imagenSeleccionada = file || null;
  }

  cerrarModal(_: MouseEvent): void {
    this.mostrarFormulario = false;
    this.limpiarFormularioProducto();
  }

  cerrarModalIngrediente(_: MouseEvent): void {
    this.mostrarModalIngrediente = false;
  }

  recuperarUsuario(): any | null {
    const data = sessionStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  private limpiarFormularioProducto(): void {
    this.formData = {
      restaurante_id: this.idRestaurante,
      nombreProducto: '',
      img: null,
      precio: '',
      descripcion: '',
      tiempoPreparacion: '',
      ingredientes: []
    };
    this.imagenSeleccionada = null;
  }
}
