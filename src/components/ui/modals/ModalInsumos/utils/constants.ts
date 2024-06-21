import * as Yup from "yup";
import { IArticuloInsumoPost } from "../../../../../types/ArticuloInsumo/IArticuloInsumoPost";

export const API_URL = import.meta.env.VITE_API_URL;

export const initialValues: IArticuloInsumoPost = {
  denominacion: "",
  precioVenta: 0,
  imagenes: [],
  precioCompra: 0,
  stockMinimo: 0,
  stockActual: 0,
  stockMaximo: 0,
  esParaElaborar: true,
  idUnidadMedida: 0,
  idCategoria: 0,
  idSucursal: 1,
};

export const validationSchema = Yup.object({
  denominacion: Yup.string().required("Campo requerido"),
  precioVenta: Yup.number()
    .required("Campo requerido")
    .min(0, "El precio de venta debe ser mayor o igual a 0."),
  precioCompra: Yup.number()
    .required("Campo requerido")
    .min(0, "El precio de compra debe ser mayor o igual a 0."),
  stockMinimo: Yup.number()
    .required("Campo requerido")
    .min(1, "El stock minimo debe ser mayor que 0."),
  stockActual: Yup.number()
    .required("Campo requerido")
    .min(
      Yup.ref("stockMinimo"),
      "El stock actual debe ser mayor o igual al stock mínimo."
    )
    .max(
      Yup.ref("stockMaximo"),
      "El stock actual debe ser menor o igual al stock máximo."
    ),
  stockMaximo: Yup.number()
    .required("Campo requerido")
    .min(1, "El stock máximo debe ser mayor que 0."),
  esParaElaborar: Yup.boolean().required("Campo requerido"),
  idUnidadMedida: Yup.number().required("Campo requerido"),
  idCategoria: Yup.number().required("Campo requerido"),
});

export const steps = [
  "Información del Artículo",
  "Información Adicional",
  "Imágenes",
];
