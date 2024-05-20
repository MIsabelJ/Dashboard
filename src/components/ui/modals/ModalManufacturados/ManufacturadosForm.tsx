import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
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
import {
  validationSchema,
  initialValues,
  translatedPlaceholder,
  formInputType,
} from "./ManufacturadosFormConfig";
import { ICategoriaPost } from "../../../../types/Categoria/ICategoriaPost";
import { IImagenArticuloPost } from "../../../../types/ImagenArticulo/IImagenArticuloPost";
import { IArticuloManufacturadoDetallePost } from "../../../../types/ArticuloManufacturadoDetalle/IArticuloManufacturadoDetallePost";
import { IUnidadMedidaPost } from "../../../../types/UnidadMedida/IUnidadMedidaPost";

const steps = ["Información General", "Detalles", "Ingredientes"]; // Define los pasos del formulario.

interface ManufacturadosFormProps {
  activeStep: number;
  handleNext: () => void;
  handleBack: () => void;
  elementActive: any;
  itemService: any;
  getManufacturados: () => void;
  handleClose: () => void;
}

// Componente principal del formulario
export const ManufacturadosForm = ({
  activeStep,
  handleNext,
  handleBack,
  elementActive,
  itemService,
  getManufacturados,
  handleClose,
}: ManufacturadosFormProps) => {
  const dispatch = useAppDispatch(); // Usa dispatch de Redux.

  // Estados locales para manejar la visibilidad de los modales y los datos.
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [showImagenArticuloModal, setShowImagenArticuloModal] = useState(false);
  const [showUnidadMedidaModal, setShowUnidadMedidaModal] = useState(false);
  const [categorias, setCategorias] = useState<ICategoriaPost[]>([]);
  const [unidadesMedida, setUnidadesMedida] = useState<IUnidadMedidaPost[]>([]);
  const [imagenes, setImagenes] = useState<IImagenArticuloPost[]>([]);
  const [detalles, setDetalles] = useState<IArticuloManufacturadoDetallePost[]>([]);

  // Función para manejar el envío del formulario.
  const handleSubmit = async (values: IArticuloManufacturadoPost) => {
    handleClose();
    if (elementActive?.element) {
      await itemService.put(elementActive.element.id, values); // Actualiza el elemento existente.
    } else {
      await itemService.post(values); // Crea un nuevo elemento.
    }
    getManufacturados(); // Refresca la lista de manufacturados.
  };

  const formDetails = {
    validationSchema,
    initialValues: elementActive?.element || initialValues,
    translatedPlaceholder,
    formInputType,
  };

  // Funciones para manejar el guardado de datos en los modales.
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

  // Crea los datos para la tabla de detalles.
  function createData(insumo, cantidad, unidadMedida, index) {
    return { insumo, cantidad, unidadMedida, index };
  }

  return (
    <>
      {/* Modales para categorías, imágenes, unidades de medida y detalles */}
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

      {/* Formulario principal usando Formik */}
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
              {/* Paso 1: Información General */}
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
              {/* Paso 2: Detalles */}
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
              {/* Paso 3: Ingredientes */}
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
                        {/* Mapea los detalles y renderiza un TableRow para cada uno */}
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
