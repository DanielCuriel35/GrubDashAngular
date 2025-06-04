// src/app/services/stripe.service.ts

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private apiUrl = 'https://grubdashapi-production.up.railway.app/api/crearSesionCheckout';

  private http = inject(HttpClient)

  crearSesionCheckout(productos: any[]) {
    return this.http.post<{ id: string }>(this.apiUrl, { productos });
  }
}
