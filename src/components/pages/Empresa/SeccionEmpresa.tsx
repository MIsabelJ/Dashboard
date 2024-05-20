import { useEffect, useState } from "react";
import { EmpresaService } from "../../../services/EmpresaService";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setDataTable } from "../../../redux/slices/TablaReducer";
import { IEmpresa } from "../../../types/Empresa/IEmpresa";
import Swal from "sweetalert2";
import { Loader } from "../../ui/Loader/Loader";
import { GenericCards } from "../../ui/Generic/GenericCards/GenericCard";
import { useNavigate } from "react-router-dom";

import { AppBar, Toolbar, Typography } from "@mui/material";
import { ModalEmpresa } from "../../ui/modals/ModalEmpresa/ModalEmpresa";
import { IEmpresaPost } from "../../../types/Empresa/IEmpresaPost";

const API_URL = import.meta.env.VITE_API_URL;

export const SeccionEmpresa = () => {
  const dataCard = useAppSelector((state) => state.tableReducer.dataTable);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<IEmpresa | null>(null);

  const empresaService = new EmpresaService(API_URL + "/empresa");
  const dispatch = useAppDispatch();

  const handleClick = (id: number) => {
    navigate(`/empresa/${id}/sucursal`);
  };

  const handleEdit = async (id: number) => {
    const selectedEntity = await empresaService.getById(id);
    setSelectedEntity(selectedEntity); // Actualiza el estado con los datos de la entidad seleccionada
    setOpenModal(true);
  };

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: `¿Seguro que quieres eliminar?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await empresaService.delete(id).then(() => {
          getEmpresa();
        });
      }
    });
  };

  const getEmpresa = async () => {
    await empresaService.getAll().then((empresaData) => {
      dispatch(setDataTable(empresaData));
      setLoading(false);
    });
  };

  const handleSave = async (empresa: IEmpresaPost) => {
    try {
      const response = await empresaService.post(empresa);
      getEmpresa();
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    getEmpresa();
  }, []);

  return (
    <>
      <div>
        <AppBar style={{ zIndex: 1000 }} position="fixed">
          {/* Navbar */}
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Empresas
            </Typography>
          </Toolbar>
        </AppBar>
        {/* Mostrar indicador de carga mientras se cargan los datos */}
        <div style={{ marginTop: "100px" }}>
          {loading ? (
            <Loader />
          ) : (
            // Mostrar la tabla de personas una vez que los datos se han cargado
            <GenericCards<IEmpresa>
              items={dataCard}
              handleClick={handleClick}
              handleDelete={handleDelete}
              setOpenModal={setOpenModal}
            />
          )}
        </div>
      </div>
      <ModalEmpresa
        show={openModal}
        handleClose={() => setOpenModal(false)}
        handleSave={handleSave}
      />
    </>
  );
};
