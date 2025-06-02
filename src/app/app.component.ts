import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { InicioComponent } from "./inicio/inicio.component";
import { MainComponent } from "./main/main.component";
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule, HttpClientModule, MainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'GrubDash';
  data: any;

  private http = inject(HttpClient);

  ngOnInit(): void {
    this.http.get('https://grubdashapi-production.up.railway.app/ping').subscribe(() => {
    console.log('API despertada');
  });
    this.http.get('https://jsonplaceholder.typicode.com/posts')
      .subscribe({
        next: (res) => this.data = res,
        error: (err) => console.error('Error al llamar la API:', err)
      });
  }
}
