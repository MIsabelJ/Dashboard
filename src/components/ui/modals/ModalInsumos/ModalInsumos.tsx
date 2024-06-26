import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Swal from "sweetalert2";
// ---------- ARCHIVOS----------
import { useAppDispatch } from "../../../../hooks/redux";
import { setDataTable } from "../../../../redux/slices/TablaReducer";
import {
  API_URL,
  initialValues,
  validationSchema,
  steps,
} from "./utils/constants";
import { swalAlert, formatCategorias } from "./utils/helpers";
// INTERFACES
import { IUnidadMedida } from "../../../../types/UnidadMedida/IUnidadMedida";
import { IArticuloInsumoPost } from "../../../../types/ArticuloInsumo/IArticuloInsumoPost";
import { ICategoria } from "../../../../types/Categoria/ICategoria";
import { IImagen } from "../../../../types/Imagen/IImagen";
// SERVICES
import { UnidadMedidaService } from "../../../../services/UnidadMedidaService";
import { CategoriaService } from "../../../../services/CategoriaService";
import { InsumoService } from "../../../../services/InsumoService";
import { ImagenService } from "../../../../services/ImagenService";
// STEPPER
import Step1 from "./stepper/Step1";
import Step2 from "./stepper/Step2";
import Step3 from "./stepper/Step3";
// ---------- ESTILOS ----------
import { Modal, Form } from "react-bootstrap";
import { Box, Button, Step, StepLabel, Stepper } from "@mui/material";
import "./ModalInsumos.css";
import { SucursalService } from "../../../../services/SucursalService";

// ------------------------------ CÓDIGO ------------------------------

//TODO: Agregar mensaje de error que traiga el error de
//steps anteriores al último step del stepper

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
        actualImages = await imagenService.upload(selectedFiles);
      }
      const insumo: IArticuloInsumoPost = {
        ...values,
        idSucursal: Number(localStorage.getItem("sucursalId")),
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
  const sucursalService = new SucursalService(API_URL + "/sucursal");
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

  // -------------------- FUNCIONES --------------------
  const categoriasFiltradas = formatCategorias(categorias);

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
          stockMinimo: articuloInsumo.stockMinimo,
          stockActual: articuloInsumo.stockActual,
          stockMaximo: articuloInsumo.stockMaximo,
          esParaElaborar: articuloInsumo.esParaElaborar,
          idUnidadMedida: articuloInsumo.unidadMedida.id,
          idCategoria: articuloInsumo.categoria.id,
          idSucursal: articuloInsumo.sucursal.id,
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
    if (show) {
      const getUnidadesMedida = async () => {
        const response = await unidadMedidaService.getAll();
        setUnidadesMedida(response);
      };
      getUnidadesMedida();
      const getCategorias = async () => {
        const sucursalId = localStorage.getItem("sucursalId");
        const response = await sucursalService.getCategoriasBySucursalId(
          Number(sucursalId)
        );
        setCategorias(response);
      };
      getCategorias();
    }
  }, [show]);

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
        <Modal.Body className="modal-body">
          <Box className="box-full-width">
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              className="stepper-padding">
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Box className="box-row">
                  <Box className="box-auto-flex" />
                  <Button onClick={internalHandleClose}>Finalizar</Button>
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Form onSubmit={formik.handleSubmit}>
                  {activeStep === 0 && <Step1 formik={formik} />}
                  {activeStep === 1 && (
                    <Step2
                      formik={formik}
                      opcionesUnidadMedida={opcionesUnidadMedida}
                      categoriasFiltradas={categoriasFiltradas}
                    />
                  )}
                  {activeStep === 2 && (
                    <Step3
                      formik={formik}
                      selectedFiles={selectedFiles}
                      setSelectedFiles={setSelectedFiles}
                      previousImages={previousImages}
                      setPreviousImages={setPreviousImages}
                    />
                  )}
                  <Box className="box-row-center">
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}>
                      Atrás
                    </Button>
                    <Box className="box-auto-flex" />
                    <Button
                      onClick={handleNext}
                      variant="contained"
                      color={
                        activeStep === steps.length - 1 ? "success" : "primary"
                      }>
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
    </>
  );
};
