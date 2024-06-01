import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import { Grid } from "@mui/material"
import { FormikProps } from "formik";
import { IArticuloInsumoPost } from "../../../../../types/ArticuloInsumo/IArticuloInsumoPost";

interface Step1Props {
  formik: FormikProps<IArticuloInsumoPost>;
}

const Step1: React.FC<Step1Props> = ({ formik }) => {
  return (
    <>
      {/* DENOMINACION */}
      <Form.Group controlId="denominacion" className="mb-3">
        <Form.Label>Denominación</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingrese la denominación"
          name="denominacion"
          value={formik.values.denominacion}
          onChange={formik.handleChange}
          isInvalid={
            formik.touched.denominacion && !!formik.errors.denominacion
          }
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.denominacion}
        </Form.Control.Feedback>
      </Form.Group>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          {/* PRECIO DE COMPRA */}
          <Form.Group controlId="precioCompra" className="mb-3">
            <Form.Label>Precio de Compra</Form.Label>
            <InputGroup>
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control
                type="number"
                placeholder="Ingrese el precio de compra"
                name="precioCompra"
                value={formik.values.precioCompra}
                onChange={formik.handleChange}
                isInvalid={
                  formik.touched.precioCompra && !!formik.errors.precioCompra
                }
              />
            </InputGroup>
            <Form.Control.Feedback type="invalid">
              {formik.errors.precioCompra}
            </Form.Control.Feedback>
          </Form.Group>
        </Grid>
        <Grid item xs={4}>
          {/* PRECIO DE VENTA */}
          <Form.Group controlId="precioVenta" className="mb-3">
            <Form.Label>Precio de Venta</Form.Label>
            <InputGroup>
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control
                type="number"
                placeholder="Ingrese el precio de venta"
                name="precioVenta"
                value={formik.values.precioVenta}
                onChange={formik.handleChange}
                isInvalid={
                  formik.touched.precioVenta && !!formik.errors.precioVenta
                }
                disabled={formik.values.esParaElaborar} // Deshabilita si es para elaborar
              />
            </InputGroup>
            <Form.Control.Feedback type="invalid">
              {formik.errors.precioVenta}
            </Form.Control.Feedback>
          </Form.Group>
        </Grid>
        <Grid
          item
          xs={4}
          display="flex"
          alignItems="end"
          justifyContent="center"
        >
          {/* ES PARA ELABORAR */}
          <Form.Group controlId="esParaElaborar" className="mb-3">
            <Form.Check
              type="checkbox"
              label="Es para Elaborar"
              name="esParaElaborar"
              checked={formik.values.esParaElaborar}
              onChange={formik.handleChange}
            />
          </Form.Group>
        </Grid>
      </Grid>
    </>
  );
};

export default Step1;
