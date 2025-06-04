import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../usuario.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //Ruta de mi api
  private apiUrl = 'https://grubdashapi-production.up.railway.app/api';
  //Libreria de http
  private http = inject(HttpClient)

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  guardarUsuario(usuario: Usuario) {
    sessionStorage.setItem('usuario', JSON.stringify(usuario));
  }

  obtenerUsuario(): Usuario | null {
    const stored = sessionStorage.getItem('usuario');
    return stored ? JSON.parse(stored) : null;
  }

  guardarToken(token: string) {
    sessionStorage.setItem('token', token);
  }

  obtenerToken(): string | null {
    return sessionStorage.getItem('token');
  }

  cerrarSesion() {
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
  }

  registrar(usuario: any) {
    return this.http.post(`${this.apiUrl}/registro`, usuario);
  }

  actualizarUsuario(usuario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuario/${usuario.id}`, usuario);
  }

  actualizarRestaurante(restaurante: any, imagen: File|null): Observable<any> {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('nombreLocal', restaurante.nombreLocal || '');
    formData.append('precioMedio', restaurante.precioMedio || '');
    formData.append('descripcion', restaurante.descripcion || '');
    formData.append('localidad', restaurante.localidad || '');
    formData.append('ubicacion', restaurante.ubicacion || '');
    if (imagen) {
      formData.append('img', imagen);
    }
    return this.http.post(`${this.apiUrl}/restaurantesUpdate/${restaurante.id}`, formData);
  }
}
