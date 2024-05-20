import React from "react";
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
<<<<<<< HEAD
import { IArticuloManufacturado } from "../../../../types/ArticuloManufacturado/IArticuloManufacturado";
=======
import { IArticuloManufacturadoPost } from "../../../../types/ArticuloManufacturado/IArticuloManufacturadoPost";
>>>>>>> 00be6ab0c47a47f261280afa5981ea5d215a94df
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

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

  function createData(insumo: string, cantidad: number, unidadMedida: string) {
    return { insumo, cantidad, unidadMedida };
  }

  const rows = [
    createData("Agua", 2, "litros"),
    createData("Harina", 500, "gramos"),
    createData("Salsa", 300, "mililitros"),
  ];

  return (
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
<<<<<<< HEAD
          {activeStep === 0 && (
            <>
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
              <Field
                as={TextField}
                id="outlined-precioVenta"
                label={translatedPlaceholder.precioVenta}
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                name="precioVenta"
                value={formDetails.initialValues.precioVenta}
                type="number"
                onChange={(e) => {
                  setFieldValue("precioVenta", parseFloat(e.target.value));
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
              <Field
                as={TextField}
                id="outlined-unidadMedida"
                label={translatedPlaceholder.unidadMedida}
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                name="unidadMedida"
                value={formDetails.initialValues.unidadMedida.denominacion}
                onChange={(e) => {
                  setFieldValue("unidadMedida", e.target.value);
                  if (elementActive) {
                    dispatch(
                      setElementActive({
                        element: {
                          ...elementActive.element,
                          unidadMedida: e.target.value,
                        },
                      })
                    );
                  }
                }}
              />
              <Field
                as={TextField}
                id="outlined-descripcion"
                label={translatedPlaceholder.descripcion}
                variant="outlined"
                fullWidth
                multiline
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
            </>
          )}
          {activeStep === 1 && (
            <>
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
              <Field
                as={TextField}
                id="outlined-imagenes"
                label={translatedPlaceholder.imagenes}
                variant="outlined"
                fullWidth
                name="imagenes"
                value={formDetails.initialValues.imagenes}
                onChange={(e) => {
                  setFieldValue("imagenes", e.target.value);
                  if (elementActive) {
                    dispatch(
                      setElementActive({
                        element: {
                          ...elementActive.element,
                          imagenes: e.target.value,
                        },
                      })
                    );
                  }
                }}
              />
            </>
          )}
          {activeStep === 2 && (
            <div>
              <Button
                variant="outlined"
                startIcon={
                  <AddIcon />
                } /*onClick={<ModalManufacturadoDetalle/>}*/
              >
                Agregar un ingrediente
              </Button>
              
            </div>
          )}
=======
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
                      <InputLabel id="demo-simple-select-label">
                        Categoría
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        // value={categoria}
                        label="Categoria"
                        // onChange={handleChange}
                      >
                        <MenuItem value={10}>Añadir Categoría</MenuItem>
                        <MenuItem value={20}>Hamburguesas</MenuItem>
                        <MenuItem value={30}>Pizzas</MenuItem>
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
                      setFieldValue("precioVenta", parseFloat(e.target.value));
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
                      <InputLabel id="demo-simple-select-label">
                        Unidad de Medida
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        // value={unidadMedida}
                        label="Unidad de Medida"
                        // onChange={handleChange}
                      >
                        <MenuItem value={10}>Añadir Unidad de Medida</MenuItem>
                        <MenuItem value={20}>Gramos</MenuItem>
                        <MenuItem value={30}>Porciones</MenuItem>
                        <MenuItem value={40}>Unidad</MenuItem>
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
                      <InputLabel id="demo-simple-select-label">
                        {translatedPlaceholder.idImagenes}
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        // value={imagenes}
                        label="Imagenes"
                        // onChange={handleChange}
                      >
                        <MenuItem value={10}>Añadir Imagen</MenuItem>
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
                    startIcon={
                      <AddIcon />
                    } /*onClick={<ModalManufacturadoDetalle/>}*/
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
                      {rows.map((row) => (
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
                            <IconButton aria-label="delete">
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
>>>>>>> 00be6ab0c47a47f261280afa5981ea5d215a94df
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
  );
};
