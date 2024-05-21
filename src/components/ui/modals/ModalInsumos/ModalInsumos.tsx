import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { IArticuloInsumoPost } from '../../../../types/ArticuloInsumo/IArticuloInsumoPost';
import { Autocomplete, Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextField } from '@mui/material';
import { UnidadMedidaModal } from '../ModalUnidadMedida/ModalUnidadMedida';
import { IUnidadMedida } from '../../../../types/UnidadMedida/IUnidadMedida';
import { UnidadMedidaService } from '../../../../services/UnidadMedidaService';
import { ImagenArticuloModal } from '../ModalImagenArticulo/ModalImagenArticulo';
// import Swal from 'sweetalert2';


const API_URL = import.meta.env.VITE_API_URL;
interface IArticuloInsumoModalProps {
  getInsumos: () => void;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
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
const steps = ['Información del Artículo', 'Información Adicional', 'Imágenes'];

export const ModalArticuloInsumo = ({ getInsumos, openModal, setOpenModal }: IArticuloInsumoModalProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [images, setImages] = useState<{ url: string; name: string; }[]>([]);
  //Abre el modal de unidad de medida
  const [showUnidadMedidaModal, setShowUnidadMedidaModal] = useState<boolean>(false);
  //Guarda los valores de todas las unidades de medida que existen y que vayan a añadirse con el useEffect
  const [unidadesMedida, setUnidadesMedida] = useState<IUnidadMedida[]>([]);
  //Utilizado para dar formato a los elementos del dropdown de unidades de medida
  const [opcionesUnidadMedida, setOpcionesUnidadMedida] = useState<{ label: string, id: number }[]>([]);


  // Estado para almacenar archivos seleccionados para subir - CLOUDINARY
  // const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);


  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      getInsumos();
      handleCloseModal();
    },
  });

  const handleCloseModal = () => {
    formik.resetForm();
    setOpenModal(false);
    setActiveStep(0); // Resetear el stepper al cerrar el modal
  };


  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      formik.handleSubmit();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const unidadMedidaService = new UnidadMedidaService(API_URL + "/unidad-medida");

  //Funcion para agregar una nueva Unidad de Medida desde el modal
  const addUnidadMedida = (unidadMedida: IUnidadMedida) => {
    setUnidadesMedida([...unidadesMedida, unidadMedida]);
    setShowUnidadMedidaModal(false);
  };

  //Trae las unidades de medida ya creadas
  useEffect(() => {
    const getUnidadesMedida = async () => {
      const response = await unidadMedidaService.getAll();
      setUnidadesMedida(response);
    }
    getUnidadesMedida();
  }, [])

  //Da formato a las unidades de medida para el dropdown de MUI
  useEffect(() => {
    const opciones = unidadesMedida.map((unidadMedida) => ({
      label: unidadMedida.denominacion,
      id: unidadMedida.id,
    }));
    setOpcionesUnidadMedida(opciones);
  }, [unidadesMedida])

  return (
    <>
      <Modal show={openModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Artículo / Insumo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  Todos los pasos completados - estás terminado
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Box sx={{ flex: '1 1 auto' }} />
                  <Button onClick={handleCloseModal}>Cerrar</Button>
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>Paso {activeStep + 1}</Typography>
                <Form onSubmit={formik.handleSubmit}>
                  {activeStep === 0 && (
                    <>
                      <Form.Group controlId="denominacion">
                        <Form.Label>Denominación</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ingrese la denominación"
                          name="denominacion"
                          value={formik.values.denominacion}
                          onChange={formik.handleChange}
                          isInvalid={formik.touched.denominacion && !!formik.errors.denominacion}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.denominacion}</Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group controlId="precioVenta">
                        <Form.Label>Precio de Venta</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Ingrese el precio de venta"
                          name="precioVenta"
                          value={formik.values.precioVenta}
                          onChange={formik.handleChange}
                          isInvalid={formik.touched.precioVenta && !!formik.errors.precioVenta}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.precioVenta}</Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group controlId="precioCompra">
                        <Form.Label>Precio de Compra</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Ingrese el precio de compra"
                          name="precioCompra"
                          value={formik.values.precioCompra}
                          onChange={formik.handleChange}
                          isInvalid={formik.touched.precioCompra && !!formik.errors.precioCompra}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.precioCompra}</Form.Control.Feedback>
                      </Form.Group>
                    </>
                  )}
                  {activeStep === 1 && (
                    <>
                      <Form.Group controlId="stockActual">
                        <Form.Label>Stock Actual</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Ingrese el stock actual"
                          name="stockActual"
                          value={formik.values.stockActual}
                          onChange={formik.handleChange}
                          isInvalid={formik.touched.stockActual && !!formik.errors.stockActual}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.stockActual}</Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group controlId="stockMaximo">
                        <Form.Label>Stock Máximo</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Ingrese el stock máximo"
                          name="stockMaximo"
                          value={formik.values.stockMaximo}
                          onChange={formik.handleChange}
                          isInvalid={formik.touched.stockMaximo && !!formik.errors.stockMaximo}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.stockMaximo}</Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group controlId="esParaElaborar">
                        <Form.Check
                          type="checkbox"
                          label="Es para Elaborar"
                          name="esParaElaborar"
                          checked={formik.values.esParaElaborar}
                          onChange={formik.handleChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="idUnidadMedida">
                        <Form.Label>Unidad de Medida</Form.Label>
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={opcionesUnidadMedida}
                          sx={{ width: 300 }}
                          value={opcionesUnidadMedida.find(option => option.id === formik.values.idUnidadMedida) || null}
                          onChange={(event, value) => formik.setFieldValue("idUnidadMedida", value?.id || "")}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          renderInput={(params) => <TextField {...params} label="Unidad de medida" />}
                        />
                        <Button onClick={() => { setShowUnidadMedidaModal(true) }} variant="outline-primary">
                          Crear Unidad de Medida
                        </Button>
                        <Form.Control.Feedback type="invalid">{formik.errors.idUnidadMedida}</Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group controlId="idCategoria">
                        <Form.Label>Categoría</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Ingrese el ID de la categoría"
                          name="idCategoria"
                          value={formik.values.idCategoria}
                          onChange={formik.handleChange}
                          isInvalid={formik.touched.idCategoria && !!formik.errors.idCategoria}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.idCategoria}</Form.Control.Feedback>
                      </Form.Group>
                    </>
                  )}
                  {activeStep === 2 && (
                    <>
                      <Form.Group controlId="idImagenes">
                      </Form.Group>
                      <Form.Label>Imágenes</Form.Label>
                      <ImagenArticuloModal images={images} setImages={setImages} />
                    </>

                  )}
                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                    >
                      Atrás
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={handleNext}>
                      {activeStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
                    </Button>
                  </Box>
                </Form>
              </React.Fragment>
            )}
          </Box>
        </Modal.Body>
      </Modal >
      <UnidadMedidaModal
        show={showUnidadMedidaModal}
        addUnidadMedida={addUnidadMedida}
        handleClose={() => { setShowUnidadMedidaModal(false) }}
      />
      {/* <ImagenArticuloModal show={showImagenArticuloModal} handleClose={() => { setShowImagenArticuloModal(false) }} handleSave={addImagenArticulo} /> */}
    </>
  );
};
