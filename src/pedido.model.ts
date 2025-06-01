import { Producto } from "./app/servicios.service";

export interface Pedido {
  id: number;
  usuario_id:number;
  fecha_pedido: string; 
  estado: string;
  restaurante: string;
  productos: Producto[];
}
