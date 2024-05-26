import React from 'react'
import { IPromocionPost } from '../../../../types/Promocion/IPromocionPost';
import { IImagenPromocion } from '../../../../types/ImagenPromocion/IImagenPromocion';
import { IImagenPromocionPost } from '../../../../types/ImagenPromocion/IImagenPromocionPost';
import { IPromocionDetallePost } from '../../../../types/PromocionDetalle/IPromocionDetallePost';
import { useFormik } from 'formik';
import { ImagenPromocionService } from '../../../../services/ImagenPromocionService';
import { SucursalService } from '../../../../services/SucursalService';
import { ISucursal } from '../../../../types/Sucursal/ISucursal';
import { Modal } from 'react-bootstrap';
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, IconButton, InputAdornment, MenuItem, Select, Step, StepLabel, Stepper, TextField } from '@mui/material';
import { AddIcCallOutlined } from '@mui/icons-material';
import * as Yup from "yup";
//---------------- INTERFAZ ----------------
interface IPromocionModalProps{
    handleSave: (detalle: IPromocionPost) => void;
    getPromociones: () => void;
    openModal: boolean;
    setOpenModal: (open: boolean) => void;
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
  idImagenes: [],
  idSucursales: [],
  descripcionDescuento: ""
};
const  steps = [
    "Información de la promoción",
    "Detalles de la promoción",
    "Imagenes de la promoción",
    "Sucursales Disponibles",
]

