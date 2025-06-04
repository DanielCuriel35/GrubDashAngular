import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Usuario } from '../usuario.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  imports: [RouterModule,FormsModule,CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {
  //Variables que usaré después
  public usuario:any
  //Función que se ejecuta al lanzarse el componente
  ngOnInit(): void {
    if (sessionStorage.getItem('usuario')) {
      this.usuario = this.recuperarUsuario();
    }
    console.log(this.usuario);

  }
  //Funcion que sirve para recuperar el usuario del session storage
  recuperarUsuario(): any | null {
    const data = sessionStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }
}
