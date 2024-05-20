import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import {
  Button,
  TextField,
  Box,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  Table,
  Paper,
  TableBody,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { useAppDispatch } from "../../../../hooks/redux";
import { setElementActive } from "../../../../redux/slices/TablaReducer";
import { IArticuloManufacturadoPost } from "../../../../types/ArticuloManufacturado/IArticuloManufacturadoPost";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { CategoriaModal } from "../ModalCategorias/ModalCategorias";
import { ImagenArticuloModal } from "../ModalImagenArticulo/ModalImagenArticulo";
import { UnidadMedidaModal } from "../ModalUnidadMedida/ModalUnidadMedida";
import { ArticuloManufacturadoDetalleModal } from "../ModalManufacturadosDetalle/ModalManufacturadosDetalle";

const steps = ["Información General", "Detalles", "Ingredientes"];

const validationSchema = Yup.object({
  denominacion: Yup.string().required("Campo requerido"),
  precioVenta: Yup.number().required("Campo requerido"),
  descripcion: Yup.string().required("Campo requerido"),
  tiempoEstimadoMinutos: Yup.number().required("Campo requerido"),
  preparacion: Yup.string().required("Campo requerido"),
  articuloManufacturadoDetalles: Yup.array().required("Campo requerido"),
  imagenes: Yup.array().required("Campo requerido"),
  idUnidadMedida: Yup.number().required("Campo requerido"),
  idCategoria: Yup.number().required("Campo requerido"),
});

const initialValues = {
  id: 0,
  denominacion: "",
  precioVenta: 0,
  descripcion: "",
  tiempoEstimadoMinutos: 0,
  preparacion: "",
  idArticuloManufacturadoDetalles: [],
  idImagenes: [],
  idUnidadMedida: 0,
  idCategoria: 0,
};

const translatedPlaceholder = {
  denominacion: "Denominación",
  precioVenta: "Precio de Venta",
  descripcion: "Descripción",
  tiempoEstimadoMinutos: "Tiempo Estimado en Minutos",
  preparacion: "Preparación",
  idArticuloManufacturadoDetalles: "Detalles",
  idImagenes: "Imagenes",
  idUnidadMedida: "Unidad de Medida",
  idCategoria: "Categoria",
};

const formInputType = {
  denominacion: "text",
  precioVenta: "number",
  descripcion: "text",
  tiempoEstimadoMinutos: "number",
  preparacion: "text",
  idArticuloManufacturadoDetalles: "number",
  idImagenes: "number",
  idUnidadMedida: "number",
  idCategoria: "number",
};

interface ManufacturadosFormProps {
  activeStep: number;
  handleNext: () => void;
  handleBack: () => void;
  elementActive: any;
  itemService: any;
  getManufacturados: () => void;
  handleClose: () => void;
}

export const ManufacturadosForm = ({
  activeStep,
  handleNext,
  handleBack,
  elementActive,
  itemService,
  getManufacturados,
  handleClose,
}: ManufacturadosFormProps) => {
  const dispatch = useAppDispatch();

  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [showImagenArticuloModal, setShowImagenArticuloModal] = useState(false);
  const [showUnidadMedidaModal, setShowUnidadMedidaModal] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [detalles, setDetalles] = useState([]);

  const handleSubmit = async (values: IArticuloManufacturadoPost) => {
    handleClose();
    if (elementActive?.element) {
      await itemService.put(elementActive.element.id, values);
    } else {
      await itemService.post(values);
    }
    getManufacturados();
  };

  const formDetails = {
    validationSchema,
    initialValues: elementActive?.element || initialValues,
    translatedPlaceholder,
    formInputType,
  };

  const handleCategoriaSave = (categoria) => {
    setCategorias([...categorias, categoria]);
  };

  const handleImagenArticuloSave = (imagen) => {
    setImagenes([...imagenes, imagen]);
  };

  const handleUnidadMedidaSave = (unidad) => {
    setUnidadesMedida([...unidadesMedida, unidad]);
  };

  const handleDetalleSave = (detalle) => {
    setDetalles([...detalles, detalle]);
  };

  const handleDetalleDelete = (index) => {
    const updatedDetalles = [...detalles];
    updatedDetalles.splice(index, 1);
    setDetalles(updatedDetalles);
  };

  function createData(insumo, cantidad, unidadMedida, index) {
    return { insumo, cantidad, unidadMedida, index };
  }

  return (
    <>
      <CategoriaModal
        show={showCategoriaModal}
        handleClose={() => setShowCategoriaModal(false)}
        handleSave={handleCategoriaSave}
        sx={{ zIndex: 1302 }}
      />
      <ImagenArticuloModal
        show={showImagenArticuloModal}
        handleClose={() => setShowImagenArticuloModal(false)}
        handleSave={handleImagenArticuloSave}
        sx={{ zIndex: 1302 }}
      />
      <UnidadMedidaModal
        show={showUnidadMedidaModal}
        handleClose={() => setShowUnidadMedidaModal(false)}
        handleSave={handleUnidadMedidaSave}
        sx={{ zIndex: 1302 }}
      />
      <ArticuloManufacturadoDetalleModal
        show={showDetalleModal}
        handleClose={() => setShowDetalleModal(false)}
        handleSave={handleDetalleSave}
        listaArticulosInsumo={listaArticulosInsumo}
        sx={{ zIndex: 1302 }}
      />

      <Formik
        validationSchema={formDetails.validationSchema}
        initialValues={formDetails.initialValues as IArticuloManufacturadoPost}
        enableReinitialize={true}
        onSubmit={async (values: IArticuloManufacturadoPost) => {
          await handleSubmit(values);
        }}
      >
        {({ setFieldValue }) => (
          <Form>
            <Grid container spacing={2}>
              {activeStep === 0 && (
                <>
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      id="outlined-denominacion"
                      label={translatedPlaceholder.denominacion}
                      variant="outlined"
                      fullWidth
                      name="denominacion"
                      value={formDetails.initialValues.denominacion}
                      onChange={(e) => {
                        setFieldValue("denominacion", e.target.value);
                        if (elementActive) {
                          dispatch(
                            setElementActive({
                              element: {
                                ...elementActive.element,
                                denominacion: e.target.value,
                              },
                            })
                          );
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ minWidth: 120 }}>
                      <FormControl fullWidth>
                        <InputLabel>
                          {translatedPlaceholder.idCategoria}
                        </InputLabel>
                        <Select
                          name="idCategoria"
                          value={formDetails.initialValues.idCategoria}
                          onChange={(e) => {
                            if (e.target.value === "new") {
                              setShowCategoriaModal(true);
                            } else {
                              handleChange(e);
                            }
                          }}
                        >
                          <MenuItem value="new">
                            Añadir Nueva Categoría
                          </MenuItem>
                          {categorias.map((categoria) => (
                            <MenuItem key={categoria.id} value={categoria.id}>
                              {categoria.denominacion}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Field
                      as={TextField}
                      id="outlined-precioVenta"
                      label={translatedPlaceholder.precioVenta}
                      variant="outlined"
                      sx={{ mt: 2 }}
                      name="precioVenta"
                      value={formDetails.initialValues.precioVenta}
                      type="number"
                      onChange={(e) => {
                        setFieldValue(
                          "precioVenta",
                          parseFloat(e.target.value)
                        );
                        if (elementActive) {
                          dispatch(
                            setElementActive({
                              element: {
                                ...elementActive.element,
                                precioVenta: parseFloat(e.target.value),
                              },
                            })
                          );
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={7}>
                    <Box sx={{ minWidth: 120 }}>
                      <FormControl fullWidth>
                        <InputLabel>
                          {translatedPlaceholder.idUnidadMedida}
                        </InputLabel>
                        <Select
                          name="idUnidadMedida"
                          value={formDetails.initialValues.idUnidadMedida}
                          onChange={(e) => {
                            if (e.target.value === "new") {
                              setShowUnidadMedidaModal(true);
                            } else {
                              handleChange(e);
                            }
                          }}
                        >
                          <MenuItem value="new">
                            Añadir Nueva Unidad de Medida
                          </MenuItem>
                          {unidadesMedida.map((unidad) => (
                            <MenuItem key={unidad.id} value={unidad.id}>
                              {unidad.denominacion}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      id="outlined-descripcion"
                      label={translatedPlaceholder.descripcion}
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      sx={{ mt: 2 }}
                      name="descripcion"
                      value={formDetails.initialValues.descripcion}
                      onChange={(e) => {
                        setFieldValue("descripcion", e.target.value);
                        if (elementActive) {
                          dispatch(
                            setElementActive({
                              element: {
                                ...elementActive.element,
                                descripcion: e.target.value,
                              },
                            })
                          );
                        }
                      }}
                    />
                  </Grid>
                </>
              )}
              {activeStep === 1 && (
                <>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      id="outlined-preparacion"
                      label={translatedPlaceholder.preparacion}
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      name="preparacion"
                      value={formDetails.initialValues.preparacion}
                      onChange={(e) => {
                        setFieldValue("preparacion", e.target.value);
                        if (elementActive) {
                          dispatch(
                            setElementActive({
                              element: {
                                ...elementActive.element,
                                preparacion: e.target.value,
                              },
                            })
                          );
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      id="outlined-tiempoEstimadoMinutos"
                      label={translatedPlaceholder.tiempoEstimadoMinutos}
                      variant="outlined"
                      fullWidth
                      sx={{ mt: 2 }}
                      name="tiempoEstimadoMinutos"
                      value={formDetails.initialValues.tiempoEstimadoMinutos}
                      type="number"
                      onChange={(e) => {
                        setFieldValue(
                          "tiempoEstimadoMinutos",
                          parseInt(e.target.value)
                        );
                        if (elementActive) {
                          dispatch(
                            setElementActive({
                              element: {
                                ...elementActive.element,
                                tiempoEstimadoMinutos: parseInt(e.target.value),
                              },
                            })
                          );
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ minWidth: 120 }}>
                      <FormControl fullWidth>
                        <InputLabel>
                          {translatedPlaceholder.idImagenes}
                        </InputLabel>
                        <Select
                          name="idImagenes"
                          value={formDetails.initialValues.idImagenes}
                          onChange={(e) => {
                            if (e.target.value === "new") {
                              setShowImagenArticuloModal(true);
                            } else {
                              handleChange(e);
                            }
                          }}
                        >
                          <MenuItem value="new">Añadir Nueva Imagen</MenuItem>
                          {imagenes.map((imagen) => (
                            <MenuItem key={imagen.id} value={imagen.id}>
                              {imagen.url}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                </>
              )}
              {activeStep === 2 && (
                <div>
                  <div>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => setShowDetalleModal(true)}
                    >
                      Agregar un ingrediente
                    </Button>
                  </div>
                  <TableContainer component={Paper}>
                    <Table
                      sx={{
                        display: "flex-column",
                        flexDirection: "column",
                        width: "100%",
                      }}
                      aria-label="simple table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>Insumo</TableCell>
                          <TableCell align="center">Cantidad</TableCell>
                          <TableCell align="center">Unidad de Medida</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row, index) => (
                          <TableRow
                            key={row.insumo}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {row.insumo}
                            </TableCell>
                            <TableCell align="center">{row.cantidad}</TableCell>
                            <TableCell align="center">
                              {row.unidadMedida}
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                aria-label="delete"
                                onClick={() => handleDetalleDelete(index)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                        {/* Aquí deberías mapear los detalles y renderizar un TableRow para cada uno */}
                        {detalles.map((detalle, index) => (
                          <TableRow key={index}>
                            <TableCell>{detalle.insumo}</TableCell>
                            <TableCell align="center">
                              {detalle.cantidad}
                            </TableCell>
                            <TableCell align="center">
                              {detalle.unidadMedida}
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                aria-label="delete"
                                onClick={() => handleDetalleDelete(index)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )}
            </Grid>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Atrás
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button type="submit" onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
};