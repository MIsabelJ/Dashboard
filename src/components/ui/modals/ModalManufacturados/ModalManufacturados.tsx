import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
// ---------- ARCHIVOS----------
import { useAppSelector } from "../../../../hooks/redux";
// INTERFACES
import { IUnidadMedida } from "../../../../types/UnidadMedida/IUnidadMedida";
import { IArticuloManufacturadoDetalle } from "../../../../types/ArticuloManufacturadoDetalle/IArticuloManufacturadoDetalle";
import { IImagenArticulo } from "../../../../types/ImagenArticulo/IImagenArticulo";
import { ICategoria } from "../../../../types/Categoria/ICategoria";
import { IArticuloManufacturadoPost } from "../../../../types/ArticuloManufacturado/IArticuloManufacturadoPost";
import { IArticuloManufacturadoDetallePost } from "../../../../types/ArticuloManufacturadoDetalle/IArticuloManufacturadoDetallePost";
// SERVICES
import { UnidadMedidaService } from "../../../../services/UnidadMedidaService";
import { CategoriaService } from "../../../../services/CategoriaService";
import { ManufacturadoDetalleService } from "../../../../services/ManufacturadoDetalleService";
import { ImagenArticuloService } from "../../../../services/ImagenArticuloService";
// MODALS
import { UnidadMedidaModal } from "../ModalUnidadMedida/ModalUnidadMedida";
import { ImagenArticuloModal } from "../ModalImagenArticulo/ModalImagenArticulo";
import { ManufacturadosDetalleModal } from "../ModalManufacturadosDetalle/ModalManufacturadosDetalle";
// ---------- ESTILOS ----------
import { Modal, Form } from "react-bootstrap";
import {
  Autocomplete,
  Box,
  Grid,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Button,
  AutocompleteRenderGroupParams,
  Divider,
  InputBase,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRounded from "@mui/icons-material/EditRounded";
//import SearchIcon from "@mui/icons-material/Search";
import { alpha, darken, lighten, styled } from "@mui/material/styles";


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

// ESTILOS de la BARRA DE BÚSQUEDA
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const API_URL = import.meta.env.VITE_API_URL;

// ---------- FORMIK ----------
const initialValues : IArticuloManufacturadoPost = {
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

export const validationSchema = Yup.object({
  // denominacion: Yup.string().required("Campo requerido"),
  // precioVenta: Yup.number().required("Campo requerido"),
  // descripcion: Yup.string().required("Campo requerido"),
  // tiempoEstimadoMinutos: Yup.number().required("Campo requerido"),
  // preparacion: Yup.string().required("Campo requerido"),
  // articuloManufacturadoDetalles: Yup.array().required("Campo requerido"),
  // idUnidadMedida: Yup.number().required("Campo requerido"),
  // idCategoria: Yup.number().required("Campo requerido"),
});

const steps = [
  "Información General",
  "Detalles",
  "Insumos Necesarios",
  "Imágenes",
];

// ---------- INTERFAZ ----------
interface IManufacturadosModalProps {
  handleSave: (detalle: IArticuloManufacturadoPost) => void;
  getManufacturados: () => void;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
}

// ------------------------------ FUNCIÓN PRINCIPAL ------------------------------
export const ModalArticuloManufacturado = ({
  handleSave,
  getManufacturados,
  openModal,
  setOpenModal,
}: IManufacturadosModalProps) => {
  // -------------------- STATES --------------------
  const [activeStep, setActiveStep] = useState(0);
  // Barra de búsqueda para detalles manufacturados
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState<any[]>([]);

  const [idImages, setIdImages] = useState<string[]>([]);
  const [images, setImages] = useState<IImagenArticulo[]>([]);

  const [showDetallesModal, setShowDetallesModal] = useState<boolean>(false);
  const [detalles, setDetalles] = useState<IArticuloManufacturadoDetalle[]>([]);
  const [idDetalles, setIdDetalles] = useState<number[]>([]);

  //Abre el modal de unidad de medida
  const [showUnidadMedidaModal, setShowUnidadMedidaModal] =
    useState<boolean>(false);
  //Guarda los valores de todas las unidades de medida que existen y que vayan a añadirse con el useEffect
  const [unidadesMedida, setUnidadesMedida] = useState<IUnidadMedida[]>([]);
  //Utilizado para dar formato a los elementos del dropdown de unidades de medida
  const [opcionesUnidadMedida, setOpcionesUnidadMedida] = useState<
    { label: string; id: number }[]
  >([]);

  const [categorias, setCategorias] = useState<ICategoria[]>([]);

  // -------------------- FORMIK --------------------
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const manufacturado: IArticuloManufacturadoPost = {
        ...values,
        idArticuloManufacturadoDetalles: detalles.map((d) => d.id),
        idImagenes: idImages,
      };
      console.log("Imagenes para guardar")
      console.log(idImages)
      console.log("Manufact")
      console.log(manufacturado);
      handleSave(manufacturado);
      getManufacturados();
      handleCloseModal();
    },
  });

  // -------------------- SERVICES --------------------
  const manufacturadoDetalleService = new ManufacturadoDetalleService(
    API_URL + "/articulo-manufacturado-detalle"
  );
  const unidadMedidaService = new UnidadMedidaService(
    API_URL + "/unidad-medida"
  );
  const categoriaService = new CategoriaService(API_URL + "/categoria");
  const imagenArticuloService = new ImagenArticuloService(
    API_URL + "/imagen-articulo"
  );

  // -------------------- HANDLERS --------------------
  // Barra de búsqueda para detalles manufacturados
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSaveDetalle = async (
    manufacturadoDetalle: IArticuloManufacturadoDetallePost
  ) => {
    try {
      const result = await manufacturadoDetalleService.post(
        manufacturadoDetalle
      );
      setDetalles([...detalles, result]);
      setIdDetalles([...idDetalles, result.id]);
      formik.setFieldValue("idArticuloManufacturadoDetalles", [
        ...detalles,
        result,
      ]);
      // getManufacturadoDetalle();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteDetalle = async (id: number) => {
    if(id){
      try {
        await manufacturadoDetalleService.delete(id);
        setDetalles(detalles.filter((d) => d.id !== id));
        setIdDetalles(idDetalles.filter((d) => d !== id));
      } catch (error) {
        console.error(error);
      }
    }

  }

  const handleCloseModal = () => {
    setOpenModal(false);
    formik.resetForm();
    setDetalles([]);
    setIdImages([]);
    setActiveStep(0); // Resetear el stepper al cerrar el modal
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      try {
        console.log(formik.values);
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

  const getCategorias = async () => {
    const response = await categoriaService.getAll();
    setCategorias(response);
  };

  const addUnidadMedida = (unidadMedida: IUnidadMedida) => {
    setUnidadesMedida([...unidadesMedida, unidadMedida]);
    setShowUnidadMedidaModal(false);
  };

  const addDetalles = (detalle: IArticuloManufacturadoDetalle) => {
    console.log("Detalle agregado:", detalle);
    setDetalles((prevDetalles) => [...prevDetalles, detalle]);
    setShowDetallesModal(false);
  };

  // BARRA DE BÚSQUEDA
  // Obtener los datos de la tabla en su estado inicial (sin datos)
  const dataTable = useAppSelector((state) => state.tableReducer.dataTable);

  // -------------------- EFFECTS --------------------
  // BARRA DE BÚSQUEDA
  // useEffect va a estar escuchando el estado 'dataTable' para actualizar los datos de las filas con los datos de la tabla
  useEffect(() => {
    const filteredRows = dataTable.filter((row) =>
      Object.values(row).some((value: any) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setRows(filteredRows);
  }, [dataTable, searchTerm]);

  //Trae las unidades de medida, detalles y categorías ya creadas
  useEffect(() => {
    const getUnidadesMedida = async () => {
      const response = await unidadMedidaService.getAll();
      setUnidadesMedida(response);
    };
    getUnidadesMedida();
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
    console.log("Detalles actualizados:", detalles);
    const opciones = detalles.map((detalles) => ({
      label: detalles.articuloInsumo.denominacion,
      id: detalles.id,
    }));
    setOpcionesUnidadMedida(opciones); // TODO: ?
  }, [detalles]);

  useEffect(() => {
    getImages();
    console.log("idImages");
    console.log(idImages);
  }, [idImages]);

  // -------------------- RENDER --------------------
  return (
    <>
      <Modal show={openModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Articulo Manufacturado</Modal.Title>
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
                        <Grid item xs={4}>
                          {/* PRECIO VENTA */}
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
                      </Grid>
                      {/* DESCRIPCION */}
                      <Form.Group controlId="descripcion" className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Describa el producto"
                          name="descripcion"
                          value={formik.values.descripcion}
                          onChange={formik.handleChange}
                          isInvalid={
                            formik.touched.descripcion &&
                            !!formik.errors.descripcion
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.descripcion}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </>
                  )}
                  {activeStep === 1 && (
                    <>
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
                      {/* PREPARACION */}
                      <Form.Group controlId="preparacion" className="mb-3">
                        <Form.Label>Preparación</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Ingrese la receta"
                          name="preparacion"
                          value={formik.values.preparacion}
                          onChange={formik.handleChange}
                          isInvalid={
                            formik.touched.preparacion &&
                            !!formik.errors.preparacion
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.preparacion}
                        </Form.Control.Feedback>
                      </Form.Group>
                      {/* TIEMPO DE ESTIMADO EN MINUTOS */}
                      <Form.Group
                        controlId="tiempoEstimadoMinutos"
                        className="mb-3"
                      >
                        <Form.Label>
                          Tiempo estimado de preparación (minutos)
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Ingrese el tiempo de preparación"
                          name="tiempoEstimadoMinutos"
                          value={formik.values.tiempoEstimadoMinutos}
                          onChange={formik.handleChange}
                          isInvalid={
                            formik.touched.tiempoEstimadoMinutos &&
                            !!formik.errors.tiempoEstimadoMinutos
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.tiempoEstimadoMinutos}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </>
                  )}
                  {activeStep === 2 && (
                    <>
                      {/* DETALLES MANUFACTURADO */}
                      <Form.Group
                        controlId="idArticuloManufacturadoDetalles"
                        className="mb-3"
                        style={{ marginBottom: "2rem" }}
                      >
                        <Form.Label style={{ marginBottom: "1rem" }}>
                          Insumos
                        </Form.Label>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item display="flex" justifyContent="flex-start">
                            <Button
                              onClick={() => {
                                setShowDetallesModal(true);
                              }}
                              variant="contained"
                              startIcon={<AddIcon />}
                            >
                              Añadir insumo
                            </Button>
                          </Grid>
                          <Divider
                            style={{ width: "100%", margin: "1rem 0" }}
                          />
                          <Search
                            style={{
                              flexGrow: 1,
                              marginLeft: "1rem",
                              marginRight: "1rem",
                              backgroundColor: "#f0f0f0",
                              marginBottom: "1rem",
                            }}
                          >
                            <SearchIconWrapper>
                              {/* <SearchIcon /> */}
                            </SearchIconWrapper>
                            <StyledInputBase
                              value={searchTerm}
                              onChange={handleSearch}
                              placeholder="Buscar Insumo..."
                              inputProps={{ "aria-label": "search" }}
                            />
                          </Search>
                          <div
                            style={{
                              maxHeight: "150px",
                              overflowY: "auto",
                              marginLeft: "1rem",
                            }}
                          >
                            {detalles.length > 0 && (
                              <ul
                                style={{
                                  paddingLeft: 0,
                                  listStyleType: "none",
                                }}
                              >
                                {detalles.map((detalle, index) => (
                                  <div
                                    key={index}
                                    style={{ marginBottom: "1rem" }}
                                  >
                                    <Grid
                                      container
                                      spacing={1}
                                      alignItems="center"
                                      style={{ marginBottom: "1rem" }}
                                    >
                                      <Grid
                                        item
                                        xs={3}
                                      >
                                        <TextField
                                          id="outlined-basic"
                                          label="Insumo"
                                          variant="outlined"
                                          value={
                                            detalle.articuloInsumo.denominacion
                                          }
                                          disabled
                                          fullWidth
                                        />
                                      </Grid>
                                      <Grid
                                        item
                                        xs={3}
                                      >
                                        <TextField
                                          id="outlined-basic"
                                          label="Cantidad"
                                          variant="outlined"
                                          value={detalle.cantidad}
                                          disabled
                                          fullWidth
                                        />
                                      </Grid>
                                      <Grid
                                        item
                                        xs={3}
                                      >
                                        <TextField
                                          id="outlined-basic"
                                          label="Unidad de Medida"
                                          variant="outlined"
                                          value={
                                            detalle.articuloInsumo.unidadMedida.denominacion
                                          }
                                          disabled
                                          fullWidth
                                        />
                                      </Grid>
                                      <Grid
                                        item
                                        xs={3}
                                      >
                                        <IconButton aria-label="delete" onClick={() => handleDeleteDetalle(detalle.id)}>
                                          <DeleteIcon />
                                        </IconButton>
                                        <IconButton aria-label="edit">
                                          <EditRounded color="primary" />
                                        </IconButton>
                                      </Grid>
                                    </Grid>
                                  </div>
                                ))}
                              </ul>
                            )}
                          </div>
                        </Grid>
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.idArticuloManufacturadoDetalles}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </>
                  )}
                  {activeStep === 3 && (
                    <>
                      {/* IMAGENES */}
                      <Form.Group controlId="idImagenes" className="mb-3">
                        <Form.Label>Imágenes</Form.Label>
                        <ImagenArticuloModal
                          images={images}
                          getImages={getImages}
                          setIdImages={setIdImages}
                        />
                      </Form.Group>
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
      {/* MODALS */}
      <UnidadMedidaModal
        show={showUnidadMedidaModal}
        handleClose={() => setShowUnidadMedidaModal(false)}
        addUnidadMedida={addUnidadMedida}
      />
      <ManufacturadosDetalleModal
        handleSave={handleSaveDetalle}
        openModal={showDetallesModal}
        setOpenModal={setShowDetallesModal}
      />
    </>
  );
};
