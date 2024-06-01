import { FormikProps } from "formik";
import { IArticuloManufacturadoPost } from "../../../../../types/ArticuloManufacturado/IArticuloManufacturadoPost";
import { Autocomplete, Grid, TextField } from "@mui/material";
import { Form } from "react-bootstrap";

interface Step2Props {
  formik: FormikProps<IArticuloManufacturadoPost>;
  opcionesUnidadMedida: { label: string; id: number }[];
}

const Step2: React.FC<Step2Props> = ({ formik, opcionesUnidadMedida }) => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {/* UNIDAD DE MEDIDA */}
          <Form.Group controlId="idUnidadMedida" className="mb-3">
            <Form.Label>Unidad de Medida</Form.Label>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={opcionesUnidadMedida}
              sx={{ width: "100%" }}
              value={
                opcionesUnidadMedida.find(
                  (option) => option.id === formik.values.idUnidadMedida
                ) || null
              }
              onChange={(event, value) =>
                formik.setFieldValue("idUnidadMedida", value?.id || "")
              }
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField {...params} label="Seleccione la unidad" />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.idUnidadMedida}
            </Form.Control.Feedback>
          </Form.Group>
        </Grid>
        <Grid item xs={6}>
          {/* TIEMPO DE ESTIMADO EN MINUTOS */}
          <Form.Group controlId="tiempoEstimadoMinutos" className="mb-3">
            <Form.Label>Tiempo estimado de preparación (minutos)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese el tiempo de preparación"
              name="tiempoEstimadoMinutos"
              value={formik.values.tiempoEstimadoMinutos}
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.tiempoEstimadoMinutos &&
                !!formik.errors.tiempoEstimadoMinutos
              }
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.tiempoEstimadoMinutos}
            </Form.Control.Feedback>
          </Form.Group>
        </Grid>
      </Grid>
      {/* PREPARACION */}
      <Form.Group controlId="preparacion" className="mb-3">
        <Form.Label>Preparación</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Ingrese la receta"
          name="preparacion"
          value={formik.values.preparacion}
          onChange={formik.handleChange}
          isInvalid={formik.touched.preparacion && !!formik.errors.preparacion}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.preparacion}
        </Form.Control.Feedback>
      </Form.Group>
    </>
  );
};

export default Step2;
