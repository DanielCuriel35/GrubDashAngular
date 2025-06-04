import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../producto/producto.model';
import { subirImagenCloudinary } from './cloudinary.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  //Ruta de mi api
  private apiUrl = 'https://grubdashapi-production.up.railway.app/api';
  //Libreria de http
  private http = inject(HttpClient)

  obtenerProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/Dproducto/${id}`);
  }

  actualizarProducto(producto: Producto, imagen?: File): Observable<any> {
    return new Observable(observer => {
      const continuarActualizacion = (imageUrl: string | null) => {
        const body: any = {
          nombreProducto: producto.nombreProducto || '',
          precio: producto.precio != null ? producto.precio : 0,
          descripcion: producto.descripcion || '',
          tiempoPreparacion: producto.tiempoPreparacion || '',
        };

        if (imageUrl) {
          body.img = imageUrl;
        }

        this.http.put(`${this.apiUrl}/productosUpdate/${producto.id}`, body)
          .subscribe({
            next: res => observer.next(res),
            error: err => observer.error(err),
            complete: () => observer.complete()
          });
      };

      if (imagen) {
        subirImagenCloudinary(imagen, 'producto')
          .then(url => continuarActualizacion(url))
          .catch(err => observer.error(err));
      } else {
        continuarActualizacion(null);
      }
    });
  }

  aniadirProductoAlPedido(productoId: number, usuarioId: number, cantidad = 1): Observable<any> {
    const url = `${this.apiUrl}/pedido`;
    const data = {
      producto_id: productoId,
      cantidad,
      usuario_id: usuarioId
    };
    return this.http.post(url, data);
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/productos/${id}`);
  }
}
