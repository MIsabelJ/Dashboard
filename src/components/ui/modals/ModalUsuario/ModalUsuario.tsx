import React, { useState, useEffect } from "react";
import { IUsuario } from "../../../../types/Usuario/IUsuario";
import { UsuarioService } from "../../../../services/UsuarioService";
import { API_URL, initialValues } from "./utils/constants";
import { useAppDispatch } from "../../../../hooks/redux";
import { setDataTable } from "../../../../redux/slices/TablaReducer";
import { IUsuarioPost } from "../../../../types/Usuario/IUsuarioPost";
import Swal from "sweetalert2";
import { Modal, Button, Form } from "react-bootstrap";
import { SucursalService } from "../../../../services/SucursalService";
import { ISucursal } from "../../../../types/Sucursal/ISucursal";
import { EmpleadoService } from "../../../../services/EmpleadoService";
import { IEmpleado } from "../../../../types/Empleado/IEmpleado";
import { IEmpleadoPost } from "../../../../types/Empleado/IEmpleadoPost";

//---------------- INTERFAZ ----------------
interface ModalUsuariosProps {
  show: boolean;
  handleClose: () => void;
  selectedId?: number;
}

const roles = [
  "ADMIN",
  "ADMIN_NEGOCIO",
  "CAJERO",
  "COCINERO",
  "REPOSITOR",
  "DELIVERY",
];

const initialValuesPost: IEmpleadoPost = {
  nombre: "",
  apellido: "",
  tipoEmpleado: "",
  idSucursal: 0,
  pedidos: [],
  usuarioEmpleado: {
    email: "",
    password: "",
    userName: "",
  }
};

const ModalUsuario = ({
  show,
  handleClose,
  selectedId,
}: ModalUsuariosProps) => {
  // -------------------- STATES --------------------
  const [values, setValues] = useState<IEmpleadoPost>();
  const [previousValues, setPreviousValues] = useState<IEmpleado>();
  const [usuarioEmpleado, setUsuarioEmpleado] = useState<IUsuarioPost>();
  //Guarda los valores de todas las sucursales que existen y que vayan a añadirse con el useEffect
  const [sucursales, setSucursales] = useState<ISucursal[]>([]);

  // -------------------- SERVICE --------------------

  const empleadoService = new EmpleadoService(API_URL + "/empleado");
  const sucursalService = new SucursalService(API_URL + "/sucursal");
  const dispatch = useAppDispatch();

  // -------------------- FUNCIONES --------------------

  const swalAlert = (
    title: string,
    content: string,
    icon: "error" | "success"
  ) => {
    Swal.fire(title, content, icon);
  };

  //NO SE SI DEBE IR ESTO
  const getAllUsuario = async () => {
    await empleadoService.getAll().then((usuarioData) => {
      dispatch(setDataTable(usuarioData));
    });
    
  };

  //MANEJAR EDICION
  const getOneUsuario = async (id: number) => {
    try {
      const usuario = await empleadoService.getById(id);
      if (usuario != null) {
        const usuarioPost : IEmpleadoPost = {
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          tipoEmpleado: usuario.tipoEmpleado,
          idSucursal: Number(localStorage.getItem("sucursalId")),
          pedidos: [],
          usuarioEmpleado: {
            email: usuario.usuarioEmpleado.email,
            password: usuario.usuarioEmpleado.password,
            userName: usuario.usuarioEmpleado.userName,
          }
        }
        setValues(usuarioPost);
        setPreviousValues(usuario);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // -------------------- HANDLERS --------------------

  const handleChange = (
    e: React.ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setValues({
      ...(values as IEmpleadoPost),
      [e.target.name]: e.target.value,
    });
    setUsuarioEmpleado((prevUsuarioEmpleado) => ({
      email: e.target.name === "email" ? e.target.value : prevUsuarioEmpleado?.email || "",
      userName: e.target.name === "userName" ? e.target.value : prevUsuarioEmpleado?.userName || "",
      password: e.target.name === "password" ? e.target.value : prevUsuarioEmpleado?.password || "",
    }));
  };

  const handleSave = async () => {
    if (selectedId) {
      try {
        await empleadoService.put(selectedId, values as IEmpleadoPost);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        if (values && usuarioEmpleado){
          const usuarioPost: IEmpleadoPost = {
            nombre: values.nombre,
            apellido: values.apellido,
            tipoEmpleado: values.tipoEmpleado,
            idSucursal: Number(localStorage.getItem("sucursalId")) ,
            usuarioEmpleado: usuarioEmpleado,
            pedidos: [],
          };
          console.log("usuarioPost", usuarioPost);
          await empleadoService.post(usuarioPost);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getAllUsuario();
    swalAlert("Éxito", "Datos subidos correctamente", "success");
    internalHandleClose();
  };

  const internalHandleClose = () => {
    setSucursales([]);
    setUsuarioEmpleado(undefined);
    setPreviousValues(undefined);
    setValues(initialValues);
    handleClose();
  };

  // -------------------- EFFECTS --------------------
  useEffect(() => {
    if (show) {
      const getSucursales = async () => {
        const response = await sucursalService.getAll();
        setSucursales(response);
      };
      getSucursales();
      if (selectedId) {
        getOneUsuario(selectedId);
      }
    }
  }, [show, selectedId]);

  return (
    <Modal show={show} onHide={internalHandleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {previousValues ? "Editar Usuario" : "Agregar Usuario"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          { !previousValues && (
            <>
              <Form.Group controlId="formUserUsername">
                <Form.Label>Usuario</Form.Label>
                <Form.Control
                  type="text"
                  name="userName"
                  onChange={handleChange}
                  placeholder="Ingrese el usuario"
                />
              </Form.Group>
              <Form.Group controlId="formUserEmail">
                <Form.Label>Correo</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="Ingrese el correo"
                />
              </Form.Group>
              <Form.Group controlId="formUserPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="Ingrese la contraseña"
                />
              </Form.Group>
            </>
          )}
          <Form.Group controlId="formUserName">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={values?.nombre}
              onChange={handleChange}
              placeholder="Ingrese el nombre"
            />
            <Form.Label>Apellido</Form.Label>
          </Form.Group>
          <Form.Group controlId="formUserLastName">
            <Form.Control
              type="text"
              name="apellido"
              value={values?.apellido}
              onChange={handleChange}
              placeholder="Ingrese el nombre"
            />
          </Form.Group>
          <Form.Group controlId="formUserRol" className="mt-3">
            <Form.Label>Rol</Form.Label>
            <Form.Select
              name="tipoEmpleado"
              value={values?.tipoEmpleado}
              onChange={handleChange}>
              {roles.map((rol) => (
                <option key={rol} value={rol}>
                  {rol}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          {/* <Form.Group controlId="formUserIdSucursal" className="mt-3">
            <Form.Label>Sucursal</Form.Label>
            <Form.Select
              name="idSucursal"
              value={values?.idSucursal}
              onChange={handleChange}>
              {sucursales.map((sucursal) => (
                <option key={sucursal.id} value={sucursal.id}>
                  {sucursal.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group> */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalUsuario;
