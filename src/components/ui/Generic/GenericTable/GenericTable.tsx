import { ReactNode, useEffect, useState } from "react";
import { useAppSelector } from "../../../../hooks/redux";
import { ButtonsTable } from "../../ButtonsTable/ButtonsTable";
import "./StyleGenericTable.css";

import {
  IconButton,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { Table } from "react-bootstrap";

// Definición del tipo Order
type Order = "asc" | "desc";

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
    marginLeft: theme.spacing(1),
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
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

interface ITableColumn<T> {
  label: string;
  key: string;
  render?: (item: T) => ReactNode;
}
export interface ITableProps<T> {
  columns: ITableColumn<T>[];
  handleDelete: (id: number) => void;
  setOpenModal: (state: boolean) => void;
}

export const GenericTable = <T extends { id: number }>({
  columns,
  handleDelete,
  setOpenModal,
}: ITableProps<T>) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string>("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  //Cambiar de pagina desde donde estoy parado
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  //Se usa el + antes del event para convertirlo en un numero ya que vienen del input como string
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [rows, setRows] = useState<any[]>([]);

  //Obtener los datos de la tabla en su estado inicial (sin datos)
  const dataTable = useAppSelector((state) => state.tableReducer.dataTable);

  //useEffect va a estar escuchando el estado 'dataTable' para actualizar los datos de las filas con los datos de la tabla
  useEffect(() => {
    const filteredRows = dataTable.filter((row) =>
      Object.values(row).some((value: any) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setRows(filteredRows);
  }, [dataTable, searchTerm]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        height: "100%",
        flexDirection: "column",
        gap: "3vh",
        marginTop: "3vh",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <Search
          style={{
            flexGrow: 1,
            marginLeft: "1rem",
            marginRight: "1rem",
            backgroundColor: "#f0f0f0",
          }}
        >
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Buscar..."
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
        <IconButton
          color="primary"
          aria-label="add"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          <AddIcon />
        </IconButton>
      </div>
      <Paper sx={{ width: "95%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "70vh" }}>
          <Table aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column, i: number) => (
                  <TableCell
                    key={i}
                    align={"center"}
                    sortDirection={orderBy === column.key ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === column.key}
                      direction={orderBy === column.key ? order : "asc"}
                      onClick={(e) => handleRequestSort(e, column.key)}
                    >
                      {column.label}
                    </TableSortLabel>
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
                    return (
                      <TableRow
                        key={index}
                        className={row.eliminado ? "filaDeshabilitada" : ""}
                      >
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
                        <div
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ButtonsTable
                            el={row}
                            handleDelete={handleDelete}
                            setOpenModal={setOpenModal}
                          />
                        </div>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
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
