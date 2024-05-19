import React from 'react';
import { IArticuloInsumo } from '../../../../types/IArticuloInsumo';
import * as Yup from 'yup';
import { useAppSelector } from '../../../../hooks/redux';

interface IModalInsumo {
  getInsumos: () => void; // Función para obtener los insumos
  openModal: boolean;
  setOpenModal: (state: boolean) => void;
}

export const ModalInsumo = ({
  getInsumos,
  openModal,
  setOpenModal,
}: IModalInsumo) => {

  const elementActive = useAppSelector(
    (state) => state.tableReducer.elementActive
  );

  // Necesario para el modal genérico con insumos
  const initialValues: IInsumo = elementActive?.element || {
    id: 0,
    name: '',
    price: 0,
    description: '',
    category: '',
    isIngredient: true,
    image: '',
    stock: 0,
    actions: '',
    active: true,
  };

  //validación del formulario específico para insumos
  const validationSchema = Yup.object({
    name: Yup.string().required('Campo requerido'),
    price: Yup.number().required('Campo requerido'),
    description: Yup.string().required('Campo requerido'),
    category: Yup.string().required('Campo requerido'),
    isIngredient: Yup.boolean().required('Campo requerido'),
    image: Yup.string().required('Campo requerido'),
    stock: Yup.number().required('Campo requerido'),
  }) as Yup.ObjectSchema<object>;

  // Traducción de los placeholders del formulario de insumos
  const translatedPlaceholder = {
    name: 'Nombre',
    price: 'Precio',
    description: 'Descripción',
    category: 'Categoría',
    isIngredient: 'Es ingrediente',
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
      isIngredient: 'checkbox',
      image: 'text',
      stock: 'number',
    },
  }
  return (
    // <GenericModal<IInsumo>
    //   modalTitle="Insumo"
    //   getItems={getInsumos}
    //   openModal={openModal}
    //   setOpenModal={setOpenModal}
    //   route="supplies"
    //   formDetails={formDetails} />
  )
}