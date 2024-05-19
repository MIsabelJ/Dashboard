import React from 'react';
import { IManufacturado } from '../../../../types/IManufacturado';
import * as Yup from 'yup';
import { GenericModal } from '../GenericModal';
import { useAppSelector } from '../../../../hooks/redux';

interface IModalManufacturado {
  getManufacturados: () => void; // Función para obtener los manufacturados
  openModal: boolean;
  setOpenModal: (state: boolean) => void;
}

export const ModalManufacturado = ({
  getManufacturados,
  openModal,
  setOpenModal,
}: IModalManufacturado) => {

  const elementActive = useAppSelector(
    (state) => state.tableReducer.elementActive
  );


  // Necesario para el modal genérico con manufacturados
  const initialValues: IManufacturado = elementActive?.element || {
    id: 0,
    name: '',
    price: 0,
    description: '',
    category: '',
    image: '',
    stock: 0,
    actions: '',
    active: true,
  };

  //validación del formulario específico para manufacturados
  const validationSchema = Yup.object({
    name: Yup.string().required('Campo requerido'),
    price: Yup.number().required('Campo requerido'),
    description: Yup.string().required('Campo requerido'),
    category: Yup.string().required('Campo requerido'),
    image: Yup.string().required('Campo requerido'),
    stock: Yup.number().required('Campo requerido'),
  }) as Yup.ObjectSchema<object>;

  // Traducción de los placeholders del formulario de manufacturados
  const translatedPlaceholder = {
    name: 'Nombre',
    price: 'Precio',
    description: 'Descripción',
    category: 'Categoría',
    image: 'Imagen',
    stock: 'Stock',
  }

  // Englobamos todas las props referidas al formulario que vamos a pasarle al Modal genérico
  const formDetails = {
    validationSchema: validationSchema,
    initialValues: initialValues,
    translatedPlaceholder: translatedPlaceholder,
    formInputType: {
      name: 'text',
      price: 'number',
      description: 'text',
      category: 'text',
      image: 'text',
      stock: 'number'
    },
  }
  return (
    <GenericModal<IManufacturado>
      modalTitle="Producto Manufacturado"
      getItems={getManufacturados}
      openModal={openModal}
      setOpenModal={setOpenModal}
      route="manufactured"
      formDetails={formDetails} />
  )
}