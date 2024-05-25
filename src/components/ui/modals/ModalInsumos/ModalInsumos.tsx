import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
// ---------- ARCHIVOS----------
// INTERFACES
import { IImagenArticulo } from "../../../../types/ImagenArticulo/IImagenArticulo";
import { IUnidadMedida } from "../../../../types/UnidadMedida/IUnidadMedida";
import { IArticuloInsumoPost } from "../../../../types/ArticuloInsumo/IArticuloInsumoPost";
import { ICategoria } from "../../../../types/Categoria/ICategoria";
// SERVICES
import { UnidadMedidaService } from "../../../../services/UnidadMedidaService";
import { CategoriaService } from "../../../../services/CategoriaService";
import { ImagenArticuloService } from "../../../../services/ImagenArticuloService";
// MODALS
import { UnidadMedidaModal } from "../ModalUnidadMedida/ModalUnidadMedida";
import { ImagenArticuloModal } from "../ModalImagenArticulo/ModalImagenArticulo";
// ---------- ESTILOS ----------
import { Modal, Form } from "react-bootstrap";
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
import AddIcon from "@mui/icons-material/Add";
import { darken, lighten, styled } from "@mui/material/styles";

// ------------------------------ CÓDIGO ------------------------------
// ESTILOS del item de cabecera en el combo de CATEGORÍA
const GroupHeader = styled("div")(({ theme }) => ({
  position: "sticky",
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
  idImagenes: [],
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
  precioVenta: Yup.number().required("Campo requerido"),
  precioCompra: Yup.number().required("Campo requerido"),
  stockActual: Yup.number().required("Campo requerido"),
  stockMaximo: Yup.number().required("Campo requerido"),
  esParaElaborar: Yup.boolean(),
  idUnidadMedida: Yup.number().required("Campo requerido"),
  idCategoria: Yup.number().required("Campo requerido"),
});

const steps = ["Información del Artículo", "Información Adicional", "Imágenes"];

// ---------- INTERFAZ ----------
interface IArticuloInsumoModalProps {
  getInsumos: () => void;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  handleSave: (insumo: IArticuloInsumoPost) => void;
}

// ------------------------------ FUNCIÓN PRINCIPAL ------------------------------
export const ModalArticuloInsumo = ({
  getInsumos,
  openModal,
  setOpenModal,
  handleSave,
}: IArticuloInsumoModalProps) => {
  // -------------------- STATES --------------------
  const [activeStep, setActiveStep] = useState(0);

  const [idImages, setIdImages] = useState<string[]>([]);
  const [images, setImages] = useState<IImagenArticulo[]>([]);

  //Abre el modal de unidad de medida
  const [showUnidadMedidaModal, setShowUnidadMedidaModal] =
    useState<boolean>(false);
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
    onSubmit: (values) => {
      const insumo: IArticuloInsumoPost = {
        ...values,
        idImagenes: idImages,
      };
      console.log(insumo);
      handleSave(insumo);
      getInsumos();
      handleCloseModal();
    },
  });

  // -------------------- SERVICES --------------------
  const unidadMedidaService = new UnidadMedidaService(
    API_URL + "/unidad-medida"
  );
  const categoriaService = new CategoriaService(API_URL + "/categoria");
  const imagenArticuloService = new ImagenArticuloService(
    API_URL + "/imagen-articulo"
  );

  // -------------------- HANDLES --------------------
  const handleCloseModal = () => {
    formik.resetForm();
    setOpenModal(false);
    setIdImages([]);
    setActiveStep(0); // Resetear el stepper al cerrar el modal
  };

  const handleNext = () => {
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
  const getImages = async () => {
    if (idImages.length > 0) {
      const data: IImagenArticulo[] = await imagenArticuloService.getAllById(
        idImages
      );
      console.log("Imagenes obtenidad del array de uuid");
      console.log(data);
      const imagesData = data.filter((image) => image !== null);
      setImages(imagesData);
    }
  };

  //Funcion para agregar una nueva Unidad de Medida desde el modal
  const addUnidadMedida = (unidadMedida: IUnidadMedida) => {
    setUnidadesMedida([...unidadesMedida, unidadMedida]);
    setShowUnidadMedidaModal(false);
  };

  // -------------------- EFFECTS --------------------

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

  useEffect(() => {
    getImages();
    console.log("idImages");
    console.log(idImages);
  }, [idImages]);

  // -------------------- RENDER --------------------
  return (
    <>
      <Modal show={openModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Artículo Insumo</Modal.Title>
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
                  <Button onClick={handleCloseModal}>Finalizar</Button>
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
                        <Grid item xs={6}>
                          {/* PRECIO DE VENTA */}
                          <Form.Group controlId="precioVenta" className="mb-3">
                            <Form.Label>Precio de Venta</Form.Label>
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
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.precioVenta}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Grid>
                        <Grid item xs={6}>
                          {/* PRECIO DE COMPRA */}
                          <Form.Group controlId="precioCompra" className="mb-3">
                            <Form.Label>Precio de Compra</Form.Label>
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
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.precioCompra}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Grid>
                      </Grid>
                    </>
                  )}
                  {activeStep === 1 && (
                    <>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
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
                        <Grid item xs={6}>
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
                      <Form.Group controlId="idUnidadMedida" className="mb-3">
                        <Form.Label>Unidad de Medida</Form.Label>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={7}>
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
                                  value?.id || ""
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
                          </Grid>
                          <Grid
                            item
                            xs={5}
                            display="flex"
                            justifyContent="flex-end"
                          >
                            <Button
                              onClick={() => {
                                setShowUnidadMedidaModal(true);
                              }}
                              variant="contained"
                              startIcon={<AddIcon />}
                            >
                              Crear Unidad
                            </Button>
                          </Grid>
                        </Grid>
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.idUnidadMedida}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Grid container spacing={2}>
                        <Grid item xs={8}>
                          {/* CATEGORIA */}
                          <Form.Group controlId="idCategoria" className="mb-3">
                            <Form.Label>Categoría</Form.Label>
                            <Autocomplete
                              id="idCategoria"
                              options={categoriasFiltradas}
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
                                formik.setFieldValue(
                                  "idCategoria",
                                  value ? value.id : 0
                                );
                              }}
                              isOptionEqualToValue={(option, value) =>
                                option.id === value.id
                              }
                              sx={{ width: 300 }}
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
                  {activeStep === 2 && (
                    <>
                      {/* IMAGENES */}
                      <Form.Group
                        controlId="idImagenes"
                        className="mb-3"
                      ></Form.Group>
                      <Form.Label>Imágenes</Form.Label>
                      <ImagenArticuloModal
                        images={images}
                        getImages={getImages}
                        setIdImages={setIdImages}
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
      <UnidadMedidaModal
        show={showUnidadMedidaModal}
        addUnidadMedida={addUnidadMedida}
        handleClose={() => {
          setShowUnidadMedidaModal(false);
        }}
      />
    </>
  );
};
