import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { FormikProps } from "formik";
import { IArticuloInsumoPost } from "../../../../../types/ArticuloInsumo/IArticuloInsumoPost";
import {
  Autocomplete,
  AutocompleteRenderGroupParams,
  Grid,
  TextField,
} from "@mui/material";
import { GroupHeader, GroupItems } from "../utils/styles";
import { ICategoria } from "../../../../../types/Categoria/ICategoria";
import { useServiceHeaders } from "../../../../../hooks/useServiceHeader";
import { CategoriaService } from "../../../../../services/CategoriaService";
import { formatCategorias } from "../utils/helpers";

interface Step2Props {
  formik: FormikProps<IArticuloInsumoPost>;
  opcionesUnidadMedida: { label: string; id: number }[];
  categoriasFiltradas: {
    id: number;
    denominacion: string;
    parent: number | null;
    esParaElaborar: boolean;
  }[];
}

const Step2: React.FC<Step2Props> = ({
  formik,
  opcionesUnidadMedida,
  categoriasFiltradas,
}) => {
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [formatedCategorias, setFormatedCategorias] = useState<
    {
      id: number;
      denominacion: string;
      parent: number | null;
      esParaElaborar: boolean;
    }[]
  >([]);

  const categoriaService: CategoriaService = useServiceHeaders(
    CategoriaService,
    "categoria"
  );

  useEffect(() => {
    if (categoriaService != null) {
      const getCategorias = async () => {
        const response = await categoriaService.getAll();
        setCategorias(response);
      };
      getCategorias();
    }
  }, [categoriaService]);

  useEffect(() => {
    const categoriasParaMostrar = categorias?.filter(
      (categoria) => categoria.esParaElaborar === formik.values.esParaElaborar
    );
    setFormatedCategorias(formatCategorias(categoriasParaMostrar));
  }, [categorias]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          {/* STOCK MÍNIMO */}
          <Form.Group controlId="stockMinimo" className="mb-3">
            <Form.Label>Stock Mínimo</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese el stock mínimo"
              name="stockMinimo"
              value={formik.values.stockMinimo}
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.stockMinimo && !!formik.errors.stockMinimo
              }
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.stockMinimo}
            </Form.Control.Feedback>
          </Form.Group>
        </Grid>
        <Grid item xs={4}>
          {/* STOCK ACTUAL */}
          <Form.Group controlId="stockActual" className="mb-3">
            <Form.Label>Stock Actual</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese el stock actual"
              name="stockActual"
              value={formik.values.stockActual}
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.stockActual && !!formik.errors.stockActual
              }
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.stockActual}
            </Form.Control.Feedback>
          </Form.Group>
        </Grid>
        <Grid item xs={4}>
          {/* STOCK MAXIMO */}
          <Form.Group controlId="stockMaximo" className="mb-3">
            <Form.Label>Stock Máximo</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese el stock máximo"
              name="stockMaximo"
              value={formik.values.stockMaximo}
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.stockMaximo && !!formik.errors.stockMaximo
              }
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.stockMaximo}
            </Form.Control.Feedback>
          </Form.Group>
        </Grid>
      </Grid>
      {/* UNIDAD DE MEDIDA */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={6}>
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
                formik.setFieldValue("idUnidadMedida", value?.id)
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
          {/* CATEGORIA */}
          <Form.Group controlId="idCategoria" className="mb-3">
            <Form.Label>Categoría</Form.Label>

            <Autocomplete
              id="idCategoria"
              options={formatedCategorias}
              value={
                formatedCategorias.find(
                  (categoria) => categoria.id === formik.values.idCategoria
                ) || null
              }
              groupBy={(option) =>
                option.parent
                  ? categoriasFiltradas.find(
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
      </Grid>
    </>
  );
};

export default Step2;
