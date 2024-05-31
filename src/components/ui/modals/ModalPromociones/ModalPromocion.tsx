import React, { useEffect, useState } from "react";
import { IPromocionPost } from "../../../../types/Promocion/IPromocionPost";
import { IPromocionDetallePost } from "../../../../types/PromocionDetalle/IPromocionDetallePost";
import { useFormik } from "formik";
import { SucursalService } from "../../../../services/SucursalService";
import { ISucursal } from "../../../../types/Sucursal/ISucursal";
import { Modal } from "react-bootstrap";
import { ModalImagen } from "../ModalImagen/ModalImagen";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
} from "@mui/material";
import { AddIcCallOutlined } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import * as Yup from "yup";
import { IImagen } from "../../../../types/Imagen/IImagen";
import { IArticulo } from "../../../../types/Articulo/IArticulo";
import { ArticuloService } from "../../../../services/ArticuloService";
import { IPromocion } from "../../../../types/Promocion/IPromocion";
import { useAppDispatch } from "../../../../hooks/redux";
import { setDataTable } from "../../../../redux/slices/TablaReducer";
import { PromocionService } from "../../../../services/PromocionService";
import { ImagenService } from "../../../../services/ImagenService";
import Swal from "sweetalert2";
//---------------- INTERFAZ ----------------
interface IPromocionModalProps {
  show: boolean;
  handleClose: () => void;
  selectedId?: number;
}
const API_URL = import.meta.env.VITE_API_URL;

