import React, { useEffect, useState } from "react";
import { Modal, Form } from "react-bootstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { IArticuloInsumoPost } from "../../../../types/ArticuloInsumo/IArticuloInsumoPost";
import {
  Autocomplete,
  AutocompleteRenderGroupParams,
  Button,
  Grid,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { UnidadMedidaModal } from "../ModalUnidadMedida/ModalUnidadMedida";
import { IUnidadMedida } from "../../../../types/UnidadMedida/IUnidadMedida";
import { UnidadMedidaService } from "../../../../services/UnidadMedidaService";
import { ImagenArticuloModal } from "../ModalImagenArticulo/ModalImagenArticulo";
import { darken, lighten, styled } from "@mui/material/styles";
import { ICategoria } from "../../../../types/Categoria/ICategoria";
import { CategoriaService } from "../../../../services/CategoriaService";
import { IImagenArticulo } from "../../../../types/ImagenArticulo/IImagenArticulo";

//Estilos del item de cabecera en el combo de categoría
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

//Estilos del item de subcategoría en el combo de categoría
const GroupItems = styled("ul")({
  padding: 0,
});


const API_URL = import.meta.env.VITE_API_URL;
interface IArticuloInsumoModalProps {
  getInsumos: () => void;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  handleSave: (insumo: IArticuloInsumoPost) => void;
}

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

export const ModalArticuloInsumo = ({
  getInsumos,
  openModal,
  setOpenModal,
  handleSave,
}: IArticuloInsumoModalProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [idImages, setIdImages] = useState<string[]>([]);
  const [images, setImages] = useState<IImagenArticulo[]>([]);
  //Abre el modal de unidad de medida
  const [showUnidadMedidaModal, setShowUnidadMedidaModal] =
    useState<boolean>(false);
  //Guarda los valores de todas las unidades de medida que existen y que vayan a añadirse con el useEffect
  const [unidadesMedida, setUnidadesMedida] = useState<IUnidadMedida[]>([]);
  //Guarda los valores de todas categorías
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  //Utilizado para dar formato a los elementos del dropdown de unidades de medida
  const [opcionesUnidadMedida, setOpcionesUnidadMedida] = useState<
    { label: string; id: number }[]
  >([]);

  const getImages = () => {
    fetch(`${API_URL}/imagen-articulo/getImages`)
      .then((res) => res.json())
      .then((data) => {
        const imagesData = data;
        setImages(imagesData);
      });
  };


  const categoriasData: ICategoria[] = [];
  const subCategorias: ICategoria[] = [];

  // TODO: ver por qué está repitiendo a la subcategoría como si fuera una categoría principal.

  const formatCategorias = () => {

    categorias.forEach((categoria) => {
      if (categoria.subCategorias.length > 0) {
        categoria.subCategorias.forEach((subCategoria) => {
          subCategorias.push(subCategoria);
        });
      }
    })
    categorias.forEach((categoria) => {
      if (!subCategorias.find((subCategoria) => subCategoria.id === categoria.id)) {
        categoriasData.push(categoria);
        // if (categoria.subCategorias.length > 0) {
        //   categoria.subCategorias.forEach((subCategoria) => {
        //     categoriasData.push();
        //   });
        // }
      }
    });
    return categoriasData;
  };

  const categoriasFiltradas = formatCategorias();

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

  const unidadMedidaService = new UnidadMedidaService(
    API_URL + "/unidad-medida"
  );
  const categoriaService = new CategoriaService(API_URL + "/categoria");

  //Funcion para agregar una nueva Unidad de Medida desde el modal
  const addUnidadMedida = (unidadMedida: IUnidadMedida) => {
    setUnidadesMedida([...unidadesMedida, unidadMedida]);
    setShowUnidadMedidaModal(false);
  };

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

  // FIXME: No funca esto
  useEffect(() => {
    // const imagesId : string[] = images.map((image) => image.id);
    setIdImages((prevIdImages) => images.map((image) => image.id));
    console.log("CONSOLE LOG DESDE INSUMO");
    console.log(idImages);
  }, [images]);

  return (
    <>
      <Modal show={openModal} onHide={handleCloseModal}>
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
                          <Form.Group controlId="idCategoria" className="mb-3">
                            <Form.Label>Categoría</Form.Label>
                            <Autocomplete
                              id="idCategoria"
                              options={categoriasFiltradas}
                              groupBy={(option) => option.parent ? categoriasData.find((categoria) => categoria.id === option.parent)?.denominacion || "" : option.denominacion}
                              getOptionLabel={(option) => option.denominacion}
                              getOptionKey={(option) => option.id}
                              onChange={(event, value) => {
                                formik.setFieldValue('idCategoria', value ? value.id : 0);
                              }}
                              isOptionEqualToValue={(option, value) =>
                                option.id === value.id
                              }
                              sx={{ width: 300 }}
                              renderInput={(params) => <TextField {...params} label="Categorías" />}
                              renderGroup={(params: AutocompleteRenderGroupParams) => (
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
      {/* <ImagenArticuloModal show={showImagenArticuloModal} handleClose={() => { setShowImagenArticuloModal(false) }} handleSave={addImagenArticulo} /> */}
    </>
  );
};
