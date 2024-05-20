import { PayloadAction, createSlice } from "@reduxjs/toolkit"

interface IInitialState{
    empresaActual: number
}

const initialState: IInitialState = {
    empresaActual: 0
}

export const EmpresaReducer = createSlice({
    name: "EmpresaReducer",
    initialState,
    reducers: {
        setCurrentEmpresa(state, action: PayloadAction<number>) {
            state.empresaActual = action.payload
        }
    }
})

export const { setCurrentEmpresa } = EmpresaReducer.actions
export default EmpresaReducer.reducer