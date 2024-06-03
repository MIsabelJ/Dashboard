import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import {
  Autocomplete,
  AutocompleteRenderGroupParams,
  Grid,
  TextField,
} from "@mui/material";
import { FormikProps } from "formik";
import { IArticuloManufacturadoPost } from "../../../../../types/ArticuloManufacturado/IArticuloManufacturadoPost";
import { GroupHeader, GroupItems } from "../utils/styles";

interface Step1Props {
  formik: FormikProps<IArticuloManufacturadoPost>;
  categoriasFiltradas: {
    id: number;
    denominacion: string;
    parent: number | null;
    esParaElaborar: boolean;
  }[];
}

const Step1: React.FC<Step1Props> = ({ formik, categoriasFiltradas }) => {
  const categoriasParaMostrar = categoriasFiltradas.filter(
    (categoria) => categoria.esParaElaborar === false
  );

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
        <Grid item xs={8}>
          {/* CATEGORIA */}
          <Form.Group controlId="idCategoria" className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Autocomplete
              id="idCategoria"
              options={categoriasParaMostrar}
              value={
                categoriasParaMostrar.find(
                  (categoria) => categoria.id === formik.values.idCategoria
                ) || null
              }
              groupBy={(option) =>
                option.parent
                  ? categoriasParaMostrar.find(
                      (categoria) => categoria.id === option.parent
                    )?.denominacion || ""
                  : option.denominacion
              }
              getOptionLabel={(option) => option.denominacion}
              getOptionKey={(option) => option.id}
              onChange={(event, value) => {
                formik.setFieldValue("idCategoria", value?.id);
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField {...params} label="Categorías" />
              )}
              renderGroup={(params: AutocompleteRenderGroupParams) => (
                <li key={params.key}>
                  <GroupHeader>{params.group}</GroupHeader>
                  <GroupItems>{params.children}</GroupItems>
                </li>
              )}
            />
          </Form.Group>
        </Grid>
        <Grid item xs={4}>
          {/* PRECIO VENTA */}
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
              />
            </InputGroup>
            <Form.Control.Feedback type="invalid">
              {formik.errors.precioVenta}
            </Form.Control.Feedback>
          </Form.Group>
        </Grid>
      </Grid>
      {/* DESCRIPCION */}
      <Form.Group controlId="descripcion" className="mb-3">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Describa el producto"
          name="descripcion"
          value={formik.values.descripcion}
          onChange={formik.handleChange}
          isInvalid={formik.touched.descripcion && !!formik.errors.descripcion}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.descripcion}
        </Form.Control.Feedback>
      </Form.Group>
    </>
  );
};

export default Step1;
