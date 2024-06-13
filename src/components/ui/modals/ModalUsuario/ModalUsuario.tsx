import React, { useState, useEffect } from "react";
import { IUsuario } from "../../../../types/Usuario/IUsuario";
import { UsuarioService } from "../../../../services/UsuarioService";
import { initialValues } from "./utils/constants";
import { useAppDispatch } from "../../../../hooks/redux";
import { setDataTable } from "../../../../redux/slices/TablaReducer";
import { IUsuarioPost } from "../../../../types/Usuario/IUsuarioPost";
import Swal from "sweetalert2";
import { Modal, Button, Form } from "react-bootstrap";
import { SucursalService } from "../../../../services/SucursalService";
import { ISucursal } from "../../../../types/Sucursal/ISucursal";
import { useServiceHeaders } from "../../../../hooks/useServiceHeader";

//---------------- INTERFAZ ----------------
interface ModalUsuariosProps {
  show: boolean;
  handleClose: () => void;
  selectedId?: number;
}

const roles = [
  "admin",
  "admin del negocio",
  "cajero",
  "cocinero",
  "repositor",
  "delivery",
];

const ModalUsuario = ({
  show,
  handleClose,
  selectedId,
}: ModalUsuariosProps) => {
  // -------------------- STATES --------------------
  const [values, setValues] = useState<IUsuario | IUsuarioPost>();
  //Guarda los valores de todas las sucursales que existen y que vayan a añadirse con el useEffect
  const [sucursales, setSucursales] = useState<ISucursal[]>([]);

  // -------------------- SERVICE --------------------

  const usuarioService = useServiceHeaders(UsuarioService, "usuario");
  const sucursalService = useServiceHeaders(SucursalService, "sucursal");
  const dispatch = useAppDispatch();

  // -------------------- FUNCIONES --------------------

  const swalAlert = (
    title: string,
    content: string,
    icon: "error" | "success"
  ) => {
    Swal.fire(title, content, icon);
  };

  const getAllUsuario = async () => {
    await usuarioService.getAll().then((usuarioData) => {
      dispatch(setDataTable(usuarioData));
    });
  };

  const getOneUsuario = async (id: number) => {
    try {
      const usuario = await usuarioService.getById(id);
      if (usuario) setValues(usuario);
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
      ...(values as IUsuarioPost),
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (selectedId) {
      try {
        await usuarioService.put(selectedId, values as IUsuarioPost);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const usuarioPost: IUsuarioPost = {
          name: values?.name || "",
          rol: values?.rol || "",
          idSucursal: (values as IUsuarioPost).idSucursal || 1,
        };
        await usuarioService.post(usuarioPost);
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
    setValues(initialValues);
    handleClose();
  };

  // -------------------- EFFECTS --------------------
  useEffect(() => {
    if (show && usuarioService && sucursalService) {
      const getSucursales = async () => {
        const response = await sucursalService.getAll();
        setSucursales(response);
      };
      getSucursales();
      if (selectedId) {
        getOneUsuario(selectedId);
      } else {
        setValues(initialValues);
      }
    }
  }, [show, usuarioService, sucursalService]);

  return (
    <Modal show={show} onHide={internalHandleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {values?.name !== "" ? "Editar Usuario" : "Agregar Usuario"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formUserName">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={values?.name || ""}
              onChange={handleChange}
              placeholder="Ingrese el nombre"
            />
          </Form.Group>
          <Form.Group controlId="formUserRol" className="mt-3">
            <Form.Label>Rol</Form.Label>
            <Form.Select
              name="rol"
              value={values?.rol || ""}
              onChange={handleChange}>
              {roles.map((rol) => (
                <option key={rol} value={rol}>
                  {rol}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="formUserIdSucursal" className="mt-3">
            <Form.Label>Sucursal</Form.Label>
            <Form.Select
              name="idSucursal"
              value={(values as IUsuarioPost)?.idSucursal || ""}
              onChange={handleChange}>
              {sucursales.map((sucursal) => (
                <option key={sucursal.id} value={sucursal.id}>
                  {sucursal.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
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
