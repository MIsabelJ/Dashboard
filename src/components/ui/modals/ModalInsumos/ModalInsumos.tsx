import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
// ---------- ARCHIVOS----------
// INTERFACES
import { IUnidadMedida } from "../../../../types/UnidadMedida/IUnidadMedida";
import { IArticuloInsumoPost } from "../../../../types/ArticuloInsumo/IArticuloInsumoPost";
import { ICategoria } from "../../../../types/Categoria/ICategoria";
// SERVICES
import { UnidadMedidaService } from "../../../../services/UnidadMedidaService";
import { CategoriaService } from "../../../../services/CategoriaService";
// MODALS
import { ModalImagen } from "../ModalImagen/ModalImagen";
// ---------- ESTILOS ----------
import { Modal, Form, InputGroup } from "react-bootstrap";
import {
  Autocomplete,
  AutocompleteRenderGroupParams,
  Box,
  Button,
  Grid,
  Step,
  StepLabel,
  Stepper,
  TextField,
} from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
import { darken, lighten, styled } from "@mui/material/styles";
import { IImagen } from "../../../../types/Imagen/IImagen";
import { InsumoService } from "../../../../services/InsumoService";
import { useAppDispatch } from "../../../../hooks/redux";
import { IArticuloInsumo } from "../../../../types/ArticuloInsumo/IArticuloInsumo";
import { setDataTable } from "../../../../redux/slices/TablaReducer";
import { ImagenService } from "../../../../services/ImagenService";
import Swal from "sweetalert2";

// ------------------------------ CÓDIGO ------------------------------
// ESTILOS del item de cabecera en el combo de CATEGORÍA
const GroupHeader = styled("div")(({ theme }) => ({
  position: "relative",
  top: "-8px",
  padding: "4px 10px",
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === "light"
      ? lighten(theme.palette.primary.light, 0.85)
      : darken(theme.palette.primary.main, 0.8),
}));

// ESTILOS del item de subcategoría en el combo de CATEGORÍA
const GroupItems = styled("ul")({
  padding: 0,
});

const API_URL = import.meta.env.VITE_API_URL;

// ---------- FORMIK ----------
const initialValues: IArticuloInsumoPost = {
  denominacion: "",
  precioVenta: 0,
  imagenes: [],
  precioCompra: 0,
  stockActual: 0,
  stockMaximo: 0,
  esParaElaborar: true,
  idUnidadMedida: 0,
  idCategoria: 0,
};

//TODO: Agregar mensaje de error que traiga el error de
//steps anteriores al último step del stepper

