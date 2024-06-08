import React, { useEffect, useState } from "react";
import { IPromocionPost } from "../../../../types/Promocion/IPromocionPost";
import { IPromocionDetallePost } from "../../../../types/PromocionDetalle/IPromocionDetallePost";
import { useFormik } from "formik";
import { SucursalService } from "../../../../services/SucursalService";
import { ISucursal } from "../../../../types/Sucursal/ISucursal";
import { Modal } from "react-bootstrap";
import { Button, Step, StepLabel, Stepper } from "@mui/material";
import { IImagen } from "../../../../types/Imagen/IImagen";
import { IArticulo } from "../../../../types/Articulo/IArticulo";
import { ArticuloService } from "../../../../services/ArticuloService";
import { IPromocion } from "../../../../types/Promocion/IPromocion";
import { useAppDispatch } from "../../../../hooks/redux";
import { setDataTable } from "../../../../redux/slices/TablaReducer";
import { PromocionService } from "../../../../services/PromocionService";
import { ImagenService } from "../../../../services/ImagenService";
import Swal from "sweetalert2";
import {
  API_URL,
  validationSchema,
  initialValues,
  steps,
} from "./utils/constants";
import Step1 from "./stepper/Step1";
import Step2 from "./stepper/Step2";
import Step3 from "./stepper/Step3";
import Step4 from "./stepper/Step4";
import "./ModalPromocion.css";
//---------------- INTERFAZ ----------------
interface IPromocionModalProps {
  show: boolean;
  handleClose: () => void;
  selectedId?: number;
}

const ModalPromocion = ({
  show,
  handleClose,
  selectedId,
}: IPromocionModalProps) => {
  // -------------------- STATES --------------------
  const [activeStep, setActiveStep] = useState(0);

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
    { label: string; id: number; precioVenta: number }[]
  >([]);

  const [values, setValues] = useState<IPromocion | IPromocionPost>();

  const [detallePromocion, setDetallePromocion] = useState<
    IPromocionDetallePost[]
  >([]);

  // -------------------- FORMIK --------------------

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
      console.log("valores por enviar", values);
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
  const articuloService = new ArticuloService(API_URL + "/articulo");
  const promocionService = new PromocionService(API_URL + "/promocion");
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
    setArticulos([]);
    setSucursales([]);
    setOpcionesArticulos([]);
    setOpcionesSucursal([]);
    setDetallePromocion([]);
    setValues(undefined);
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
    const list = value.map((option) => option.id);
    formik.setFieldValue("idSucursales", list);
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
        const detallesPost: IPromocionDetallePost[] =
          promocion.promocionDetalles.map((detalle) => ({
            id: detalle.id,
            cantidad: detalle.cantidad,
            idArticulo: detalle.articulo.id,
          }));
        setDetallePromocion(detallesPost);
        const listSucursales = promocion.sucursales.map(
          (sucursal) => sucursal.id
        );
        formik.setValues({
          denominacion: promocion.denominacion,
          fechaDesde: promocion.fechaDesde,
          fechaHasta: promocion.fechaHasta,
          horaDesde: promocion.horaDesde,
          horaHasta: promocion.horaHasta,
          descripcionDescuento: promocion.descripcionDescuento,
          precioPromocional: promocion.precioPromocional,
          tipoPromocion: promocion.tipoPromocion,
          idSucursales: listSucursales,
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
      setValues(initialValues);
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
      precioVenta: articulos.precioVenta,
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
  }, [show]);

  return (
    <Modal show={show} onHide={internalHandleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{selectedId ? "Editar" : "Agregar"} Promoción</Modal.Title>
      </Modal.Header>
      <div className="modal-content">
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          className="stepper-container">
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={formik.handleSubmit}>
          {activeStep === 0 && <Step1 formik={formik} />}
          {activeStep === 1 && <Step2 formik={formik} />}
          {activeStep === 2 && (
            <Step3
              formik={formik}
              detallePromocion={detallePromocion}
              setDetallePromocion={setDetallePromocion}
              opcionesArticulos={opcionesArticulos}
              opcionesSucursal={opcionesSucursal}
              handleSucursalChange={handleSucursalChange}
            />
          )}
          {activeStep === 3 && (
            <Step4
              formik={formik}
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              previousImages={previousImages}
              setPreviousImages={setPreviousImages}
            />
          )}
          <div className="form-actions">
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}>
              Atrás
            </Button>
            <div className="spacer" />
            <Button
              onClick={handleNext}
              variant="contained"
              className={`next-button ${
                activeStep === steps.length - 1 ? "save-button" : ""
              }`}>
              {activeStep === steps.length - 1 ? "Guardar" : "Siguiente"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalPromocion;
