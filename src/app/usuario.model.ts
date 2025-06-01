import { Restaurante } from "./servicios.service";

export class Usuario {
  id!: number;
  nombre!: string;
  apellido!: string;
  email!: string;
  username!: string;
  fecha_nac!: string;
  localidad!: string;
  direccion!: string;
  restaurante!: boolean;
  restaurantes!:Restaurante;
}
