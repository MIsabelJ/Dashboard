import { ReactNode, useEffect, useState } from "react";
// ---------- ARCHIVOS----------
import { useAppSelector } from "../../../../hooks/redux";
import { ButtonsTable } from "../../ButtonsTable/ButtonsTable";
import SearchBar from "../../SearchBar/SearchBar";
// ---------- ESTILOS ----------
import "./GenericTable.css";
import { Table } from "react-bootstrap";
import {
  IconButton,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

// ------------------------------ CÓDIGO ------------------------------
// -------------------- INTERFAZ --------------------
interface ITableColumn<T> {
  label: string;
  key: string;
  render?: (item: T) => ReactNode;
}

export interface ITableProps<T> {
  columns: ITableColumn<T>[];
  handleDelete: (id: number) => void;
  setOpenModal: (state: boolean) => void;
  setSelectedId: (state: number) => void;
  editable?: boolean;
}

// ------------------------------ COMPONENTE PRINCIPAL ------------------------------
export const GenericTable = <T extends { id: number }>({
  columns,
  handleDelete,
  setOpenModal,
  setSelectedId,
  editable,
}: ITableProps<T>) => {
  // -------------------- STATES --------------------
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState<any[]>([]);

  // -------------------- HANDLERS --------------------
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Cambiar de pagina desde donde estoy parado
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Se usa el + antes del event para convertirlo en un numero ya que vienen del input como string
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // -------------------- FUNCIONES --------------------
  // Obtener los datos de la tabla en su estado inicial (sin datos)
  const dataTable = useAppSelector((state) => state.tableReducer.dataTable);

  // -------------------- EFFECTS --------------------
  // useEffect va a estar escuchando el estado 'dataTable' para actualizar los datos de las filas con los datos de la tabla
  useEffect(() => {
    const filteredRows = dataTable.filter((row) =>
      columns.some((column) => {
        const value = column.render ? column.render(row) : row[column.key];
        // Convertir a texto para búsqueda
        const textValue =
          typeof value === "string"
            ? value
            : value !== null && value !== undefined
            ? value.toString()
            : "";
        return textValue.toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
    setRows(filteredRows);
  }, [dataTable, searchTerm, columns]);

  // -------------------- RENDER --------------------
  return (
    <div className="genericTable-container">
      <div className="genericTable-header">
        {/* BARRA DE BÚSQUEDA */}
        <SearchBar
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Buscar..."
        />
        {/* BOTÓN DE AGREGAR */}
        <IconButton
          color="primary"
          aria-label="add"
          onClick={() => {
            setOpenModal(true);
          }}>
          <AddIcon />
        </IconButton>
      </div>
      <Paper sx={{ width: "95%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "70vh", overflow: "auto" }}>
          <Table aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column, i: number) => (
                  <TableCell key={i} align={"center"}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  {columns.map((column, i) => (
                    <TableCell key={i} align="center">
                      {/* Renderiza celdas vacías */}
                    </TableCell>
                  ))}
                </TableRow>
              ) : (
                rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    // Determine if the row should be editable based on a specific cell value
                    const isRowEditable = columns.every((column) => {
                      if (column.key == "estado") console.log(row[column.key]);
                      if (
                        column.key === "estado" &&
                        row[column.key].includes("CANCELADO")
                      ) {
                        return false;
                      }
                      return true;
                    });

                    return (
                      <TableRow
                        key={index}
                        className={row.eliminado ? "filaDeshabilitada" : ""}>
                        {columns.map((column, i) => {
                          if (column.key === "id") return null;
                          return (
                            <TableCell key={i} align="center">
                              {column.render
                                ? column.render(row)
                                : row[column.key]}
                            </TableCell>
                          );
                        })}
                        <TableCell>
                          <div className="genericTable-buttons-container">
                            <ButtonsTable
                              el={row}
                              setSelectedId={setSelectedId}
                              handleDelete={handleDelete}
                              setOpenModal={setOpenModal}
                              editable={isRowEditable}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          style={{ minHeight: "60px" }}
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default GenericTable;
