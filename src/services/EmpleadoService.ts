import { IEmpleado } from "../types/Empleado/IEmpleado";
import { IEmpleadoPost } from "../types/Empleado/IEmpleadoPost";
import { BackendClient } from "./BackendClient";

export class EmpleadoService extends BackendClient<IEmpleado, IEmpleadoPost, IEmpleadoPost>{}