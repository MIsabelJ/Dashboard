import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IInitialState {
    sucursalActual: number;
}

const initialState: IInitialState = {
    sucursalActual: 0,
}

export const SucursalReducer = createSlice({
    name: "SucursalReducer",
    initialState,
    reducers: {
        setCurrentSucursal(state, action: PayloadAction<number>) {
            state.sucursalActual = action.payload
        }
    }
})

export const { setCurrentSucursal } = SucursalReducer.actions
export default SucursalReducer.reducer