//---------------- FORMIK ----------------
const initialValues: IPromocionPost = {
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
const steps = [
  "Información de la promoción",
  "Detalles de la promoción",
  "Imagenes de la promoción",
  "Sucursales Disponibles",
];

const ModalPromocion = ({
  show,
  handleClose,
  selectedId,
}: IPromocionModalProps) => {
  // -------------------- STATES --------------------
  const [activeStep, setActiveStep] = useState(0);
  // Barra de busqueda para detalles promociones
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState<any[]>([]);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previousImages, setPreviousImages] = useState<IImagen[]>([]);

  //Guarda los valores de todas las sucursales que existen y que vayan a añadirse con el useEffect
  const [sucursales, setSucursales] = useState<ISucursal[]>([]);
  //Utilizado para dar formato a los elementos del dropdown de sucursales
  const [opcionesSucursal, setOpcionesSucursal] = useState<
    { label: string; id: number }[]
  >([]);
  //Guarda los valores de todos los articulos que existen y que vayan a añadirse con el useEffect
  const [articulos, setArticulos] = useState<IArticulo[]>([]);
  //Utilizado para dar formato a los elementos del dropdown de articulos
  const [opcionesArticulos, setOpcionesArticulos] = useState<
    { label: string; id: number }[]
  >([]);

  const [values, setValues] = useState<IPromocion | IPromocionPost>();

  const [detallePromocion, setDetallePromocion] = useState<
    IPromocionDetallePost[]
  >([]);

  // -------------------- FORMIK --------------------

  const validationSchema = Yup.object({});

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      Swal.fire({
        title: "Cargando Datos de la Promoción",
        text: "Espere mientras se suben los archivos.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      let actualImages: IImagen[] = [];
      if (selectedFiles.length > 0) {
        actualImages = await imagenService.upload(selectedFiles);
      }
      const promocion: IPromocionPost = {
        ...values,
        imagenes: [...previousImages, ...actualImages],
        promocionDetalles: detallePromocion,
      };
      console.log(promocion);
      handleSave(promocion);
    },
  });

  // -------------------- SERVICE --------------------

  const imagenService = new ImagenService(API_URL + "/imagen-promocion");
  const sucursalService = new SucursalService(API_URL + "/sucursal");
  const articuloService = new ArticuloService(API_URL + "/articulo"); //TODO: asegurarse de que sea la ruta correcta
  const promocionService = new PromocionService(API_URL + "/promocion"); //TODO: asegurarse de que sea la ruta correcta
  const dispatch = useAppDispatch();
  // -------------------- HANDLERS --------------------

  const handleSave = async (promocion: IPromocionPost) => {
    if (selectedId) {
      try {
        await promocionService.put(selectedId, promocion);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await promocionService.post(promocion);
      } catch (error) {
        console.error(error);
      }
    }
    getAllPromocion();
    swalAlert("Éxito", "Datos subidos correctamente", "success");
    internalHandleClose();
    formik.resetForm();
  };

  const internalHandleClose = () => {
    handleClose();
    formik.resetForm();
    setSelectedFiles([]);
    setPreviousImages([]);
    setActiveStep(0);
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

  const handleSucursalChange = (value: { label: string; id: number }[]) => {
    formik.setFieldValue(
      "idSucursales",
      value.map((option) => option?.id) || []
    );
  };

  // -------------------- FUNCIONES --------------------

  const swalAlert = (
    title: string,
    content: string,
    icon: "error" | "success"
  ) => {
    Swal.fire(title, content, icon);
  };

  const getAllPromocion = async () => {
    await promocionService.getAll().then((promocionData) => {
      dispatch(setDataTable(promocionData));
    });
  };

  const getOnePromocion = async (id: number) => {
    try {
      const promocion = await promocionService.getById(id);
      if (promocion) {
        setPreviousImages(promocion.imagenes);
        const detallesPost: IPromocionDetallePost[] = promocion.promocionDetalles.map(
          (detalle) => ({
            id: detalle.id,
            cantidad: detalle.cantidad,
            idArticulo: detalle.articulo.id,
          })
        );
        setDetallePromocion(detallesPost);
        formik.setValues({
          denominacion: promocion.denominacion,
          fechaDesde: promocion.fechaDesde,
          fechaHasta: promocion.fechaHasta,
          horaDesde: promocion.horaDesde,
          horaHasta: promocion.horaHasta,
          descripcionDescuento: promocion.descripcionDescuento,
          precioPromocional: promocion.precioPromocional,
          tipoPromocion: promocion.tipoPromocion,
          idSucursales: promocion.sucursales.map((sucursal) => sucursal.id),
          promocionDetalles: detallesPost,
          imagenes: promocion.imagenes,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // -------------------- EFFECTS --------------------

  useEffect(() => {
    if (selectedId) {
      getOnePromocion(selectedId);
    } else {
      setValues(initialValues); //TODO: hay que poner valores al initial values
    }
  }, [selectedId]);

  //Da formato a las sucursales para el dropdown de MUI
  useEffect(() => {
    const opciones = sucursales.map((sucursal) => ({
      label: sucursal.nombre,
      id: sucursal.id,
    }));
    setOpcionesSucursal(opciones);
  }, [sucursales]);
  //Da formato a los articulos para el dropdown de MUI
  useEffect(() => {
    const opciones = articulos.map((articulos) => ({
      label: articulos.denominacion,
      id: articulos.id,
    }));
    setOpcionesArticulos(opciones);
  }, [articulos]);

  //Trae las sucursales y los articulos de la base de datos
  useEffect(() => {
    const getSucursales = async () => {
      const response = await sucursalService.getAll();
      setSucursales(response);
    };
    getSucursales();
    const getArticulos = async () => {
      const response = await articuloService.getAll();
      setArticulos(response);
    };
    getArticulos();
  }, []);

  return (
    <Modal show={show} onHide={internalHandleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedId ? "Editar" : "Agregar"} Artículo Insumo
        </Modal.Title>
      </Modal.Header>
      <Box
        sx={{
          padding: "20px",
          backgroundColor: "#fff",
          margin: "20px auto",
          maxWidth: "800px",
        }}
      >
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={formik.handleSubmit}>
          {activeStep === 0 && (
            <Box>
              <TextField
                fullWidth
                margin="normal"
                label="Denominación"
                name="denominacion"
                value={formik.values.denominacion}
                onChange={formik.handleChange}
                error={
                  formik.touched.denominacion &&
                  Boolean(formik.errors.denominacion)
                }
                helperText={
                  formik.touched.denominacion && formik.errors.denominacion
                }
              />
              <TextField
                fullWidth
                margin="normal"
                label="Fecha Desde"
                type="date"
                name="fechaDesde"
                InputLabelProps={{ shrink: true }}
                value={formik.values.fechaDesde}
                onChange={formik.handleChange}
                error={
                  formik.touched.fechaDesde && Boolean(formik.errors.fechaDesde)
                }
                helperText={
                  formik.touched.fechaDesde && formik.errors.fechaDesde
                }
              />
              <TextField
                fullWidth
                margin="normal"
                label="Fecha Hasta"
                type="date"
                name="fechaHasta"
                InputLabelProps={{ shrink: true }}
                value={formik.values.fechaHasta}
                onChange={formik.handleChange}
                error={
                  formik.touched.fechaHasta && Boolean(formik.errors.fechaHasta)
                }
                helperText={
                  formik.touched.fechaHasta && formik.errors.fechaHasta
                }
              />
              <TextField
                fullWidth
                margin="normal"
                label="Hora Desde"
                type="time"
                name="horaDesde"
                InputLabelProps={{ shrink: true }}
                value={formik.values.horaDesde}
                onChange={formik.handleChange}
                error={
                  formik.touched.horaDesde && Boolean(formik.errors.horaDesde)
                }
                helperText={formik.touched.horaDesde && formik.errors.horaDesde}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Hora Hasta"
                type="time"
                name="horaHasta"
                InputLabelProps={{ shrink: true }}
                value={formik.values.horaHasta}
                onChange={formik.handleChange}
                error={
                  formik.touched.horaHasta && Boolean(formik.errors.horaHasta)
                }
                helperText={formik.touched.horaHasta && formik.errors.horaHasta}
              />
            </Box>
          )}
          {activeStep === 1 && (
            <Box>
              <TextField
                fullWidth
                margin="normal"
                label="Precio Promocional"
                name="precioPromocional"
                type="number"
                value={formik.values.precioPromocional}
                onChange={formik.handleChange}
                error={
                  formik.touched.precioPromocional &&
                  Boolean(formik.errors.precioPromocional)
                }
                helperText={
                  formik.touched.precioPromocional &&
                  formik.errors.precioPromocional
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Tipo de Promoción"
                name="tipoPromocion"
                value={formik.values.tipoPromocion}
                onChange={formik.handleChange}
                error={
                  formik.touched.tipoPromocion &&
                  Boolean(formik.errors.tipoPromocion)
                }
                helperText={
                  formik.touched.tipoPromocion && formik.errors.tipoPromocion
                }
              />
              <TextField
                fullWidth
                margin="normal"
                label="Descripcion del descuento"
                name="descripcionDescuento"
                value={formik.values.descripcionDescuento}
                onChange={formik.handleChange}
                error={
                  formik.touched.descripcionDescuento &&
                  Boolean(formik.errors.descripcionDescuento)
                }
                helperText={
                  formik.touched.descripcionDescuento &&
                  formik.errors.descripcionDescuento
                }
              />
            </Box>
          )}
          {activeStep === 2 && (
            <>
              {detallePromocion.map((detalle, index) => (
                <Grid container spacing={2} key={index} alignItems="center">
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Cantidad"
                      name={`promocionDetalles[${index}].cantidad`}
                      type="number"
                      value={detalle.cantidad}
                      onChange={(e) => {
                        const newDetalles = [...detallePromocion];
                        newDetalles[index].cantidad = parseInt(
                          e.target.value,
                          10
                        );
                        setDetallePromocion(newDetalles);
                        formik.setFieldValue("promocionDetalles", newDetalles);
                      }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <FormControl fullWidth margin="normal">
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={opcionesArticulos}
                        sx={{ width: "100%" }}
                        onChange={(event, value) => {
                          const newDetalles = [...detallePromocion];
                          newDetalles[index].idArticulo = value ? value.id : 0;
                          setDetallePromocion(newDetalles);
                          formik.setFieldValue(
                            "promocionDetalles",
                            newDetalles
                          );
                        }}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Seleccione el artículo"
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton
                      onClick={() =>
                        setDetallePromocion(
                          detallePromocion.filter((_, i) => i !== index)
                        )
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcCallOutlined />}
                onClick={() =>
                  setDetallePromocion([
                    ...detallePromocion,
                    { id: 0 ,cantidad: 0, idArticulo: 0 },
                  ])
                }
              >
                Agregar Detalle
              </Button>
              <Box>
                <FormControl fullWidth margin="normal">
                  <FormLabel component="legend">Sucursales</FormLabel>
                  <Autocomplete
                    multiple
                    id="tags-outlined"
                    options={opcionesSucursal}
                    getOptionLabel={(option) => option?.label || ""}
                    filterSelectedOptions
                    sx={{ width: "100%" }}
                    isOptionEqualToValue={(option, value) =>
                      option?.id === value?.id
                    }
                    onChange={(event, value) => handleSucursalChange(value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Sucursales"
                        placeholder="Seleccione sucursales"
                      />
                    )}
                  />
                </FormControl>
              </Box>
            </>
          )}

          {activeStep === 3 && (
            <Box>
              <ModalImagen
                previousImages={previousImages}
                setPreviousImages={setPreviousImages}
                setSelectedFiles={setSelectedFiles}
                selectedFiles={selectedFiles}
                baseUrl="imagen-promocion"
              />
            </Box>
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
              color={activeStep === steps.length - 1 ? "success" : "primary"}
            >
              {activeStep === steps.length - 1 ? "Guardar" : "Siguiente"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalPromocion;
