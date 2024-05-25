import React, { useEffect, useState } from "react";
// ---------- ARCHIVOS----------
import { ICategoriaPost } from "../../../../types/Categoria/ICategoriaPost";
import { ISucursal } from "../../../../types/Sucursal/ISucursal";
import { useAppSelector } from "../../../../hooks/redux";
// ---------- ESTILOS ----------
import { Modal, Form} from "react-bootstrap";
import { Button, Grid, InputBase, alpha, styled } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// ------------------------------ CÓDIGO ------------------------------

// BARRA DE BÚSQUEDA DE SUCURSALES
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: 0, //theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    minWidth: "200px",
    [theme.breakpoints.up("sm")]: {
      width: "20ch",
      "&:focus": {
        width: "30ch",
      },
    },
  },
}));

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

  // Barra de búsqueda para sucursales
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState<any[]>([]);

  const empresaActual = useAppSelector(
    (state) => state.empresaReducer.empresaActual
  );

  // -------------------- FUNCIONES --------------------
  const dataCard = useAppSelector((state) => state.tableReducer.dataTable);
  const dataFilter: ISucursal[] = dataCard.filter(
    (item: ISucursal) => item.empresa && item.empresa.id === empresaActual
  );
  const existingSucursales: ISucursal[] = dataFilter;

  const onSave = () => {
    const categoria: ICategoriaPost = {
      denominacion: denominacion,
      idSucursales: idSucursales,
      idSubcategorias: idSubcategorias,
    };
    handleSave(categoria);
    handleClose();
    setDenominacion(""); // Reset form
    setIdSucursales([]);
    setIdSubcategorias([]);
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

  const handleAddSubcategoria = (id: number) => {
    if (!idSubcategorias.includes(id)) {
      setIdSubcategorias([...idSubcategorias, id]);
    }
  };

  const handleRemoveSucursal = (id: number) => {
    setIdSucursales(idSucursales.filter((sucursalId) => sucursalId !== id));
  };

  const handleRemoveSubcategoria = (id: number) => {
    setIdSubcategorias(
      idSubcategorias.filter((subcategoriaId) => subcategoriaId !== id)
    );
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

  // -------------------- RENDER --------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Crear Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
          <Form>
            <Form.Group controlId="formDenominacion" className="mb-3">
              <Form.Label>Denominación</Form.Label>
              <Form.Control
                type="text"
                value={denominacion}
                onChange={(e) => setDenominacion(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formIdSucursales" className="mb-3">
              <Form.Label className="mr-2">Sucursales</Form.Label>
              <Grid container spacing={2} justifyContent="space-between">
                <Grid item xs={9}>
                  <Search
                    style={{
                      flexGrow: 1,
                      // marginLeft: "1rem",
                      // marginRight: "1rem",
                      backgroundColor: "#f0f0f0",
                      marginBottom: "1rem",
                    }}
                  >
                    <SearchIconWrapper>
                      <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                      value={searchTerm}
                      onChange={handleSearch}
                      placeholder="Buscar Sucursal..."
                      inputProps={{ "aria-label": "search" }}
                    />
                  </Search>
                </Grid>
                <Grid item xs={3} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <Form.Check
                    type="checkbox"
                    id="checkbox-all"
                    label="Seleccionar todas"
                    checked={idSucursales.length === existingSucursales.length}
                    onChange={handleToggleAll}
                  />
                </Grid>
              </Grid>
              <div
                className="sucursales-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "10px",
                  border: "1px solid #dee2e6",
                  padding: "10px",
                  borderRadius: "5px",
                  backgroundColor: "#f8f9fa",
                }}
              >
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
              {/* <div style={{ flex: "1 1 45%", minWidth: "200px" }}>
                  <ListGroup>
                    {idSucursales.map((id) => (
                      <ListGroup.Item
                        key={id}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <span>
                          {
                            existingSucursales.find(
                              (sucursal) => sucursal.id === id
                            )?.nombre
                          }
                        </span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div> */}
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
