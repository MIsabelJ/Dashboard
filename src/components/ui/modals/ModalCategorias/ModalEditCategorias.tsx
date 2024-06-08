import { useEffect, useState } from "react";
import { ICategoria } from "../../../../types/Categoria/ICategoria";
import { ICategoriaPost } from "../../../../types/Categoria/ICategoriaPost";
import { CategoriaModal } from "./ModalCategorias";
import { Modal, Form } from "react-bootstrap";
import { Button, Grid } from "@mui/material";
// import SearchBar from "../../SearchBar/SearchBar";
import { ISucursal } from "../../../../types/Sucursal/ISucursal";
import { EmpresaService } from "../../../../services/EmpresaService";

// ---------- INTERFAZ ----------
interface ICategoriaModalProps {
  show: boolean;
  handleClose: () => void;
  handleUpdate: (id: number, categoria: ICategoriaPost) => void;
  categoria: ICategoria;
  addSubCategoria: (id: number, subCategoria: ICategoriaPost) => void;
}

// ------------------------------ COMPONENTE PRINCIPAL ------------------------------
export const ModalEditCategorias = ({
  show,
  handleClose,
  handleUpdate,
  categoria,
  addSubCategoria,
}: ICategoriaModalProps) => {
  // -------------------- STATES --------------------
  const [denominacion, setDenominacion] = useState(categoria.denominacion);
  const [idSucursales, setIdSucursales] = useState<number[]>(
    categoria.sucursales.map((sucursal) => sucursal.id)
  );
  const [existingSucursales, setExistingSucursales] = useState<ISucursal[]>([]);
  const [idSubcategorias, setIdSubcategorias] = useState(
    categoria.subCategorias
  );
  const [esParaElaborar, setEsParaElaborar] = useState(
    categoria.esParaElaborar
  );
  const [openModal, setOpenModal] = useState(false);
  // Barra de búsqueda para sucursales
  const [searchTerm, setSearchTerm] = useState("");

  // -------------------- SERVICES --------------------

  const API_URL = import.meta.env.VITE_API_URL;
  const empresaService = new EmpresaService(API_URL + "/empresa");
  // -------------------- HANDLERS --------------------
  const handleSaveSubcategoria = async (subcategoria: ICategoriaPost) => {
    await addSubCategoria(categoria.id, subcategoria);
    setOpenModal(false);
  };

  // const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchTerm(event.target.value);
  // };

  const handleToggleAll = () => {
    if (idSucursales.length === existingSucursales.length) {
      setIdSucursales([]);
    } else {
      setIdSucursales(existingSucursales.map((sucursal) => sucursal.id));
    }
  };

  const handleAddSucursal = (id: number) => {
    if (!idSucursales.includes(id)) {
      setIdSucursales([...idSucursales, id]);
    }
  };

  const handleRemoveSucursal = (id: number) => {
    setIdSucursales(idSucursales.filter((sucursalId) => sucursalId !== id));
  };

  // -------------------- FUNCIONES --------------------
  const onSave = () => {
    const categoriaUpdate: ICategoriaPost = {
      // id: categoria.id,
      // eliminado: categoria.eliminado,
      denominacion: denominacion,
      idSucursales: idSucursales, // Map the array of ISucursal to an array of numbers
      idSubCategorias: idSubcategorias.map((subcategoria) => subcategoria.id),
      esParaElaborar: esParaElaborar,
    };
    handleUpdate(categoria.id, categoriaUpdate);
    handleClose();
    setDenominacion(""); // Reset form
    setIdSucursales([]);
    setIdSubcategorias([]);
    setEsParaElaborar(false);
  };

  // -------------------- EFFECTS --------------------
  // useEffect(() => {
  //   setDenominacion(categoria.denominacion);
  //   // setIdSucursales(categoria.sucursales);
  //   setIdSubcategorias(categoria.subCategorias);
  //   setEsParaElaborar(categoria.esParaElaborar);
  // }, [categoria]);

  // BARRA DE BÚSQUEDA
  // useEffect va a estar escuchando el estado 'dataTable' para actualizar los datos de las filas con los datos de la tabla
  // useEffect(() => {
  //   const filteredRows = dataTable.filter((row) =>
  //     Object.values(row).some((value: any) =>
  //       value.toString().toLowerCase().includes(searchTerm.toLowerCase())
  //     )
  //   );
  //   setRows(filteredRows);
  // }, [dataTable, searchTerm]);

  useEffect(() => {
    const getSucursales = async (idEmpresa: number) => {
      const response = await empresaService.getSucursalesByEmpresaId(idEmpresa);
      setExistingSucursales(response);
    };
    getSucursales(Number(localStorage.getItem("empresaId")));
  }, [show]);
  // -------------------- RENDER --------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Form.Group controlId="formDenominacion" className="mb-3">
                  <Form.Label>Denominación</Form.Label>
                  <Form.Control
                    type="text"
                    value={denominacion}
                    onChange={(e) => setDenominacion(e.target.value)}
                  />
                </Form.Group>
              </Grid>
              <Grid item xs={4}>
                <Form.Group controlId="formEsParaElaborar" className="mb-3">
                  <Form.Check
                    type="checkbox"
                    id="checkbox-esParaElaborar"
                    label="Es para elaborar"
                    checked={esParaElaborar}
                    disabled
                  />
                </Form.Group>
              </Grid>
            </Grid>
            <Form.Group controlId="formIdSucursales" className="mb-3">
              <Form.Label className="mr-2">Sucursales</Form.Label>
              <Grid container spacing={2} justifyContent="space-between">
                <Grid item xs={9}>
                  {/* <SearchBar
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Buscar Sucursal..."
              /> */}
                </Grid>
                <Grid
                  item
                  xs={3}
                  style={{ display: "flex", justifyContent: "flex-start" }}>
                  <Form.Check
                    type="checkbox"
                    id="checkbox-all"
                    label="Seleccionar todas"
                    checked={idSucursales.length === existingSucursales.length}
                    onChange={() => {
                      handleToggleAll();
                    }}
                  />
                </Grid>
              </Grid>
              <div className="sucursales-grid">
                {existingSucursales
                  .filter((sucursal) =>
                    sucursal.nombre
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((sucursal) => (
                    <div
                      key={sucursal.id}
                      className="mb-3"
                      style={{ maxHeight: "150px", overflowY: "auto" }}>
                      <Form.Check
                        type="checkbox"
                        id={`checkbox-${sucursal.id}`}
                        label={sucursal.nombre}
                        checked={idSucursales.includes(sucursal.id)}
                        onChange={() => {
                          if (idSucursales.includes(sucursal.id)) {
                            handleRemoveSucursal(sucursal.id);
                          } else {
                            handleAddSucursal(sucursal.id);
                          }
                        }}
                      />
                    </div>
                  ))}
              </div>
            </Form.Group>
            <Form.Group controlId="formIdSubcategorias" className="mb-3">
              <div className="d-flex mb-2 justify-content-between">
                <Form.Label className="mr-2">Subcategorías</Form.Label>
                <Button
                  variant="contained"
                  onClick={() => setOpenModal(true)}
                  className="ml-2">
                  Agregar Sub Categoria
                </Button>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="outlined" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={onSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
      <CategoriaModal
        show={openModal}
        handleClose={() => setOpenModal(false)}
        handleSave={handleSaveSubcategoria}
      />
    </>
  );
};
