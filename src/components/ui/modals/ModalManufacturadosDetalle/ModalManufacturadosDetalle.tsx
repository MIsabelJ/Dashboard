import React from "react";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
// ---------- ARCHIVOS----------
import { IArticuloManufacturadoDetallePost } from "../../../../types/ArticuloManufacturadoDetalle/IArticuloManufacturadoDetallePost";
import { IArticuloInsumo } from "../../../../types/ArticuloInsumo/IArticuloInsumo";
import { IArticuloInsumoPost } from "../../../../types/ArticuloInsumo/IArticuloInsumoPost";
import { InsumoService } from "../../../../services/InsumoService";
import { ModalArticuloInsumo } from "../ModalInsumos/ModalInsumos";
// ---------- ESTILOS ----------
import { Form, Modal } from "react-bootstrap";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

// ------------------------------ CÓDIGO ------------------------------
const API_URL = import.meta.env.VITE_API_URL;

// ---------- FORMIK ----------
const initialValues: IArticuloManufacturadoDetallePost = {
  cantidad: 0,
  idArticuloInsumo: 0,
};

const validationSchema = Yup.object({
  cantidad: Yup.number().required("Campo requerido"),
  idArticuloInsumo: Yup.number().required("Campo requerido"),
});

// ---------- INTERFAZ ----------
interface ManufacturadosDetalleModalProps {
  handleSave: (detalle: IArticuloManufacturadoDetallePost) => void;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
}

// ------------------------------ FUNCIÓN PRINCIPAL ------------------------------

export const ManufacturadosDetalleModal = ({
  handleSave,
  openModal,
  setOpenModal,
}: ManufacturadosDetalleModalProps) => {

  // -------------------- STATES --------------------
  // Abre el modal de Insumo
  const [showModalArticuloInsumo, setShowModalArticuloInsumo] =
    useState<boolean>(false);
  // Guarda los valores de todos los insumos que existen y que vayan a añadirse con el useEffect
  const [insumos, setInsumos] = useState<IArticuloInsumo[]>([]);
  // Utilizado para dar formato a los elementos del dropdown de insumos
  const [opcionesInsumos, setOpcionesInsumos] = useState<
    { label: string; id: number }[]
  >([]);

  // -------------------- FORMIK --------------------
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      handleSave(values);
      handleCloseModal();
    },
  });

  // -------------------- SERVICES --------------------
  const insumoService = new InsumoService(API_URL + "/articulo-insumo");

  // -------------------- HANDLES --------------------
  const handleSubmit = () => {
    formik.handleSubmit();
  };

  const handleCloseModal = () => {
    formik.resetForm();
    setOpenModal(false);
  };

  const handleSaveInsumo = async (insumo: IArticuloInsumoPost) => {
    try {
      await insumoService.post(insumo);
    } catch (error) {
      console.error(error);
    }
  };

  // -------------------- FUNCIONES --------------------

  const addInsumo = (insumo: IArticuloInsumo) => {
    setInsumos([...insumos, insumo]);
    setShowModalArticuloInsumo(false);
  };

  const getInsumo = async () => {
    await insumoService.getAll().then((insumoData) => {
      // console.log(insumoData)
      // dispatch(setDataTable(insumoData));
    });
  };

  // -------------------- EFFECTS --------------------
  useEffect(() => {
    const getInsumos = async () => {
      const response = await insumoService.getAll();
      setInsumos(response);
    };
    getInsumos();
  }, []);

  useEffect(() => {
    const opciones = insumos.map((insumo) => ({
      label: insumo.denominacion,
      id: insumo.id,
    }));
    setOpcionesInsumos(opciones);
  }, [insumos]);

  // -------------------- RENDER --------------------
  return (
    <>
      <Modal show={openModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detalle de Artículo Manufacturado</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
          <Box sx={{ width: "100%" }}>
            <React.Fragment>
              <Form onSubmit={formik.handleSubmit}>
                <>
                  {/* ARTICULO INSUMO */}
                  <Form.Group controlId="idArticuloInsumo" className="mb-3">
                    <Form.Label>Insumo</Form.Label>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={7}>
                        <Autocomplete
                          // disablePortal
                          id="combo-box-demo"
                          options={opcionesInsumos}
                          getOptionKey={(option) => option.id}
                          sx={{ width: "100%" }}
                          value={
                            opcionesInsumos.find(
                              (option) =>
                                option.id === formik.values.idArticuloInsumo
                            ) || null
                          }
                          onChange={(event, value) =>
                            formik.setFieldValue(
                              "idArticuloInsumo",
                              value?.id || ""
                            )
                          }
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Seleccione el insumo"
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
                            setShowModalArticuloInsumo(true);
                          }}
                          variant="contained"
                          startIcon={<AddIcon />}
                        >
                          Crear Insumo
                        </Button>
                      </Grid>
                    </Grid>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.idArticuloInsumo}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Grid container spacing={2} alignItems="center" justifyContent="center">
                    <Grid item xs={6} alignSelf={"flex-start"}>
                      {/* CANTIDAD */}
                      <Form.Group controlId="cantidad" className="mb-3">
                        <Form.Label>Cantidad</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Ingrese la cantidad"
                          name="cantidad"
                          value={formik.values.cantidad}
                          onChange={formik.handleChange}
                        // isInvalid={
                        //   formik.touched.cantidad && formik.errors.cantidad
                        // }
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.cantidad}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Grid>
                    <Grid item xs={6}>
                      {/* UNIDAD DE MEDIDA */}
                      <Form.Group controlId="idUnidadMedida" className="mb-3">
                        <Form.Label>Unidad de Medida</Form.Label>
                        <div>
                          <TextField
                            id="component-disabled"
                            label="Unidad de Medida"
                            value={
                              formik.values.idArticuloInsumo
                                ? insumos.find(
                                  (insumo) =>
                                    insumo.id === formik.values.idArticuloInsumo
                                )?.unidadMedida.denominacion
                                : ""
                            }
                            InputProps={{
                              readOnly: true,
                            }}
                            fullWidth
                          />
                        </div>
                      </Form.Group>
                    </Grid>
                  </Grid>
                </>
              </Form>
            </React.Fragment>
            <React.Fragment>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleSubmit} variant="contained" color="success">Guardar</Button>
              </Box>
            </React.Fragment>
          </Box>
        </Modal.Body>
      </Modal>
      <ModalArticuloInsumo
        handleSave={handleSaveInsumo}
        getInsumos={getInsumo}
        openModal={showModalArticuloInsumo}
        setOpenModal={setShowModalArticuloInsumo}
      />
    </>
  );
};
