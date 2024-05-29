import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
// ---------- ARCHIVOS----------
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
// INTERFACES
import { IUnidadMedida } from "../../../../types/UnidadMedida/IUnidadMedida";
import { ICategoria } from "../../../../types/Categoria/ICategoria";
import { IArticuloManufacturadoPost } from "../../../../types/ArticuloManufacturado/IArticuloManufacturadoPost";
import { IArticuloManufacturadoDetallePost } from "../../../../types/ArticuloManufacturadoDetalle/IArticuloManufacturadoDetallePost";
// SERVICES
import { UnidadMedidaService } from "../../../../services/UnidadMedidaService";
import { CategoriaService } from "../../../../services/CategoriaService";
// MODALS
import { UnidadMedidaModal } from "../ModalUnidadMedida/ModalUnidadMedida";
import { ModalImagen } from "../ModalImagen/ModalImagen";
import { ManufacturadosDetalleModal } from "../ModalManufacturadosDetalle/ModalManufacturadosDetalle";
// ---------- ESTILOS ----------
import { Modal, Form, InputGroup } from "react-bootstrap";
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
import SearchIcon from "@mui/icons-material/Search";
import { alpha, darken, lighten, styled } from "@mui/material/styles";
import { IImagen } from "../../../../types/Imagen/IImagen";
import { InsumoService } from "../../../../services/InsumoService";
import { IArticuloInsumo } from "../../../../types/ArticuloInsumo/IArticuloInsumo";
import { IArticuloManufacturado } from "../../../../types/ArticuloManufacturado/IArticuloManufacturado";
import { ManufacturadoService } from "../../../../services/ManufacturadoService";
import { setDataTable } from "../../../../redux/slices/TablaReducer";
import { ImagenArticuloService } from "../../../../services/ImagenArticuloService";
// import { IImagenArticuloPost } from "../../../../types/ImagenArticulo/IImagenArticuloPost";

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
const initialValues: IArticuloManufacturadoPost = {
  denominacion: "",
  precioVenta: 0,
  descripcion: "",
  tiempoEstimadoMinutos: 0,
  preparacion: "",
  articuloManufacturadoDetalles: [],
  imagenes: [],
  idUnidadMedida: 0,
  idCategoria: 0,
};

export const validationSchema = Yup.object({
  denominacion: Yup.string().required("Campo requerido"),
  precioVenta: Yup.number()
    .required("Campo requerido")
    .min(0, "El precio debe ser mayor o igual a 0."),
  descripcion: Yup.string().required("Campo requerido"),
  tiempoEstimadoMinutos: Yup.number()
    .required("Campo requerido")
    .min(0, "El tiempo estimado debe ser mayor o igual a 0."),
  preparacion: Yup.string().required("Campo requerido"),
  articuloManufacturadoDetalles: Yup.array().required("Campo requerido"),
  idUnidadMedida: Yup.number().required("Campo requerido"),
  idCategoria: Yup.number().required("Campo requerido"),
});

const steps = [
  "Información General",
  "Detalles",
  "Insumos Necesarios",
  "Imágenes",
];

// ---------- INTERFAZ ----------
interface IManufacturadosModalProps {
  show: boolean;
  handleClose: () => void;
  selectedId?: number;
}

