import { User } from "./usuario.models";

export interface Contacto extends User{
  bloqueado?: boolean | 0 // Por defecto, si no se especifica, será 'no' (0 o false)
}