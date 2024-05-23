import { useEffect, useState } from "react";
import { IArticuloInsumo } from "../../../../types/ArticuloInsumo/IArticuloInsumo";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IArticuloManufacturadoDetallePost } from "../../../../types/ArticuloManufacturadoDetalle/IArticuloManufacturadoDetallePost";
import { InsumoService } from "../../../../services/InsumoService";
import { Form, Modal } from "react-bootstrap";
import { Autocomplete, Box, Button, FormHelperText, Grid, Input, InputLabel, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import { ModalArticuloInsumo } from "../ModalInsumos/ModalInsumos";

const API_URL = import.meta.env.VITE_API_URL;

interface ManufacturadosDetalleModalProps {
  getDetalles: () => void;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
}

const initialValues: IArticuloManufacturadoDetallePost = {
  cantidad: 0,
  idArticuloInsumo: 0,
};

const validationSchema = Yup.object({
  cantidad: Yup.number().required("Campo requerido"),
  idArticuloInsumo: Yup.number().required("Campo requerido"),
});

export const ManufacturadosDetalleModal = ({
  getDetalles,
  openModal,
  setOpenModal,
}: ManufacturadosDetalleModalProps) => {
  // Abre el modal de Insumo
  const [showModalArticuloInsumo, setShowModalArticuloInsumo] =
    useState<boolean>(false);
  // Guarda los valores de todos los insumos que existen y que vayan a añadirse con el useEffect
  const [insumos, setInsumos] = useState<IArticuloInsumo[]>([]);
  // Utilizado para dar formato a los elementos del dropdown de insumos
  const [opcionesInsumos, setOpcionesInsumos] = useState<
    { label: string; id: number }[]
  >([]);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      getDetalles();
      handleCloseModal();
    },
  });

  const handleCloseModal = () => {
    formik.resetForm();
    setOpenModal(false);
  };

  const insumoService = new InsumoService(API_URL + "/articulo-insumo");

  const addInsumo = (insumo: IArticuloInsumo) => {
    setInsumos([...insumos, insumo]);
    setShowModalArticuloInsumo(false);
  };

  const getInsumo = async () => {
    await insumoService.getAll().then((insumoData) => {
      // console.log(insumoData)
      dispatch(setDataTable(insumoData));
      setLoading(false);
    });
  };

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

  return (
    <>
      <Modal show={openModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo detalle de artículo manufacturado</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
          <Box sx={{ width: "100%" }}>
            <React.Fragment>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleCloseModal}>Finalizar</Button>
              </Box>
            </React.Fragment>
            <React.Fragment>
              <Form onSubmit={formik.handleSubmit}>
                <>
                  <Form.Group controlId="idArticuloInsumo" className="mb-3">
                    <Form.Label>Insumo</Form.Label>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={7}>
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={opcionesInsumos}
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
                  <Form.Group controlId="idUnidadMedida" className="mb-3">
                    <Form.Label>Unidad de Medida</Form.Label>
                    <Form.Control disabled>
                      <InputLabel htmlFor="component-disabled">Unidad de Medida</InputLabel>
                      <Input
                        id="component-disabled"
                        value={insumos.map((insumo) => insumo.unidadMedida.denominacion)}
                        readOnly
                      />
                      <FormHelperText>Esta es la unidad de medida del insumo</FormHelperText>
                    </Form.Control>
                  </Form.Group>
                </>
              </Form>
            </React.Fragment>
          </Box>
        </Modal.Body>
      </Modal>
      <ModalArticuloInsumo
        getInsumos={getInsumo}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
};
