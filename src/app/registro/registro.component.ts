import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  imports: [RouterModule, CommonModule, HttpClientModule,FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})

export class RegistroComponent{
  usuario = {
    nombre: '',
    apellido: '',
    fecha_nac: '',
    username: '',
    localidad: '',
    direccion: '',
    email: '',
    password: '',
    restaurante: false
  };
  private http = inject(HttpClient);
  private router = inject(Router);
  onSubmit() {
    this.http.post('http://localhost/Apis/GrubDashApi/public/api/registro', this.usuario).subscribe({
      next: (res: any) => {
        console.log('Registro exitoso:', res);
        alert('¡Registro exitoso!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        if (err.status === 422) {
          alert('Errores de validación:\n' + JSON.stringify(err.error.errors, null, 2));
        } else {
          alert('Error inesperado al registrar usuario.');
        }
      }
    });
  }
}

