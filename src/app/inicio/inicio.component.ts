import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Usuario } from '../usuario.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../services/pedidos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inicio',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {
  //Variables que usaré después
  public usuario: any
  sessionId: string | null = null;
  //Llamadas para consumir de diferentes librerias
  private pedidosService = inject(PedidoService)
  private route = inject(ActivatedRoute)
  //Función que se ejecuta al lanzarse el componente
  ngOnInit(): void {
    this.sessionId = this.route.snapshot.queryParamMap.get('session_id');
    console.log(this.sessionId);

    //Este if evita refrescar y llamar demasiadas veces al metodo
    if (this.sessionId && !localStorage.getItem('pagoProcesado')) {
      this.guardarCarrito();
      localStorage.setItem('pagoProcesado', 'true');
    }
    if (sessionStorage.getItem('usuario')) {
      this.usuario = this.recuperarUsuario();
    }

  }
  //Funcion que sirve para recuperar el usuario del session storage
  recuperarUsuario(): any | null {
    const data = sessionStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }
  //Función que guarda el pedido que habia en el carrito
  guardarCarrito() {
    console.log('Entra a guardar carrito');
    this.pedidosService.marcarPedidoComoPendiente(this.usuario.id).subscribe({
      next: (res: any) => {
        console.log('Estado cambiado:', res);
        // Lanza alert de confirmación
        Swal.fire({
          icon: 'success',
          title: 'Pedido actualizado',
          text: res.message,
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      },
      error: (err) => {
        console.error('Error al cambiar estado:', err);
        //Lanza alert de error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || 'Error al cambiar estado',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }
}