const ModalPromocion = ({
  handleSave,
  getPromociones,
  openModal,
  setOpenModal
}: IPromocionModalProps) => {
    // -------------------- STATES --------------------
    const [activeStep, setActiveStep] = React.useState(0);
    // Barra de busqueda para detalles promociones
    const [searchTerm, setSearchTerm] = React.useState("");
    const [rows, setRows] = React.useState<any[]>([]);

    const [idImages, setIdImages] = React.useState<string[]>([]);
    const [images, setImages] = React.useState<IImagenPromocionPost[]>([]);

    const [sucursales, setSucursales] = React.useState<ISucursal[]>([]);
    const [idSucursales, setIdSucursales] = React.useState<number[]>([]);
    const [detallePromocion , setDetallePromocion] = React.useState<IPromocionDetallePost[]>([]);

    // -------------------- FORMIK --------------------

    const validationSchema = Yup.object({
        
    });

    const formik = useFormik({
        initialValues : initialValues,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            const pomocion : IPromocionPost = {
                ...values,
                idImagenes: idImages,
                idSucursales: idSucursales,
                promocionDetalles: detallePromocion
            };
            handleSave(pomocion);
            getPromociones();
            setOpenModal(false);
        }
        

    })

    // -------------------- SERVICE --------------------
    const imagenPromocionService = new ImagenPromocionService(API_URL+"/imagen-promocion");

    const sucursalService = new SucursalService(API_URL+"/sucursal");

    // -------------------- HANDLERS --------------------

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

    const handleCloseModal = () => {
        formik.resetForm();
        setImages([]);
        setIdImages([]);
        setIdSucursales([]);
        setDetallePromocion([]);
        setActiveStep(0);
        setOpenModal(false);
    }

    // -------------------- FUNCIONES --------------------
    // HACER LO DE IMAGENES CUANDO EL AGUS LO PUSHEE

    const getCategorias = async () => {
        const response = await sucursalService.getAll();
        setSucursales(response);
    };

    const getSucursales = async () => {
        const response = await sucursalService.getAll();
        setSucursales(response);
    };



    return (
        <Modal show={openModal} onHide={handleCloseModal} size="lg">
        <Box sx={{ padding: '20px', backgroundColor: '#fff', margin: '20px auto', maxWidth: '800px' }}>
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
                            error={formik.touched.denominacion && Boolean(formik.errors.denominacion)}
                            helperText={formik.touched.denominacion && formik.errors.denominacion}
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
                            error={formik.touched.fechaDesde && Boolean(formik.errors.fechaDesde)}
                            helperText={formik.touched.fechaDesde && formik.errors.fechaDesde}
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
                            error={formik.touched.fechaHasta && Boolean(formik.errors.fechaHasta)}
                            helperText={formik.touched.fechaHasta && formik.errors.fechaHasta}
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
                            error={formik.touched.horaDesde && Boolean(formik.errors.horaDesde)}
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
                            error={formik.touched.horaHasta && Boolean(formik.errors.horaHasta)}
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
                            error={formik.touched.precioPromocional && Boolean(formik.errors.precioPromocional)}
                            helperText={formik.touched.precioPromocional && formik.errors.precioPromocional}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>
                            }}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Tipo de Promoción"
                            name="tipoPromocion"
                            value={formik.values.tipoPromocion}
                            onChange={formik.handleChange}
                            error={formik.touched.tipoPromocion && Boolean(formik.errors.tipoPromocion)}
                            helperText={formik.touched.tipoPromocion && formik.errors.tipoPromocion}
                        />
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
                                            newDetalles[index].cantidad = parseInt(e.target.value, 10);
                                            setDetallePromocion(newDetalles);
                                            formik.setFieldValue('promocionDetalles', newDetalles);
                                        }}
                                        error={Boolean(formik.errors.promocionDetalles?.[index]?.cantidad)}
                                        helperText={formik.errors.promocionDetalles?.[index]?.cantidad}
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <FormControl fullWidth margin="normal">
                                        <Select
                                            label="Artículo"
                                            name={`promocionDetalles[${index}].idArticulo`}
                                            value={detalle.idArticulo}
                                            onChange={(e) => {
                                                const newDetalles = [...detallePromocion];
                                                newDetalles[index].idArticulo = parseInt(e.target.value, 10);
                                                setDetallePromocion(newDetalles);
                                                formik.setFieldValue('promocionDetalles', newDetalles);
                                            }}
                                            displayEmpty
                                        >
                                            <MenuItem value="" disabled>Seleccionar artículo</MenuItem>
                                            {/* Agrega las opciones de artículos aquí */}
                                            <MenuItem value={1}>Artículo 1</MenuItem>
                                            <MenuItem value={2}>Artículo 2</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2}>
                                    <IconButton onClick={() => setDetallePromocion(detallePromocion.filter((_, i) => i !== index))}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcCallOutlined />}
                            onClick={() => setDetallePromocion([...detallePromocion, { cantidad: 0, idArticulo: 0 }])}
                        >
                            Agregar Detalle
                        </Button>
                    </Box>
                )}
                {activeStep === 2 && (
                    <Box>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                setImages([...images, { url: 'https://via.placeholder.com/150' }]);
                                setIdImages([...idImages, 'imagen-id']);
                            }}
                        >
                            Seleccionar Imágenes
                        </Button>
                        <Box mt={2}>
                            {images.map((image, index) => (
                                <Box key={index} display="inline-block" mr={2}>
                                    <img src={image.url} alt={`Imagen ${index + 1}`} width="50" height="50" />
                                    <IconButton size="small" onClick={() => {
                                        setImages(images.filter((_, i) => i !== index));
                                        setIdImages(idImages.filter((_, i) => i !== index));
                                    }}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}
                {activeStep === 3 && (
                    <Box>
                        <FormControl fullWidth margin="normal">
                            <FormLabel component="legend">Sucursales</FormLabel>
                            <Select
                                multiple
                                value={idSucursales}
                                onChange={(e) => setIdSucursales(e.target.value as number[])}
                                renderValue={(selected) => selected.map(id => sucursales.find(s => s.id === id)?.nombre).join(', ')}
                            >
                                {sucursales.map((sucursal) => (
                                    <MenuItem key={sucursal.id} value={sucursal.id}>
                                        {sucursal.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                    >
                        Atrás
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    {activeStep === steps.length - 1 ? (
                        <Button type="submit">
                            Guardar
                        </Button>
                    ) : (
                        <Button onClick={handleNext}>
                            Siguiente
                        </Button>
                    )}
                </Box>
            </form>
        </Box>
    </Modal>
);
};

export default ModalPromocion
