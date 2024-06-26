import { IEmpleadoPost } from "../../../../../types/Empleado/IEmpleadoPost";

export const API_URL = import.meta.env.VITE_API_URL;

export const initialValues: IEmpleadoPost = {
  nombre: "",
  apellido: "",
  tipoEmpleado: "",
  idSucursal: 0,
  pedidos: [],
  usuarioEmpleado: {
    email: "",
    userName: "",
  },
};

export const roles = [
  "ADMIN",
  "ADMIN_NEGOCIO",
  "CAJERO",
  "COCINERO",
  "REPOSITOR",
  "DELIVERY",
];
