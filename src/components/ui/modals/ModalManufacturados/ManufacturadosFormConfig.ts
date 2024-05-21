import * as Yup from 'yup';

export const validationSchema = Yup.object({
  denominacion: Yup.string().required('Campo requerido'),
  precioVenta: Yup.number().required('Campo requerido'),
  descripcion: Yup.string().required('Campo requerido'),
  tiempoEstimadoMinutos: Yup.number().required('Campo requerido'),
  preparacion: Yup.string().required('Campo requerido'),
  articuloManufacturadoDetalles: Yup.array().required('Campo requerido'),
  imagenes: Yup.array().required('Campo requerido'),
  idUnidadMedida: Yup.number().required('Campo requerido'),
  idCategoria: Yup.number().required('Campo requerido'),
});

export const initialValues = {
  id: 0,
  denominacion: '',
  precioVenta: 0,
  descripcion: '',
  tiempoEstimadoMinutos: 0,
  preparacion: '',
  idArticuloManufacturadoDetalles: [],
  idImagenes: [],
  idUnidadMedida: 0,
  idCategoria: 0,
};

export const translatedPlaceholder = {
  denominacion: 'Denominación',
  precioVenta: 'Precio de Venta',
  descripcion: 'Descripción',
  tiempoEstimadoMinutos: 'Tiempo Estimado en Minutos',
  preparacion: 'Preparación',
  idArticuloManufacturadoDetalles: 'Detalles',
  idImagenes: 'Imagenes',
  idUnidadMedida: 'Unidad de Medida',
  idCategoria: 'Categoria',
};

export const formInputType = {
  denominacion: 'text',
  precioVenta: 'number',
  descripcion: 'text',
  tiempoEstimadoMinutos: 'number',
  preparacion: 'text',
  idArticuloManufacturadoDetalles: 'number',
  idImagenes: 'number',
  idUnidadMedida: 'number',
  idCategoria: 'number',
};