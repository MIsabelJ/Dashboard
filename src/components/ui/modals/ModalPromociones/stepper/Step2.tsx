import { FormikProps } from "formik";
import { IPromocionPost } from "../../../../../types/Promocion/IPromocionPost";
import { Grid, InputAdornment, TextField } from "@mui/material";

interface Step2Props {
  formik: FormikProps<IPromocionPost>;
}
const Step2: React.FC<Step2Props> = ({ formik }) => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <TextField
            fullWidth
            margin="normal"
            label="Precio Promocional"
            name="precioPromocional"
            type="number"
            value={formik.values.precioPromocional}
            onChange={formik.handleChange}
            error={
              formik.touched.precioPromocional &&
              Boolean(formik.errors.precioPromocional)
            }
            helperText={
              formik.touched.precioPromocional &&
              formik.errors.precioPromocional
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={8}>
          {" "}
          {/* TODO: Autocomplete con los tipos de promociones disponibles */}
          <TextField
            fullWidth
            margin="normal"
            label="Tipo de Promoción"
            name="tipoPromocion"
            value={formik.values.tipoPromocion}
            onChange={formik.handleChange}
            error={
              formik.touched.tipoPromocion &&
              Boolean(formik.errors.tipoPromocion)
            }
            helperText={
              formik.touched.tipoPromocion && formik.errors.tipoPromocion
            }
          />
        </Grid>
      </Grid>
      <TextField
        fullWidth
        multiline
        rows={4}
        margin="normal"
        label="Descripcion del descuento"
        name="descripcionDescuento"
        value={formik.values.descripcionDescuento}
        onChange={formik.handleChange}
        error={
          formik.touched.descripcionDescuento &&
          Boolean(formik.errors.descripcionDescuento)
        }
        helperText={
          formik.touched.descripcionDescuento &&
          formik.errors.descripcionDescuento
        }
      />
    </>
  );
};

export default Step2;
