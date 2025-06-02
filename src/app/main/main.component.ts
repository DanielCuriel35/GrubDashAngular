import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { Usuario } from '../usuario.model';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-main',
  imports: [RouterModule, CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  mostrarNav = true;
  usuario = {
    nombre: '',
    apellido: '',
    fecha_nac: '',
    username: '',
    localidad: '',
    direccion: '',
    email: '',
    restaurante: false
  };
  ultimoSegmento !: any;
  ngOnInit(): void {
    if (sessionStorage.getItem('usuario')) {
      this.usuario = this.recuperarUsuario()
      console.log(this.usuario);

    } else {
      let usuarioVacio = new Usuario
      this.usuario = usuarioVacio
    }
  }
  logout() {
    Swal.fire({
      title: '¿Estás seguro que quieres cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem('usuario');
        this.router.navigate(['/']);
        this.ngOnInit();
        Swal.fire({
          icon: 'success',
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión correctamente.',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }
  recuperarUsuario(): any | null {
    const data = sessionStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }
  constructor(private router: Router) { }



}
