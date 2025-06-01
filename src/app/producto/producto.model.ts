import { Ingrediente } from "./ingrediente.model";

export interface Producto {
  id:number;
  restaurante_id: number;
  nombreProducto: string;
  img: File;
  precio: string;
  descripcion: string;
  tiempoPreparacion: string;
  ingredientes: Ingrediente[];
}
