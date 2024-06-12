import { FormikProps } from "formik";
import { IPromocionPost } from "../../../../../types/Promocion/IPromocionPost";
import { Autocomplete, Grid, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";

interface Step2Props {
  formik: FormikProps<IPromocionPost>;
}
const Step2: React.FC<Step2Props> = ({ formik }) => {
  const [opcionesPromocion, setOpcionesPromocion] = useState<
    { label: string; id: number }[]
  >([
    {
      label: "Happy hour",
      id: 1,
    },
    {
      label: "Promoción",
      id: 2,
    },
  ]);

  const promocionTraduccion = (promocion: number) => {
    switch (promocion) {
      case 1:
        return "HAPPY_HOUR";
      case 2:
        return "PROMOCION";
      default:
        return "PROMOCION";
    }
  };

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
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={opcionesPromocion}
            sx={{ width: "100%" }}
            value={
              opcionesPromocion.find(
                (option) =>
                  promocionTraduccion(option.id || 0) ===
                  formik.values.tipoPromocion
              ) || null
            }
            onChange={(event, value) =>
              formik.setFieldValue(
                "tipoPromocion",
                promocionTraduccion(value?.id || 0)
              )
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField {...params} label="Seleccione la promoción" />
            )}
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
