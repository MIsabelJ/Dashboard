import React, { useEffect, useState } from "react";
import { ICategoriaPost } from "../../../../types/Categoria/ICategoriaPost";
import { EmpresaService } from "../../../../services/EmpresaService";
import { Modal, Form } from "react-bootstrap";
import { Autocomplete, Button, Grid, TextField } from "@mui/material";
import { SucursalService } from "../../../../services/SucursalService";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./ModalCategorias.css";
import AddIcon from "@mui/icons-material/Add";
import { CategoriaService } from "../../../../services/CategoriaService";
import Swal from "sweetalert2";
import { ICategoria } from "../../../../types/Categoria/ICategoria";
import { CategoriaModal } from "./ModalCategorias";

interface CategoriaModalProps {
  show: boolean;
  handleClose: () => void;
  setCategorias: React.Dispatch<React.SetStateAction<ICategoria[]>>;
  selectedId?: number;
  isCategoriaPadre: boolean;
}

export const ModalEditCategorias: React.FC<CategoriaModalProps> = ({
  show,
  handleClose,
  selectedId,
  setCategorias,
  isCategoriaPadre,
}) => {
  const [opcionesSucursal, setOpcionesSucursal] = useState<
    { label: string; id: number }[]
  >([]);
  const [openModal, setOpenModal] = useState(false);

  const empresaActive = localStorage.getItem("empresaId");

  const API_URL = import.meta.env.VITE_API_URL as string;
  const empresaService = new EmpresaService(API_URL + "/empresa");
  const sucursalService = new SucursalService(API_URL + "/sucursal");

  const validationSchema = Yup.object({
    denominacion: Yup.string().required("Denominación es requerida"),
    idSucursales: Yup.array()
      .of(Yup.number())
      .required("Seleccione sucursales"),
    esParaElaborar: Yup.boolean(),
  });

  const initialValues: ICategoriaPost = {
    denominacion: "",
    idSucursales: [],
    idSubCategorias: [],
    esParaElaborar: false,
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const categoria: ICategoriaPost = {
        denominacion: values.denominacion,
        idSucursales: values.idSucursales,
        idSubCategorias: values.idSubCategorias,
        esParaElaborar: values.esParaElaborar,
      };
      handleSave(categoria);
      internalHandleClose();
      formik.resetForm();
    },
  });

  // -------------------- SERVICE --------------------
  const categoriaService = new CategoriaService(`${API_URL}/categoria`);
  // const dispatch = useAppDispatch();

  // -------------------- HANDLERS --------------------
  const handleSave = async (categoria: ICategoriaPost) => {
    if (selectedId) {
      try {
        console.log("Categoria antes del put: ", categoria);
        const response = await categoriaService.put(selectedId, categoria);
        // En este punto no estoy pudiendo hacer un put, no se actualizan las sucursales
        console.log("respuesta del put: ", response);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        console.log("Categoria antes del post: ", categoria);
        const response = await categoriaService.post(categoria);
        console.log("Respuesta del post: ", response);
      } catch (error) {
        console.error(error);
      }
    }
    getAllCategoria();
    swalAlert("Éxito", "Datos subidos correctamente", "success");
    internalHandleClose();
    formik.resetForm();
  };

  const internalHandleClose = () => {
    handleClose();
    setOpcionesSucursal([]);
    formik.resetForm();
  };

  const handleSucursalChange = (
    event: any,
    value: { label: string; id: number }[]
  ) => {
    const list = value.map((option) => option.id);
    formik.setFieldValue("idSucursales", list);
  };

  // -------------------- FUNCIONES --------------------
  const swalAlert = (
    title: string,
    content: string,
    icon: "error" | "success"
  ) => {
    Swal.fire(title, content, icon);
  };

  const getAllCategoria = async () => {
    const sucursalId = localStorage.getItem("sucursalId");
    let response;
    if (sucursalId) {
      response = await sucursalService.getCategoriaBySucursalId(
        Number(sucursalId)
      );
      setCategorias(response);
    }
  };

  const getOneCategoria = async (id: number) => {
    try {
      const categoria = await categoriaService.getById(id);
      if (categoria) {
        const listSucursales =
          categoria.sucursales?.map((sucursal) => sucursal.id) || [];
        formik.setValues({
          denominacion: categoria.denominacion,
          idSucursales: listSucursales,
          idSubCategorias: categoria.subCategorias.map(
            (subcategoria) => subcategoria.id
          ),
          esParaElaborar: categoria.esParaElaborar,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveSubcategoria = async (subcategoria: ICategoriaPost) => {
    if (selectedId) {
      try {
        await categoriaService.addSubCategoria(selectedId, subcategoria);
      } catch (error) {
        console.error(error);
      }
    }
    getAllCategoria();
    swalAlert("Éxito", "Datos subidos correctamente", "success");
    setOpenModal(false);
    internalHandleClose();
  };

  // -------------------- EFFECTS --------------------

  useEffect(() => {
    if (show) {
      const getSucursales = async (idEmpresa: number) => {
        const sucursales = await empresaService.getSucursalesByEmpresaId(
          idEmpresa
        );

        const opciones = sucursales.map((sucursal) => ({
          label: sucursal.nombre,
          id: sucursal.id,
        }));
        setOpcionesSucursal(opciones);
      };

      if (show && empresaActive) {
        getSucursales(Number(empresaActive));
        if (selectedId) {
          getOneCategoria(selectedId);
        }
      }
    }
  }, [show]);

  return (
    <>
      <Modal show={show} onHide={internalHandleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2} justifyContent="space-between">
              <Grid item xs={8}>
                <Form.Group controlId="formDenominacion" className="mb-3">
                  <Form.Label>Denominación</Form.Label>
                  <Form.Control
                    type="text"
                    name="denominacion"
                    value={formik.values.denominacion}
                    onChange={formik.handleChange}
                    isInvalid={
                      formik.touched.denominacion &&
                      !!formik.errors.denominacion
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.denominacion}
                  </Form.Control.Feedback>
                </Form.Group>
              </Grid>
              <Grid item xs={4}>
                <Form.Group controlId="formEsParaElaborar" className="mb-3">
                  <Form.Check
                    type="checkbox"
                    id="checkbox-esParaElaborar"
                    label="Es para elaborar"
                    name="esParaElaborar"
                    checked={formik.values.esParaElaborar}
                    onChange={formik.handleChange}
                  />
                </Form.Group>
              </Grid>
            </Grid>
            <Form.Group controlId="formIdSucursales" className="mb-3">
              <Form.Label className="mr-2">
                Sucursales en las que está disponible
              </Form.Label>
              <Autocomplete
                multiple
                id="tags-outlined"
                options={opcionesSucursal}
                getOptionLabel={(option) => option?.label || ""}
                filterSelectedOptions
                value={opcionesSucursal
                  .filter(
                    (sucursal: { label: string; id: number | null }) =>
                      sucursal !== null
                  )
                  .filter((sucursal: { label: string; id: number }) =>
                    formik.values.idSucursales.includes(sucursal.id)
                  )}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                onChange={handleSucursalChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sucursales"
                    placeholder="Seleccione sucursales"
                    error={
                      formik.touched.idSucursales &&
                      !!formik.errors.idSucursales
                    }
                    helperText={
                      formik.touched.idSucursales && formik.errors.idSucursales
                    }
                  />
                )}
              />
            </Form.Group>
            {selectedId && (
              <Form.Group>
                <Grid item display="flex" justifyContent="flex-start">
                  <Button
                    onClick={() => setOpenModal(true)}
                    variant="contained"
                    startIcon={<AddIcon />}>
                    Añadir subcategoría
                  </Button>
                </Grid>
              </Form.Group>
            )}
            <Modal.Footer className="d-flex justify-content-between">
              <Button variant="outlined" onClick={internalHandleClose}>
                Cancelar
              </Button>
              <Button variant="contained" type="submit">
                Guardar
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
      <CategoriaModal
        show={openModal}
        handleClose={() => setOpenModal(false)}
        setCategorias={setCategorias}
        sucursales={opcionesSucursal
          .filter(
            (sucursal: { label: string; id: number | null }) =>
              sucursal !== null
          )
          .filter((sucursal: { label: string; id: number }) =>
            formik.values.idSucursales.includes(sucursal.id)
          )}
        esParaElaborar={formik.values.esParaElaborar}
        handleSaveSubcategoria={handleSaveSubcategoria}
      />
    </>
  );
};
