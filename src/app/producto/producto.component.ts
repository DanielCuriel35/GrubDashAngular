import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Producto } from './producto.model';
@Component({
  selector: 'app-producto',
  imports: [RouterModule, CommonModule, HttpClientModule],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  producto!: Producto;
  idProducto!: string;
  usuario: any;
  ngOnInit(): void {
    this.usuario = this.recuperarUsuario()
    this.idProducto = this.route.snapshot.paramMap.get('producto_id')!;

    this.http.get<Producto>(`https://grubdashapi-production.up.railway.app/api/Dproducto/${this.idProducto}`)
      .subscribe({
        next: (data) => {
          this.producto = data
          console.log(this.producto);
        },
        error: (err) => console.error('Error al cargar productos', err)
      });

  }
  aniadirProducto() {


  const url = 'https://grubdashapi-production.up.railway.app/api/pedido';

  const data = {
    producto_id: this.producto.id,
    cantidad: 1,
    usuario_id: this.usuario.id
  };
   this.http.post(url, data).subscribe({
    next: (res) => {
      console.log('Producto añadido correctamente:', res);
      alert('Producto añadido al pedido');
    },
    error: (err) => {
      console.error('Error al añadir producto:', err);
      alert('Error al añadir producto');
    }
  });
}

  recuperarUsuario(): any | null {
    const data = sessionStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

}
