import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Producto } from '../producto/producto.model';
import { RestauranteService } from '../services/restaurante.service';

@Component({
  selector: 'app-restaurante',
  imports: [RouterModule, CommonModule],
  templateUrl: './restaurante.component.html',
  styleUrl: './restaurante.component.css'
})
export class RestauranteComponent {
  //Variables que usaré después
  usuario: any;
  productos: Producto[] = [];
  idRestaurante!: string;
  local!: string;
  //Llamadas para consumir de diferentes librerias
  private restauranteService = inject(RestauranteService);
  private route = inject(ActivatedRoute);
  //Función que se ejecuta al lanzarse el componente
  ngOnInit(): void {
    this.usuario = this.recuperarUsuario();
    //Recupera parametros de la url
    this.idRestaurante = this.route.snapshot.paramMap.get('usuario_id')!;
    this.local = this.route.snapshot.paramMap.get('nombreLocal')!;
    //Llama al servicio para recuperar los productos de un restaurante
    this.restauranteService.obtenerProductosPorRestaurante(this.idRestaurante).subscribe({
      next: (data) => (this.productos = data),
      error: (err) => console.error('Error al cargar productos', err)
    });
  }
  //Funcion que sirve para recuperar el usuario del session storage
  recuperarUsuario(): any | null {
    const data = sessionStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }
}
