import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Producto } from '../producto/producto.model';
@Component({
  selector: 'app-restaurante',
  imports: [RouterModule, CommonModule, HttpClientModule],
  templateUrl: './restaurante.component.html',
  styleUrl: './restaurante.component.css'
})
export class RestauranteComponent {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  usuario: any;
  productos: Producto[] = [];
  idRestaurante!: string;
  local!: string;

  recuperarUsuario(): any | null {
    const data = sessionStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }
  ngOnInit(): void {

    this.usuario = this.recuperarUsuario()
    this.idRestaurante = this.route.snapshot.paramMap.get('usuario_id')!;
    this.local = this.route.snapshot.paramMap.get('nombreLocal')!;

    this.http.get<Producto[]>(`http://localhost/Apis/GrubDashApi/public/api/productos/${this.idRestaurante}`)
      .subscribe({
        next: (data) => this.productos = data,
        error: (err) => console.error('Error al cargar productos', err)
      });
  }
}
