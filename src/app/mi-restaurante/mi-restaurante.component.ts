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
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './mi-restaurante.component.html',
  styleUrl: './mi-restaurante.component.css'
})
export class MiRestauranteComponent implements OnInit {
  //Variables que usaré después
  idRestaurante!: string;
  local!: string;
  usuario: any;
  id!: number;
  mostrarFormulario = false;
  mostrarModalIngrediente = false;
  imagenSeleccionada: File | null = null;
  productos: Producto[] = [];
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

  //Llamadas para consumir de diferentes librerias
  private route = inject(ActivatedRoute);
  private restauranteService = inject(RestauranteService);
  //Función que se ejecuta al lanzarse el componente
  ngOnInit(): void {
    if (sessionStorage.getItem('usuario')) {
      this.usuario = this.recuperarUsuario();
      this.id = this.usuario.id;
    }
    //Recupero lso daros de la url
    this.idRestaurante = this.route.snapshot.paramMap.get('usuario_id')!;
    this.local = this.route.snapshot.paramMap.get('nombreLocal')!;
    this.formData.restaurante_id = this.idRestaurante;
    //LLamo al servicio para obtener ingredientes
    this.restauranteService.obtenerIngredientes().subscribe({
      next: (data) => this.ingredientesDisponibles = data,
      error: (err) => {
        console.error('Error al cargar ingredientes', err);
        //Lanza alert de error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los ingredientes'
        });
      }
    });

    this.cargarProductos();
  }
  //Función que llama al servicio para cargar los productos
  cargarProductos(): void {
    this.restauranteService.obtenerProductosPorRestaurante(this.idRestaurante).subscribe({
      next: (data) => this.productos = data
    });
  }
  //Función que llama al servicio para crear productos
  crearProducto(): void {
    if (!this.formData.nombreProducto || !this.formData.precio) {
      // Lanza alert de confirmación
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Por favor completa el nombre y precio del producto'
      });
      return;
    }

    this.mostrarFormulario = false;
    //llamada al servicio
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
        // Lanza alert de confirmación
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
        //Lanza alert de error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo crear el producto'
        });
      }
    });
  }
  //Función que llama al servicio para crear un nuevo ingrediente
  crearIngrediente(): void {
    if (!this.nuevoIngrediente.nombre) {
      //Lanza alert de aviso
      Swal.fire({
        icon: 'warning',
        title: 'Nombre requerido',
        text: 'Por favor ingresa el nombre del ingrediente'
      });
      return;
    }
    //Llamada al servicio
    this.restauranteService.crearIngrediente(this.nuevoIngrediente).subscribe({
      next: (res) => {
        // Lanza alert de confirmación
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
        //Lanza alert de error
        console.error('Error al crear ingrediente:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo crear el ingrediente o ya existe en la base de datos'
        });
      }
    });
  }
  //Función para cerrar modal de productos
  cerrarModal(_: MouseEvent): void {
    this.mostrarFormulario = false;
    this.limpiarFormularioProducto();
  }
  //Función para cerrar modal de ingredientes
  cerrarModalIngrediente(_: MouseEvent): void {
    this.mostrarModalIngrediente = false;
  }
  //Funcion que sirve para recuperar el usuario del session storage
  recuperarUsuario(): any | null {
    const data = sessionStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }
  //Función que vacia el formulario de producto
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

  imgSel(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imagenSeleccionada = file;
    }
  }
}
