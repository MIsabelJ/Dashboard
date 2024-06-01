import React from "react";
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
import { ManufacturadosDetalleModal } from "../ModalManufacturadosDetalle/ModalManufacturadosDetalle";
// ---------- ESTILOS ----------
import { Modal, Form } from "react-bootstrap";
import { Box, Step, StepLabel, Stepper, Button } from "@mui/material";
import { IImagen } from "../../../../types/Imagen/IImagen";
import { InsumoService } from "../../../../services/InsumoService";
import { IArticuloInsumo } from "../../../../types/ArticuloInsumo/IArticuloInsumo";
import { IArticuloManufacturado } from "../../../../types/ArticuloManufacturado/IArticuloManufacturado";
import { ManufacturadoService } from "../../../../services/ManufacturadoService";
import { setDataTable } from "../../../../redux/slices/TablaReducer";
import { ImagenService } from "../../../../services/ImagenService";
import Swal from "sweetalert2";
import {
  API_URL,
  initialValues,
  validationSchema,
  steps,
} from "./utils/constants";
import { swalAlert, formatCategorias } from "./utils/helpers";
import Step1 from "./stepper/Step1";
import Step2 from "./stepper/Step2";
import Step3 from "./stepper/Step3";
import Step4 from "./stepper/Step4";
import "./ModalManufacturados.css";

// ------------------------------ CÓDIGO ------------------------------

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
  selectedId,
}: IManufacturadosModalProps) => {
  // -------------------- STATES --------------------
  const [activeStep, setActiveStep] = useState(0);
  // Barra de búsqueda para newDetalles manufacturados
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previousImages, setPreviousImages] = useState<IImagen[]>([]);
  const [showDetallesModal, setShowDetallesModal] = useState<boolean>(false);
  const [newDetalles, setNewDetalles] = useState<
    IArticuloManufacturadoDetallePost[]
  >([]);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<
    { articuloInsumo: IArticuloInsumo; cantidad: string }[]
  >([]);
  //Guarda los valores de todas las unidades de medida que existen y que vayan a añadirse con el useEffect
  const [unidadesMedida, setUnidadesMedida] = useState<IUnidadMedida[]>([]);
  //Utilizado para dar formato a los elementos del dropdown de unidades de medida
  const [opcionesUnidadMedida, setOpcionesUnidadMedida] = useState<
    { label: string; id: number }[]
  >([]);

  const [values, setValues] = useState<
    IArticuloManufacturado | IArticuloManufacturadoPost
  >();
  const [readyToPersist, setReadyToPersist] = useState<boolean>(false);
  //Guarda los valores de todas categorías
  const [categorias, setCategorias] = useState<ICategoria[]>([]);

  // -------------------- FORMIK --------------------
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      Swal.fire({
        title: "Cargando Datos del Artículo Manufacturado",
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
      const manufacturado: IArticuloManufacturadoPost = {
        ...values,
        articuloManufacturadoDetalles: newDetalles,
        imagenes: [...previousImages, ...actualImages],
      };
      handleSave(manufacturado);
    },
  });

  // -------------------- SERVICES --------------------
  const unidadMedidaService = new UnidadMedidaService(
    API_URL + "/unidad-medida"
  );
  const imagenService = new ImagenService(API_URL + "/imagen-articulo");
  const insumoService = new InsumoService(API_URL + "/articulo-insumo");
  const manufacturadoService = new ManufacturadoService(
    API_URL + "/articulo-manufacturado"
  );
  const categoriaService = new CategoriaService(API_URL + "/categoria");
  const dispatch = useAppDispatch();

  // -------------------- HANDLERS --------------------
  // Barra de búsqueda para newDetalles manufacturados
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSaveDetalle = async (
    detalle: IArticuloManufacturadoDetallePost
  ) => {
    setNewDetalles([...newDetalles, detalle]);
    getInsumosSeleccionados();
    setShowDetallesModal(false);
  };

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
    swalAlert("Éxito", "Datos subidos correctamente", "success");
    internalHandleClose();
  };

  const internalHandleClose = () => {
    setReadyToPersist(false);
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

  // -------------------- FUNCIONES --------------------
  const categoriasFiltradas = formatCategorias(categorias);

  const getAllManufacturado = async () => {
    await manufacturadoService.getAll().then((manufacturadoData) => {
      dispatch(setDataTable(manufacturadoData));
    });
  };

  const getOneManufacturado = async (id: number) => {
    try {
      const articuloManufacturado = await manufacturadoService.getById(id);
      if (articuloManufacturado) {
        setPreviousImages(articuloManufacturado.imagenes);
        const detallesPost: IArticuloManufacturadoDetallePost[] =
          articuloManufacturado.articuloManufacturadoDetalles.map((detalle) => {
            return {
              id: detalle.id,
              cantidad: detalle.cantidad,
              idArticuloInsumo: detalle.articuloInsumo.id,
            };
          });
        setNewDetalles(detallesPost);
        formik.setValues({
          denominacion: articuloManufacturado.denominacion,
          precioVenta: articuloManufacturado.precioVenta,
          descripcion: articuloManufacturado.descripcion,
          tiempoEstimadoMinutos: articuloManufacturado.tiempoEstimadoMinutos,
          preparacion: articuloManufacturado.preparacion,
          articuloManufacturadoDetalles: detallesPost,
          imagenes: articuloManufacturado.imagenes,
          idUnidadMedida: articuloManufacturado.unidadMedida.id,
          idCategoria: articuloManufacturado.categoria.id,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getInsumosSeleccionados = async () => {
    const insumos: { articuloInsumo: IArticuloInsumo; cantidad: string }[] = [];

    const fetchInsumos = newDetalles.map(async (detalle) => {
      const response = await insumoService.getById(detalle.idArticuloInsumo);
      if (response) {
        insumos.push({
          articuloInsumo: response,
          cantidad: detalle.cantidad.toString(),
        });
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
    getInsumosSeleccionados();
  }, [newDetalles]);

  useEffect(() => {
    if (selectedId) {
      getOneManufacturado(selectedId);
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
        <Modal.Body className="modal-body">
          <Box className="box-full-width">
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              className="stepper-padding"
            >
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
                  {activeStep === 0 && (
                    <Step1
                      formik={formik}
                      categoriasFiltradas={categoriasFiltradas}
                    />
                  )}
                  {activeStep === 1 && (
                    <Step2
                      formik={formik}
                      opcionesUnidadMedida={opcionesUnidadMedida}
                    />
                  )}
                  {activeStep === 2 && (
                    <Step3
                      articuloSeleccionado={articuloSeleccionado}
                      searchTerm={searchTerm}
                      handleSearch={handleSearch}
                      setShowDetallesModal={setShowDetallesModal}
                      handleDeleteDetalle={handleDeleteDetalle}
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
                  <Box className="box-row-center">
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                    >
                      Atrás
                    </Button>
                    <Box className="box-auto-flex" />
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
      <ManufacturadosDetalleModal
        handleSave={handleSaveDetalle}
        openModal={showDetallesModal}
        setOpenModal={setShowDetallesModal}
      />
    </>
  );
};
