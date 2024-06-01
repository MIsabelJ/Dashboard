import { FormikProps } from "formik";
import { IPromocionPost } from "../../../../../types/Promocion/IPromocionPost";
import { Grid, TextField } from "@mui/material";

interface Step1Props {
  formik: FormikProps<IPromocionPost>;
}
const Step1: React.FC<Step1Props> = ({ formik }) => {
  return (
    <>
      <TextField
        fullWidth
        margin="normal"
        label="Denominación"
        name="denominacion"
        value={formik.values.denominacion}
        onChange={formik.handleChange}
        error={
          formik.touched.denominacion && Boolean(formik.errors.denominacion)
        }
        helperText={formik.touched.denominacion && formik.errors.denominacion}
      />
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <TextField
            fullWidth
            margin="normal"
            label="Fecha Desde"
            type="date"
            name="fechaDesde"
            InputLabelProps={{ shrink: true }}
            value={formik.values.fechaDesde}
            onChange={formik.handleChange}
            error={
              formik.touched.fechaDesde && Boolean(formik.errors.fechaDesde)
            }
            helperText={formik.touched.fechaDesde && formik.errors.fechaDesde}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            margin="normal"
            label="Fecha Hasta"
            type="date"
            name="fechaHasta"
            InputLabelProps={{ shrink: true }}
            value={formik.values.fechaHasta}
            onChange={formik.handleChange}
            error={
              formik.touched.fechaHasta && Boolean(formik.errors.fechaHasta)
            }
            helperText={formik.touched.fechaHasta && formik.errors.fechaHasta}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            margin="normal"
            label="Hora Desde"
            type="time"
            name="horaDesde"
            InputLabelProps={{ shrink: true }}
            value={formik.values.horaDesde}
            onChange={formik.handleChange}
            error={formik.touched.horaDesde && Boolean(formik.errors.horaDesde)}
            helperText={formik.touched.horaDesde && formik.errors.horaDesde}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            margin="normal"
            label="Hora Hasta"
            type="time"
            name="horaHasta"
            InputLabelProps={{ shrink: true }}
            value={formik.values.horaHasta}
            onChange={formik.handleChange}
            error={formik.touched.horaHasta && Boolean(formik.errors.horaHasta)}
            helperText={formik.touched.horaHasta && formik.errors.horaHasta}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Step1;
