import React, { useEffect, useState } from "react";
// ---------- ARCHIVOS----------
import { ICategoriaPost } from "../../../../types/Categoria/ICategoriaPost";
import { ISucursal } from "../../../../types/Sucursal/ISucursal";
import { EmpresaService } from "../../../../services/EmpresaService";
import { useAppSelector } from "../../../../hooks/redux";
import SearchBar from "../../SearchBar/SearchBar";
// ---------- ESTILOS ----------
import "./ModalCategorias.css";
import { Modal, Form } from "react-bootstrap";
import { Button, Grid } from "@mui/material";

// ------------------------------ CÓDIGO ------------------------------

// ---------- INTERFAZ ----------
interface CategoriaModalProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (categoria: ICategoriaPost) => void;
}

// ------------------------------ COMPONENTE PRINCIPAL ------------------------------
export const CategoriaModal: React.FC<CategoriaModalProps> = ({
  show,
  handleClose,
  handleSave,
}) => {
  // -------------------- STATES --------------------
  const [denominacion, setDenominacion] = useState<string>("");
  const [idSucursales, setIdSucursales] = useState<number[]>([]);
  const [idSubcategorias, setIdSubcategorias] = useState<number[]>([]);
  const [existingSucursales, setExistingSucursales] = useState<ISucursal[]>([]);
  const [esParaElaborar, setEsParaElaborar] = useState<boolean>(false);

  // Barra de búsqueda para sucursales
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState<any[]>([]);

  const empresaActive = useAppSelector(
    (state) => state.empresaReducer.empresaActual
  );
  // -------------------- SERVICIOS --------------------

  const API_URL = import.meta.env.VITE_API_URL as string;
  const empresaService = new EmpresaService(API_URL + "/empresa");

  // -------------------- FUNCIONES --------------------

  const onSave = () => {
    const categoria: ICategoriaPost = {
      denominacion: denominacion,
      idSucursales: idSucursales,
      idSubCategorias: idSubcategorias,
      esParaElaborar: esParaElaborar,
    };
    handleSave(categoria);
    handleClose();
    setDenominacion(""); // Reset form
    setIdSucursales([]);
    setIdSubcategorias([]);
    setEsParaElaborar(false);
  };

  // BARRA DE BÚSQUEDA
  // Obtener los datos de la tabla en su estado inicial (sin datos)
  const dataTable = useAppSelector((state) => state.tableReducer.dataTable);

  // -------------------- HANDLERS --------------------
  // Barra de búsqueda para sucursales
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddSucursal = (id: number) => {
    // if (!idSucursales.includes(id)) {
    setIdSucursales([...idSucursales, id]);
    // }
  };

  const handleRemoveSucursal = (id: number) => {
    setIdSucursales(idSucursales.filter((sucursalId) => sucursalId !== id));
  };

  // Para seleccionar todas las sucursales
  const handleToggleAll = () => {
    if (idSucursales.length === existingSucursales.length) {
      setIdSucursales([]);
    } else {
      setIdSucursales(existingSucursales.map((sucursal) => sucursal.id));
    }
  };

  // -------------------- EFFECTS --------------------
  // BARRA DE BÚSQUEDA
  // useEffect va a estar escuchando el estado 'dataTable' para actualizar los datos de las filas con los datos de la tabla
  useEffect(() => {
    const filteredRows = dataTable.filter((row) =>
      Object.values(row).some((value: any) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setRows(filteredRows);
  }, [dataTable, searchTerm]);

  useEffect(() => {
    const getSucursales = async (idEmpresa) => {
      const response = await empresaService.getSucursalesByEmpresaId(idEmpresa);
      setExistingSucursales(response);
    };
    getSucursales(empresaActive);
  });

  // -------------------- RENDER --------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Crear Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
          <Form>
            <Grid container spacing={2} justifyContent="space-between">
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
                    onChange={() => setEsParaElaborar(!esParaElaborar)}
                  />
                </Form.Group>
              </Grid>
            </Grid>
            <Form.Group controlId="formIdSucursales" className="mb-3">
              <Form.Label className="mr-2">Sucursales</Form.Label>
              <Grid container spacing={2} justifyContent="space-between">
                <Grid item xs={9}>
                  <SearchBar
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Buscar Sucursal..."
                  />
                </Grid>
                <Grid
                  item
                  xs={3}
                  style={{ display: "flex", justifyContent: "flex-start" }}
                >
                  <Form.Check
                    type="checkbox"
                    id="checkbox-all"
                    label="Seleccionar todas"
                    checked={idSucursales.length === existingSucursales.length}
                    onChange={handleToggleAll}
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
                      style={{ maxHeight: "150px", overflowY: "auto" }}
                    >
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
    </>
  );
};
