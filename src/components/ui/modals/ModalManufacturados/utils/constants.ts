import * as Yup from "yup";
import { IArticuloManufacturadoPost } from "../../../../../types/ArticuloManufacturado/IArticuloManufacturadoPost";

export const API_URL = import.meta.env.VITE_API_URL;

export const initialValues: IArticuloManufacturadoPost = {
  denominacion: "",
  precioVenta: 0,
  descripcion: "",
  tiempoEstimadoMinutos: 0,
  preparacion: "",
  articuloManufacturadoDetalles: [],
  imagenes: [],
  idUnidadMedida: 0,
  idCategoria: 0,
};

export const validationSchema = Yup.object({
  denominacion: Yup.string().required("Campo requerido"),
  precioVenta: Yup.number()
    .required("Campo requerido")
    .min(0, "El precio debe ser mayor o igual a 0."),
  descripcion: Yup.string().required("Campo requerido"),
  tiempoEstimadoMinutos: Yup.number()
    .required("Campo requerido")
    .min(0, "El tiempo estimado debe ser mayor o igual a 0."),
  preparacion: Yup.string().required("Campo requerido"),
  articuloManufacturadoDetalles: Yup.array().required("Campo requerido"),
  idUnidadMedida: Yup.number().required("Campo requerido"),
  idCategoria: Yup.number().required("Campo requerido"),
});

export const steps = [
  "Información General",
  "Detalles",
  "Insumos Necesarios",
  "Imágenes",
];
