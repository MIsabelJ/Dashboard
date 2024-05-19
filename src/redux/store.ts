
import { configureStore } from "@reduxjs/toolkit";
import TableReducer from "./slices/TablaReducer";
import SucursalReducer from "./slices/SucursalReducer";

export const store = configureStore({
  reducer: {
    tableReducer: TableReducer,
    sucursalReducer: SucursalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