const validationSchema = Yup.object({
  denominacion: Yup.string().required("Campo requerido"),
  precioVenta: Yup.number()
    .required("Campo requerido")
    .min(0, "El precio de venta debe ser mayor o igual a 0."),
  precioCompra: Yup.number()
    .required("Campo requerido")
    .min(0, "El precio de compra debe ser mayor o igual a 0."),
  //stockMinimo: Yup.number().required("Campo requerido").min(1, "El stock minimo debe ser mayor que 0."),
  stockActual: Yup.number()
    .required("Campo requerido")
    //.min(Yup.ref("stockMinimo"), "El stock actual debe ser mayor o igual al stock minimo.")
    .min(1, "El stock actual debe ser mayor que 0.")
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

const steps = ["Información del Artículo", "Información Adicional", "Imágenes"];

// ---------- INTERFAZ ----------
interface IArticuloInsumoModalProps {
  show: boolean;
  handleClose: () => void;
  selectedId?: number;
}

// ------------------------------ COMPONENTE PRINCIPAL ------------------------------
export const ModalArticuloInsumo = ({
  show,
  handleClose,
  selectedId,
}: IArticuloInsumoModalProps) => {
  // -------------------- STATES --------------------
  const [activeStep, setActiveStep] = useState(0);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previousImages, setPreviousImages] = useState<IImagen[]>([]);

  //Guarda los valores de todas las unidades de medida que existen y que vayan a añadirse con el useEffect
  const [unidadesMedida, setUnidadesMedida] = useState<IUnidadMedida[]>([]);
  //Utilizado para dar formato a los elementos del dropdown de unidades de medida
  const [opcionesUnidadMedida, setOpcionesUnidadMedida] = useState<
    { label: string; id: number }[]
  >([]);
  //Guarda los valores de todas categorías
  const [categorias, setCategorias] = useState<ICategoria[]>([]);

  // -------------------- FORMIK --------------------
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Mostrar un mensaje de carga mientras se suben los archivos
      Swal.fire({
        title: "Cargando Datos del Insumo",
        text: "Espere mientras se suben los archivos.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      let actualImages: IImagen[] = [];
      if (selectedFiles.length > 0) {
        actualImages = await imagenService.upload(selectedFiles)
      }
      const insumo: IArticuloInsumoPost = {
        ...values,
        imagenes: [...previousImages, ...actualImages],
      };
      insumo.imagenes;
      handleSave(insumo);
    },
  });

  // -------------------- SERVICES --------------------
  const unidadMedidaService = new UnidadMedidaService(
    API_URL + "/unidad-medida"
  );
  const imagenService = new ImagenService(API_URL + "/imagen-articulo");
  const insumoService = new InsumoService(API_URL + "/articulo-insumo");
  const categoriaService = new CategoriaService(API_URL + "/categoria");
  const dispatch = useAppDispatch();
  // -------------------- HANDLERS --------------------

  const handleSave = async (insumo: IArticuloInsumoPost) => {
    if (selectedId) {
      try {
        await insumoService.put(selectedId, insumo);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await insumoService.post(insumo);
      } catch (error) {
        console.error(error);
      }
    }
    getAllInsumo();
    swalAlert("Éxito", "Datos subidos correctamente", "success");
    internalHandleClose();
  };

  const internalHandleClose = () => {
    handleClose();
    formik.resetForm();
    setSelectedFiles([]);
    setPreviousImages([]);
    setActiveStep(0);
  };

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      try {
        formik.handleSubmit();
      } catch (err) {
        console.log(err);
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // -------------------- MANEJO DE CATEGORÍAS --------------------
  interface CategoriaData {
    id: number;
    denominacion: string;
    parent: number | null;
  }

  const categoriasData: CategoriaData[] = [];
  const subCategorias: CategoriaData[] = [];

  const formatCategorias = () => {
    categorias.forEach((categoria) => {
      if (categoria.subCategorias.length > 0) {
        categoria.subCategorias.forEach((subCategoria) => {
          subCategorias.push({
            id: subCategoria.id,
            denominacion: subCategoria.denominacion,
            parent: null,
          });
        });
      }
    });
    categorias.forEach((categoria) => {
      if (
        !subCategorias.find((subCategoria) => subCategoria.id === categoria.id)
      ) {
        categoriasData.push({
          id: categoria.id,
          denominacion: categoria.denominacion,
          parent: null,
        });
        if (categoria.subCategorias.length > 0) {
          categoria.subCategorias.forEach((subCategoria) => {
            categoriasData.push({
              id: subCategoria.id,
              denominacion: subCategoria.denominacion,
              parent: categoria.id,
            });
          });
        }
      }
    });
    return categoriasData;
  };

  const categoriasFiltradas = formatCategorias();

  // -------------------- FUNCIONES --------------------

  const swalAlert = (
    title: string,
    content: string,
    icon: "error" | "success"
  ) => {
    Swal.fire(title, content, icon);
  };

  const getAllInsumo = async () => {
    await insumoService.getAll().then((insumoData) => {
      dispatch(setDataTable(insumoData));
    });
  };

  const getOneInsumo = async (id: number) => {
    try {
      const articuloInsumo = await insumoService.getById(id);
      if (articuloInsumo) {
        setPreviousImages(articuloInsumo.imagenes);
        formik.setValues({
          denominacion: articuloInsumo.denominacion,
          precioVenta: articuloInsumo.precioVenta,
          imagenes: articuloInsumo.imagenes,
          precioCompra: articuloInsumo.precioCompra,
          stockActual: articuloInsumo.stockActual,
          stockMaximo: articuloInsumo.stockMaximo,
          esParaElaborar: articuloInsumo.esParaElaborar,
          idUnidadMedida: articuloInsumo.unidadMedida.id,
          idCategoria: articuloInsumo.categoria.id, 
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // -------------------- EFFECTS --------------------
  useEffect(() => {
    if (selectedId) {
      getOneInsumo(selectedId);
    }
  }, [selectedId]);


  //Trae las unidades de medida y las categorías de la base de datos
  useEffect(() => {
    const getUnidadesMedida = async () => {
      const response = await unidadMedidaService.getAll();
      setUnidadesMedida(response);
    };
    getUnidadesMedida();
    const getCategorias = async () => {
      const response = await categoriaService.getAll();
      setCategorias(response);
    };
    getCategorias();
  }, []);

  //Da formato a las unidades de medida para el dropdown de MUI
  useEffect(() => {
    const opciones = unidadesMedida.map((unidadMedida) => ({
      label: unidadMedida.denominacion,
      id: unidadMedida.id,
    }));
    setOpcionesUnidadMedida(opciones);
  }, [unidadesMedida]);

  // -------------------- RENDER --------------------
  return (
    <>
      <Modal show={show} onHide={internalHandleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedId ? "Editar" : "Agregar"} Artículo Insumo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
          <Box sx={{ width: "100%" }}>
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{ padding: "20px 0" }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button onClick={internalHandleClose}>Finalizar</Button>
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Form onSubmit={formik.handleSubmit}>
                  {activeStep === 0 && (
                    <>
                      {/* DENOMINACION */}
                      <Form.Group controlId="denominacion" className="mb-3">
                        <Form.Label>Denominación</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ingrese la denominación"
                          name="denominacion"
                          value={formik.values.denominacion}
                          onChange={formik.handleChange}
                          isInvalid={
                            formik.touched.denominacion &&
                            !!formik.errors.denominacion
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.denominacion}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          {/* PRECIO DE VENTA */}
                          <Form.Group controlId="precioVenta" className="mb-3">
                            <Form.Label>Precio de Venta</Form.Label>
                            <InputGroup>
                              <InputGroup.Text>$</InputGroup.Text>
                              <Form.Control
                                type="number"
                                placeholder="Ingrese el precio de venta"
                                name="precioVenta"
                                value={formik.values.precioVenta}
                                onChange={formik.handleChange}
                                isInvalid={
                                  formik.touched.precioVenta &&
                                  !!formik.errors.precioVenta
                                }
                                disabled={formik.values.esParaElaborar} // Deshabilita si es para elaborar
                              />
                            </InputGroup>
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.precioVenta}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Grid>
                        <Grid item xs={4}>
                          {/* PRECIO DE COMPRA */}
                          <Form.Group controlId="precioCompra" className="mb-3">
                            <Form.Label>Precio de Compra</Form.Label>
                            <InputGroup>
                              <InputGroup.Text>$</InputGroup.Text>
                              <Form.Control
                                type="number"
                                placeholder="Ingrese el precio de compra"
                                name="precioCompra"
                                value={formik.values.precioCompra}
                                onChange={formik.handleChange}
                                isInvalid={
                                  formik.touched.precioCompra &&
                                  !!formik.errors.precioCompra
                                }
                              />
                            </InputGroup>
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.precioCompra}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Grid>
                        <Grid
                          item
                          xs={4}
                          display="flex"
                          alignItems="end"
                          justifyContent="center"
                        >
                          {/* ES PARA ELABORAR */}
                          <Form.Group
                            controlId="esParaElaborar"
                            className="mb-3"
                          >
                            <Form.Check
                              type="checkbox"
                              label="Es para Elaborar"
                              name="esParaElaborar"
                              checked={formik.values.esParaElaborar}
                              onChange={formik.handleChange}
                            />
                          </Form.Group>
                        </Grid>
                      </Grid>
                    </>
                  )}
                  {activeStep === 1 && (
                    <>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          {/* STOCK MÍNIMO */}
                          <Form.Group controlId="stockMinimo" className="mb-3">
                            <Form.Label>Stock Mínimo</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Ingrese el stock mínimo"
                              name="stockMínimo"
                              value={0}
                              onChange={formik.handleChange}
                              // isInvalid={
                              //   formik.touched.stockMinimo &&
                              //   !!formik.errors.stockMinimo
                              // }
                            />
                            <Form.Control.Feedback type="invalid">
                              {/* {formik.errors.stockMinimo} */}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Grid>
                        <Grid item xs={4}>
                          {/* STOCK ACTUAL */}
                          <Form.Group controlId="stockActual" className="mb-3">
                            <Form.Label>Stock Actual</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Ingrese el stock actual"
                              name="stockActual"
                              value={formik.values.stockActual}
                              onChange={formik.handleChange}
                              isInvalid={
                                formik.touched.stockActual &&
                                !!formik.errors.stockActual
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.stockActual}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Grid>
                        <Grid item xs={4}>
                          {/* STOCK MAXIMO */}
                          <Form.Group controlId="stockMaximo" className="mb-3">
                            <Form.Label>Stock Máximo</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Ingrese el stock máximo"
                              name="stockMaximo"
                              value={formik.values.stockMaximo}
                              onChange={formik.handleChange}
                              isInvalid={
                                formik.touched.stockMaximo &&
                                !!formik.errors.stockMaximo
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.stockMaximo}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Grid>
                      </Grid>
                      {/* UNIDAD DE MEDIDA */}
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={6}>
                          <Form.Group
                            controlId="idUnidadMedida"
                            className="mb-3"
                          >
                            <Form.Label>Unidad de Medida</Form.Label>
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={opcionesUnidadMedida}
                              sx={{ width: "100%" }}
                              value={
                                opcionesUnidadMedida.find(
                                  (option) =>
                                    option.id === formik.values.idUnidadMedida
                                ) || null
                              }
                              onChange={(event, value) =>
                                formik.setFieldValue(
                                  "idUnidadMedida",
                                  value?.id
                                )
                              }
                              isOptionEqualToValue={(option, value) =>
                                option.id === value.id
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Seleccione la unidad"
                                />
                              )}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.idUnidadMedida}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Grid>
                        <Grid item xs={6}>
                          {/* CATEGORIA */}
                          <Form.Group controlId="idCategoria" className="mb-3">
                            <Form.Label>Categoría</Form.Label>
                            <Autocomplete
                              id="idCategoria"
                              options={categoriasFiltradas}
                              value={
                                categoriasFiltradas.find(
                                  (categoria) =>
                                    categoria.id === formik.values.idCategoria
                                ) || null
                              }
                              groupBy={(option) =>
                                option.parent
                                  ? categoriasFiltradas.find(
                                      (categoria) =>
                                        categoria.id === option.parent
                                    )?.denominacion || ""
                                  : option.denominacion
                              }
                              getOptionLabel={(option) => option.denominacion}
                              getOptionKey={(option) => option.id}
                              onChange={(event, value) => {
                                formik.setFieldValue("idCategoria", value?.id);
                              }}
                              isOptionEqualToValue={(option, value) =>
                                option.id === value.id
                              }
                              renderInput={(params) => (
                                <TextField {...params} label="Categorías" />
                              )}
                              renderGroup={(
                                params: AutocompleteRenderGroupParams
                              ) => (
                                <li key={params.key}>
                                  <GroupHeader>{params.group}</GroupHeader>
                                  <GroupItems>{params.children}</GroupItems>
                                </li>
                              )}
                            />
                          </Form.Group>
                        </Grid>
                      </Grid>
                    </>
                  )}
                  {activeStep === 2 && (
                    <>
                      {/* IMAGENES */}
                      <Form.Group className="mb-3"></Form.Group>
                      <Form.Label>Imágenes</Form.Label>
                      <ModalImagen
                        previousImages={previousImages}
                        setSelectedFiles={setSelectedFiles}
                        selectedFiles={selectedFiles}
                        baseUrl="imagen-articulo"
                        setPreviousImages={setPreviousImages}
                      />
                    </>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      pt: 2,
                      alignItems: "center",
                    }}
                  >
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                    >
                      Atrás
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    <Button
                      onClick={handleNext}
                      variant="contained"
                      color={
                        activeStep === steps.length - 1 ? "success" : "primary"
                      }
                    >
                      {activeStep === steps.length - 1
                        ? "Guardar"
                        : "Siguiente"}
                    </Button>
                  </Box>
                </Form>
              </React.Fragment>
            )}
          </Box>
        </Modal.Body>
      </Modal>
      {/* <UnidadMedidaModal
        selectedId={selectedId}
        show={showUnidadMedidaModal}
        handleClose={() => { setOpenModal(false); setSelectedId(undefined) }}
      /> */}
    </>
  );
};