// ------------------------------ COMPONENTE PRINCIPAL ------------------------------
export const ModalArticuloManufacturado = ({
  show,
  handleClose,
  selectedId
}: IManufacturadosModalProps) => {
  // -------------------- STATES --------------------
  const [activeStep, setActiveStep] = useState(0);
  // Barra de búsqueda para newDetalles manufacturados
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showDetallesModal, setShowDetallesModal] = useState<boolean>(false);
  const [newDetalles, setNewDetalles] = useState<IArticuloManufacturadoDetallePost[]>([]);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<{ articuloInsumo: IArticuloInsumo, cantidad: string }[]>([]);

  //Guarda los valores de todas las unidades de medida que existen y que vayan a añadirse con el useEffect
  const [unidadesMedida, setUnidadesMedida] = useState<IUnidadMedida[]>([]);
  //Utilizado para dar formato a los elementos del dropdown de unidades de medida
  const [opcionesUnidadMedida, setOpcionesUnidadMedida] = useState<
    { label: string; id: number }[]
  >([]);

  const [values, setValues] = useState<IArticuloManufacturado | IArticuloManufacturadoPost>()
  const [readyToPersist, setReadyToPersist] = useState<boolean>(false)
  //Guarda los valores de todas categorías
  const [categorias, setCategorias] = useState<ICategoria[]>([]);

  // -------------------- FORMIK --------------------
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const images = selectedFiles;
      const manufacturado: IArticuloManufacturadoPost = {
        ...values,
        articuloManufacturadoDetalles: newDetalles,
        imagenes: await imagenService.upload(images)
      };
      handleSave(manufacturado);
      
    },
  });

  // -------------------- SERVICES --------------------
  const unidadMedidaService = new UnidadMedidaService(
    API_URL + "/unidad-medida"
  );
  const imagenService = new ImagenArticuloService(API_URL + "/imagen-articulo");
  const insumoService = new InsumoService(API_URL + "/articulo-insumo");
  const manufacturadoService = new ManufacturadoService(API_URL + "/articulo-manufacturado");
  const categoriaService = new CategoriaService(API_URL + "/categoria");
  const dispatch = useAppDispatch()

  // -------------------- HANDLERS --------------------
  // Barra de búsqueda para newDetalles manufacturados
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };


  const handleSaveDetalle = async (detalle: IArticuloManufacturadoDetallePost) => {
    setNewDetalles([...newDetalles, detalle]);
    getInsumosSeleccionados();
    setShowDetallesModal(false);
  }

  const handleDeleteDetalle = async (index: number) => {
    setArticuloSeleccionado((prev) => {
      return prev.filter((_, i) => i !== index);
    });
    setNewDetalles((prev) => {
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSave = async (manufacturado: IArticuloManufacturadoPost) => {
    if (selectedId) {
      try {
        await manufacturadoService.put(selectedId, manufacturado);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await manufacturadoService.post(manufacturado);
      } catch (error) {
        console.error(error);
      }
    }
    getAllManufacturado();
    internalHandleClose();
    setValues(undefined);
  };

  const internalHandleClose = () => {
    setReadyToPersist(false);
    handleClose()
    formik.resetForm();
    setSelectedFiles([]);
    setActiveStep(0);
  }

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

  const handleSaveFiles = async (selectedFiles: File[]) => {

    let idImages: string[] = [];
    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append("uploads", file);
    });

    try {
      const response = await fetch(`${API_URL}/imagen-articulo/uploads`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data: IImagen[] = await response.json();
        idImages = data.map((image) => image.id);
        return idImages;
      }
      return undefined;
    } catch (error) {
      console.error("Error:", error);
    }
    //   setSelectedFiles(null);
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

  const getAllManufacturado = async () => {
    await manufacturadoService.getAll().then((manufacturadoData) => {
      dispatch(setDataTable(manufacturadoData));
    });
  };

  const getOneManufacturado = async () => {
    try {
      if (selectedId) {
        const articuloManufacturado = await manufacturadoService.getById(selectedId);
        if (articuloManufacturado) {
          const articuloManufacturadoDetallesPost: IArticuloManufacturadoDetallePost[] = articuloManufacturado.articuloManufacturadoDetalles.map((detalle) => ({
            ...detalle,
            idArticuloInsumo: detalle.articuloInsumo.id,
          }));
          formik.setValues({
            ...articuloManufacturado,
            imagenes: articuloManufacturado.imagenes.map((image) => image.id),
            idUnidadMedida: articuloManufacturado.unidadMedida.id,
            idCategoria: articuloManufacturado.categoria.id,
            articuloManufacturadoDetalles: articuloManufacturado.articuloManufacturadoDetalles.map((detalle) => ({
              ...detalle,
              idArticuloInsumo: detalle.articuloInsumo.id,
            })),
          });
          setArticuloSeleccionado(
            articuloManufacturado.articuloManufacturadoDetalles.map((detalle) => ({
              ...detalle,
              idArticuloInsumo: detalle.articuloInsumo.id,
              cantidad: detalle.cantidad.toString(),
            }))
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getInsumosSeleccionados = async () => {
    const insumos: { articuloInsumo: IArticuloInsumo; cantidad: string; }[] = [];

    const fetchInsumos = newDetalles.map(async (detalle) => {
      const response = await insumoService.getById(detalle.idArticuloInsumo);
      if (response) {
        insumos.push({ articuloInsumo: response, cantidad: detalle.cantidad.toString() });
      }
    });

    await Promise.all(fetchInsumos);
    setArticuloSeleccionado(insumos);
  };

  // BARRA DE BÚSQUEDA
  // Obtener los datos de la tabla en su estado inicial (sin datos)
  const dataTable = useAppSelector((state) => state.tableReducer.dataTable);

  // -------------------- EFFECTS --------------------

  useEffect(() => {
    getInsumosSeleccionados()
  }, [newDetalles])

  useEffect(() => {
    if (selectedId) {
      getOneManufacturado();
    } else {
      setValues(initialValues);
    }
  }, [selectedId]);


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


  //Trae las unidades de medida y categorías ya creadas
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
                        <Grid item xs={8}>
                          {/* CATEGORIA */}
                          <Form.Group controlId="idCategoria" className="mb-3">
                            <Form.Label>Categoría</Form.Label>
                            <Autocomplete
                              id="idCategoria"
                              options={categoriasFiltradas}
                              value={categoriasFiltradas.find((categoria) => categoria.id === formik.values.idCategoria) || null}
                              groupBy={(option) =>
                                option.parent
                                  ? categoriasFiltradas.find(
                                    (categoria) => categoria.id === option.parent
                                  )?.denominacion || ''
                                  : option.denominacion
                              }
                              getOptionLabel={(option) => option.denominacion}
                              getOptionKey={(option) => option.id}
                              onChange={(event, value) => {
                                formik.setFieldValue(
                                  "idCategoria",
                                  value?.id
                                )
                              }
                              }
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
                        <Grid item xs={4}>
                          {/* PRECIO VENTA */}
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
                              />
                            </InputGroup>
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
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          {/* UNIDAD DE MEDIDA */}
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
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.idUnidadMedida}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Grid>
                        <Grid item xs={6}>
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
                        </Grid>
                      </Grid>
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
                              <SearchIcon />
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
                            {articuloSeleccionado.length > 0 && (
                              <ul
                                style={{
                                  paddingLeft: 0,
                                  listStyleType: "none",
                                }}
                              >
                                {articuloSeleccionado
                                  .filter((detalle) =>
                                    detalle.articuloInsumo.denominacion
                                      .toLowerCase()
                                      .includes(searchTerm.toLowerCase())
                                  )
                                  .map((detalle, index) => (
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
                                        <Grid item xs={3}>
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
                                        <Grid item xs={3}>
                                          <TextField
                                            id="outlined-basic"
                                            label="Cantidad"
                                            variant="outlined"
                                            value={detalle.cantidad}
                                            disabled
                                            fullWidth
                                          />
                                        </Grid>
                                        <Grid item xs={3}>
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
                                        <Grid item xs={3}>
                                          <IconButton
                                            aria-label="delete"
                                            onClick={() =>
                                              handleDeleteDetalle(index)
                                            }
                                          >
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
                          {/* {formik.errors.articuloManufacturadoDetalles} */}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </>
                  )}
                  {activeStep === 3 && (
                    <>
                      {/* IMAGENES */}
                      <Form.Group controlId="idImagenes" className="mb-3">
                        <Form.Label>Imágenes</Form.Label>
                        <ModalImagen
                          selectedFiles={selectedFiles}
                          setSelectedFiles={setSelectedFiles}
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
      {/* <UnidadMedidaModal
        selectedId={selectedId}
        show={openModal}
        handleClose={() => { setOpenModal(false); setSelectedId(undefined) }}
      /> */}
      <ManufacturadosDetalleModal
        handleSave={handleSaveDetalle}
        openModal={showDetallesModal}
        setOpenModal={setShowDetallesModal}
      />
    </>
  );
};
