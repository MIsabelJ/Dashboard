import React from "react";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
// ---------- ARCHIVOS----------
import { IArticuloManufacturadoDetallePost } from "../../../../types/ArticuloManufacturadoDetalle/IArticuloManufacturadoDetallePost";
import { IArticuloInsumo } from "../../../../types/ArticuloInsumo/IArticuloInsumo";
import { InsumoService } from "../../../../services/InsumoService";
// ---------- ESTILOS ----------
import { Form, Modal } from "react-bootstrap";
import { Autocomplete, Box, Button, Grid, TextField } from "@mui/material";
import { useServiceHeaders } from "../../../../hooks/useServiceHeader";

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
  values?: {
    articuloInsumo: IArticuloInsumo;
    cantidad: string;
    id: number;
  };
}

// ------------------------------ COMPONENTE PRINCIPAL ------------------------------

export const ManufacturadosDetalleModal = ({
  handleSave,
  openModal,
  setOpenModal,
  values,
}: ManufacturadosDetalleModalProps) => {
  // -------------------- STATES --------------------
  // Guarda los valores de todos los insumos que existen y que vayan a añadirse con el useEffect
  const [insumos, setInsumos] = useState<IArticuloInsumo[]>([]);
  // Utilizado para dar formato a los elementos del dropdown de insumos
  const [opcionesInsumos, setOpcionesInsumos] = useState<
    {
      esParaElaborar: boolean;
      label: string;
      id: number;
    }[]
  >([]);

  // -------------------- FORMIK --------------------
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleSave(values);
      handleCloseModal();
    },
  });

  // -------------------- SERVICES --------------------
  const insumoService = useServiceHeaders(InsumoService, "articulo-insumo");

  // -------------------- HANDLES --------------------
  const handleSubmit = () => {
    formik.handleSubmit();
  };

  const handleCloseModal = () => {
    formik.resetForm();
    setOpenModal(false);
  };

  // -------------------- EFFECTS --------------------
  useEffect(() => {
    if (openModal && insumoService) {
      const getInsumos = async () => {
        const response = await insumoService.getAll();
        setInsumos(response);
      };
      getInsumos();
    }
  }, [openModal, insumoService]);

  useEffect(() => {
    const opciones = insumos.map((insumo) => ({
      label: insumo.denominacion,
      id: insumo.id,
      esParaElaborar: insumo.esParaElaborar,
    }));
    setOpcionesInsumos(opciones);
  }, [insumos]);

  // -------------------- RENDER --------------------
  return (
    <>
      <Modal show={openModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Añada un insumo necesario</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
          <Box sx={{ width: "100%" }}>
            <React.Fragment>
              <Form onSubmit={formik.handleSubmit}>
                <>
                  {/* ARTICULO INSUMO */}
                  <Grid container spacing={2}>
                    <Grid item xs={5}>
                      <Form.Group controlId="idArticuloInsumo" className="mb-3">
                        <Form.Label>Insumo</Form.Label>
                        <Autocomplete
                          id="combo-box-demo"
                          options={opcionesInsumos.filter(
                            (opcion) => opcion.esParaElaborar === true
                          )}
                          getOptionKey={(option) => option.id}
                          sx={{ width: "100%" }}
                          value={
                            (values &&
                              opcionesInsumos.find((option) => {
                                return option.id === values?.id;
                              })) ||
                            opcionesInsumos.find(
                              (option) =>
                                option.id === formik.values.idArticuloInsumo
                            ) ||
                            null
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
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.idArticuloInsumo}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Grid>
                    <Grid item xs={3}>
                      {/* CANTIDAD */}
                      <Form.Group controlId="cantidad" className="mb-3">
                        <Form.Label>Cantidad</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Ingrese la cantidad"
                          name="cantidad"
                          value={formik.values.cantidad || ""}
                          onChange={formik.handleChange}
                          isInvalid={!!formik.errors.cantidad}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.cantidad}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Grid>
                    <Grid item xs={4}>
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
                                      insumo.id ===
                                      formik.values.idArticuloInsumo
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
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  color="success">
                  Guardar
                </Button>
              </Box>
            </React.Fragment>
          </Box>
        </Modal.Body>
      </Modal>
    </>
  );
};
