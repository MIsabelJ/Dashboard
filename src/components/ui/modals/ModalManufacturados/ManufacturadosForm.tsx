import React from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { Button, TextField, Box } from "@mui/material";
import { useAppDispatch } from "../../../../hooks/redux";
import { setElementActive } from "../../../../redux/slices/TablaReducer";
import { IArticuloManufacturado } from "../../../../types/IArticuloManufacturado";
import AddIcon from "@mui/icons-material/Add";

const steps = ["Información General", "Detalles", "Ingredientes"];

const validationSchema = Yup.object({
  denominacion: Yup.string().required("Campo requerido"),
  precioVenta: Yup.number().required("Campo requerido"),
  descripcion: Yup.string().required("Campo requerido"),
  tiempoEstimadoMinutos: Yup.number().required("Campo requerido"),
  preparacion: Yup.string().required("Campo requerido"),
  articuloManufacturadoDetalles: Yup.array().required("Campo requerido"),
  imagenes: Yup.array().required("Campo requerido"),
  unidadMedida: Yup.object().required("Campo requerido"),
});

const initialValues = {
  id: 0,
  denominacion: "",
  precioVenta: 0,
  descripcion: "",
  tiempoEstimadoMinutos: 0,
  preparacion: "",
  articuloManufacturadoDetalles: [],
  imagenes: [],
  unidadMedida: {
    id: 0,
    denominacion: "",
  },
};

const translatedPlaceholder = {
  denominacion: "Denominación",
  precioVenta: "Precio de Venta",
  descripcion: "Descripción",
  tiempoEstimadoMinutos: "Tiempo Estimado en Minutos",
  preparacion: "Preparación",
  articuloManufacturadoDetalles: "Detalles",
  imagenes: "Imagenes",
  unidadMedida: "Unidad de Medida",
};

const formInputType = {
  denominacion: "text",
  precioVenta: "number",
  descripcion: "text",
  tiempoEstimadoMinutos: "number",
  preparacion: "text",
  articuloManufacturadoDetalles: "text",
  imagenes: "text",
  unidadMedida: "text",
};

interface ManufacturadosFormProps {
  activeStep: number;
  handleNext: () => void;
  handleBack: () => void;
  elementActive: any;
  itemService: any;
  getManufacturados: () => void;
  handleClose: () => void;
}

export const ManufacturadosForm = ({
  activeStep,
  handleNext,
  handleBack,
  elementActive,
  itemService,
  getManufacturados,
  handleClose,
}: ManufacturadosFormProps) => {
  const dispatch = useAppDispatch();

  const handleSubmit = async (values: IArticuloManufacturado) => {
    handleClose();
    if (elementActive?.element) {
      await itemService.put(elementActive.element.id, values);
    } else {
      await itemService.post(values);
    }
    getManufacturados();
  };

  const formDetails = {
    validationSchema,
    initialValues: elementActive?.element || initialValues,
    translatedPlaceholder,
    formInputType,
  };

  return (
    <Formik
      validationSchema={formDetails.validationSchema}
      initialValues={formDetails.initialValues as IArticuloManufacturado}
      enableReinitialize={true}
      onSubmit={async (values: IArticuloManufacturado) => {
        await handleSubmit(values);
      }}
    >
      {({ setFieldValue }) => (
        <Form>
          {activeStep === 0 && (
            <>
              <Field
                as={TextField}
                id="outlined-denominacion"
                label={translatedPlaceholder.denominacion}
                variant="outlined"
                fullWidth
                name="denominacion"
                value={formDetails.initialValues.denominacion}
                onChange={(e) => {
                  setFieldValue("denominacion", e.target.value);
                  if (elementActive) {
                    dispatch(
                      setElementActive({
                        element: {
                          ...elementActive.element,
                          denominacion: e.target.value,
                        },
                      })
                    );
                  }
                }}
              />
              <Field
                as={TextField}
                id="outlined-precioVenta"
                label={translatedPlaceholder.precioVenta}
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                name="precioVenta"
                value={formDetails.initialValues.precioVenta}
                type="number"
                onChange={(e) => {
                  setFieldValue("precioVenta", parseFloat(e.target.value));
                  if (elementActive) {
                    dispatch(
                      setElementActive({
                        element: {
                          ...elementActive.element,
                          precioVenta: parseFloat(e.target.value),
                        },
                      })
                    );
                  }
                }}
              />
              <Field
                as={TextField}
                id="outlined-unidadMedida"
                label={translatedPlaceholder.unidadMedida}
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                name="unidadMedida"
                value={formDetails.initialValues.unidadMedida.denominacion}
                onChange={(e) => {
                  setFieldValue("unidadMedida", e.target.value);
                  if (elementActive) {
                    dispatch(
                      setElementActive({
                        element: {
                          ...elementActive.element,
                          unidadMedida: e.target.value,
                        },
                      })
                    );
                  }
                }}
              />
              <Field
                as={TextField}
                id="outlined-descripcion"
                label={translatedPlaceholder.descripcion}
                variant="outlined"
                fullWidth
                multiline
                sx={{ mt: 2 }}
                name="descripcion"
                value={formDetails.initialValues.descripcion}
                onChange={(e) => {
                  setFieldValue("descripcion", e.target.value);
                  if (elementActive) {
                    dispatch(
                      setElementActive({
                        element: {
                          ...elementActive.element,
                          descripcion: e.target.value,
                        },
                      })
                    );
                  }
                }}
              />
            </>
          )}
          {activeStep === 1 && (
            <>
              <Field
                as={TextField}
                id="outlined-preparacion"
                label={translatedPlaceholder.preparacion}
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                name="preparacion"
                value={formDetails.initialValues.preparacion}
                onChange={(e) => {
                  setFieldValue("preparacion", e.target.value);
                  if (elementActive) {
                    dispatch(
                      setElementActive({
                        element: {
                          ...elementActive.element,
                          preparacion: e.target.value,
                        },
                      })
                    );
                  }
                }}
              />
              <Field
                as={TextField}
                id="outlined-tiempoEstimadoMinutos"
                label={translatedPlaceholder.tiempoEstimadoMinutos}
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                name="tiempoEstimadoMinutos"
                value={formDetails.initialValues.tiempoEstimadoMinutos}
                type="number"
                onChange={(e) => {
                  setFieldValue(
                    "tiempoEstimadoMinutos",
                    parseInt(e.target.value)
                  );
                  if (elementActive) {
                    dispatch(
                      setElementActive({
                        element: {
                          ...elementActive.element,
                          tiempoEstimadoMinutos: parseInt(e.target.value),
                        },
                      })
                    );
                  }
                }}
              />
              <Field
                as={TextField}
                id="outlined-imagenes"
                label={translatedPlaceholder.imagenes}
                variant="outlined"
                fullWidth
                name="imagenes"
                value={formDetails.initialValues.imagenes}
                onChange={(e) => {
                  setFieldValue("imagenes", e.target.value);
                  if (elementActive) {
                    dispatch(
                      setElementActive({
                        element: {
                          ...elementActive.element,
                          imagenes: e.target.value,
                        },
                      })
                    );
                  }
                }}
              />
            </>
          )}
          {activeStep === 2 && (
            <>
              <Button variant="outlined" startIcon={<AddIcon />} /*onClick={<ModalManufacturadoDetalle/>}*/>
                Agregar un ingrediente
              </Button>
            </>
          )}
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Atrás
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button type="submit" onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
