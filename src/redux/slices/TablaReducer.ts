import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Definimos una interfaz genérica para los datos de la tabla
interface ITableData<T> {
  dataTable: T[]; // Datos de la tabla
  elementActive: null | T; // Elemento activo seleccionado
}

// Estado inicial del slice
const initialState: ITableData<any> = {
  dataTable: [], // Inicialmente la tabla está vacía
  elementActive: null, // No hay ningún elemento activo seleccionado inicialmente
};

// Creamos un slice con Redux Toolkit para manejar la tabla
const TablaReducer = createSlice({
  name: "TableReducer", // Nombre del slice
  initialState, // Estado inicial del slice
  reducers: {
    // Reducer para establecer los datos de la tabla
    setDataTable<T>(state: ITableData<T>, action: PayloadAction<T[]>) {
      state.dataTable = action.payload; // Actualizamos los datos de la tabla con los datos proporcionados
    },
    // Reducer para establecer el elemento activo
    setElementActive<T>(state: ITableData<T>, action: PayloadAction<T>) {
      state.elementActive = action.payload; // Establecemos el elemento activo con el elemento proporcionado en el payload
    },
    // Reducer para eliminar el elemento activo
    removeElementActive<T>(state: ITableData<T>) {
      state.elementActive = null; // Eliminamos el elemento activo estableciéndolo como null
    },
  },
});

// Exportamos los actions generados por el slice
export const { setDataTable, setElementActive, removeElementActive } =
  TablaReducer.actions;

// Exportamos el reducer generado por el slice
export default TablaReducer.reducer;
