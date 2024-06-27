import { ReactNode, useEffect, useState } from "react";
import { useAppSelector } from "../../../../hooks/redux";
import { ButtonsTable } from "../../ButtonsTable/ButtonsTable";
import SearchBar from "../../SearchBar/SearchBar";
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
  TableSortLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

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
  deletable?: boolean;
}

export const GenericTable = <T extends { id: number }>({
  columns,
  handleDelete,
  setOpenModal,
  setSelectedId,
  editable,
  deletable,
}: ITableProps<T>) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const dataTable = useAppSelector((state) => state.tableReducer.dataTable);

  useEffect(() => {
    const filteredRows = dataTable.filter((row) =>
      columns.some((column) => {
        const value = column.render ? column.render(row) : row[column.key];
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

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedRows = rows.slice().sort((a, b) => {
    const valueA = a[orderBy];
    const valueB = b[orderBy];

    if (valueA === null || valueA === undefined) return 1;
    if (valueB === null || valueB === undefined) return -1;

    if (typeof valueA === "string" && typeof valueB === "string") {
      return order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    if (typeof valueA === "number" && typeof valueB === "number") {
      return order === "asc" ? valueA - valueB : valueB - valueA;
    }

    return 0;
  });

  return (
    <div className="genericTable-container">
      {(deletable === undefined || deletable !== false) && (
        <div className="genericTable-header">
          <SearchBar
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Buscar..."
          />
          <IconButton
            color="primary"
            aria-label="add"
            onClick={() => {
              setOpenModal(true);
            }}>
            <AddIcon />
          </IconButton>
        </div>
      )}
      <Paper sx={{ width: "95%", overflow: "hidden" }}>
        <TableContainer
          sx={deletable ? { maxHeight: "56vh" } : { maxHeight: "64vh" }}>
          <Table aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column, i: number) => (
                  <TableCell key={i} align={"center"}>
                    <TableSortLabel
                      active={orderBy === column.key}
                      direction={orderBy === column.key ? order : "asc"}
                      onClick={() => handleRequestSort(column.key)}>
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRows.length === 0 ? (
                <TableRow>
                  {columns.map((column, i) => (
                    <TableCell key={i} align="center">
                      {/* Renderiza celdas vacías */}
                    </TableCell>
                  ))}
                </TableRow>
              ) : (
                sortedRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isRowEditable = columns.every((column) => {
                      if (
                        (column.key === "estado" &&
                          (row[column.key]?.includes("CANCELADO") ||
                            row[column.key]?.includes("RECHAZADO")))
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
                              editable={
                                isRowEditable !== undefined
                                  ? isRowEditable
                                  : editable
                              }
                              deletable={deletable}
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
          rowsPerPageOptions={[10, 25, 100]}
          style={{ height: "60px" }}
          component="div"
          count={sortedRows.length}
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
