import { IPromocionPost } from "../../../../../types/Promocion/IPromocionPost";
import * as Yup from "yup";

export const API_URL = import.meta.env.VITE_API_URL;

export const validationSchema = Yup.object({
  denominacion: Yup.string().required("Campo requerido"),
  fechaDesde: Yup.string().required("Campo requerido"),
  fechaHasta: Yup.string().required("Campo requerido"),
  horaDesde: Yup.string().required("Campo requerido"),
  horaHasta: Yup.string().required("Campo requerido"),
  precioPromocional: Yup.number()
    .required("Campo requerido")
    .min(0, "El precio promocional debe se mayor que 0"),
  tipoPromocion: Yup.string().required("Campo requerido"),
  promocionDetalles: Yup.array().required("Campo requerido"),
  imagenes: Yup.array().required("Campo requerido"),
  idSucursales: Yup.array().required("Campo requerido"),
  descripcionDescuento: Yup.string().required("Campo requerido"),
});

export const initialValues: IPromocionPost = {
  denominacion: "",
  fechaDesde: "",
  fechaHasta: "",
  horaDesde: "",
  horaHasta: "",
  precioPromocional: 0,
  tipoPromocion: "",
  promocionDetalles: [],
  imagenes: [],
  idSucursales: [],
  descripcionDescuento: "",
};

export const steps = [
  "Información de la promoción",
  "Detalles de la promoción",
  "Artículos y Sucursales",
  "Imágenes de la promoción",
];
