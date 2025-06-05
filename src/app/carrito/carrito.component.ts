import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PedidoService, Producto } from '../services/pedidos.service';
import Swal from 'sweetalert2';
const STRIPE_PUBLIC_KEY = 'pk_test_51RWM1p4eI3lex67bYmLYSEOVc8WG970t5CJJVF5fQZBx235vFm2dvEy1Ge0TarS2PTKlwtCdv910AvUf3dCLi4tQ00o23oAMWs';
import { loadStripe } from '@stripe/stripe-js';
import { StripeService } from '../services/stripe.service';
@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {
  //Variables que usaré después
  usuario: any;
  productos: Producto[] = [];
  total: number = 0;
   //Llamadas para consumir de diferentes librerias
  private pedidosService = inject(PedidoService)
  private stripe = inject(StripeService)

  //Función que se ejecuta al lanzarse el componente
  ngOnInit(): void {
    this.usuario = this.recuperarUsuario();
    if (this.usuario) {
      this.cargarPedido();
    }
  }
  //Funcion que sirve para recuperar el usuario del session storage
  recuperarUsuario(): any | null {
    const data = sessionStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  //Función que llama al servicio para cargar el pedido del carrito
  cargarPedido() {
    this.pedidosService.obtenerCarrito(this.usuario.id).subscribe({
      next: (pedido) => {
        this.productos = pedido.productos;
        this.calcularTotal();
      }
    });
  }
  //Función que calcula el total del carrito
  calcularTotal() {
    this.total = this.productos.reduce((acc, p) => acc + p.precio_unitario * p.cantidad, 0);
  }
  //Función que elimina productos del carrito
  eliminarProducto(productoId: number) {
    //Alert de pregunta de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este producto será eliminado de tu carrito.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productos = this.productos.filter(p => p.id !== productoId);
        this.calcularTotal();
        //Llama al servicio para eliminarlo también en la base de datos
        this.pedidosService.eliminarProductoDelPedido(this.usuario.id, productoId).subscribe({
          next: (res: any) => {
            console.log('Producto eliminado:', res);
            // Lanza alert de confirmación
            Swal.fire({
              icon: 'success',
              title: 'Producto eliminado',
              text: res.message,
              timer: 1500,
              showConfirmButton: false,
              toast: true,
              position: 'top-end'
            });
          },
          error: (err) => {
            console.error('Error eliminando producto:', err);
            //Lanza alert de error
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: err.error?.message || 'Error eliminando producto',
              confirmButtonText: 'Cerrar'
            });
          }
        });
      }
    });
  }

   async pago() {
    localStorage.setItem('pagoProcesado', 'false');
    const stripe = await loadStripe(STRIPE_PUBLIC_KEY);

    this.stripe.crearSesionPasarela(this.productos).subscribe({
      next: async (res) => {
        const result = await stripe?.redirectToCheckout({
          sessionId: res.id
        });

        if (result?.error) {
          console.error('Error al redirigir a Stripe:', result.error.message);
        }
      },
      error: (err) => {
        console.error('Error al crear la sesión de pago:', err);
      }
    });
  }

}
