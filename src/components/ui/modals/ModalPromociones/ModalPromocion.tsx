
// import * as Yup from "yup";
// import { GenericModal } from "../GenericModal";
// import { IPromocion } from "../../../../types/IPromocion";
// import { useAppSelector } from "../../../../hooks/redux";

// interface IModalPromocion {
//     getPromocion: () => void; // Función para obtener las Promocion
//     openModal: boolean;
//     setOpenModal: (state: boolean) => void;
// }

// export const ModalPromocion = ({ getPromocion, openModal, setOpenModal }: IModalPromocion) => {

//     const elementActive = useAppSelector(
//         (state) => state.tableReducer.elementActive
//     );

//     // console.log(elementActive)

//     // Necesario para el modal genérico con insumos
//     const initialValues: IPromocion = elementActive?.element || {
//         id: 0,
//         image: '',
//         name: '',
//         since: '',
//         until: '',
//         description: '',
//         price: 0,
//         actions: '',
//         active: true,
//     };

//     //validación del formulario específico para insumos
//     const validationSchema = Yup.object({
//         image: Yup.string().required('Campo requerido'),
//         name: Yup.string().required('Campo requerido'),
//         since: Yup.string().required('Campo requerido'),
//         until: Yup.string().required('Campo requerido'),
//         description: Yup.string().required('Campo requerido'),
//         price: Yup.number().required('Campo requerido').min(0, 'El precio debe ser mayor o igual a 0'),
//     }) as Yup.ObjectSchema<object>;

//     // Traducción de los placeholders del formulario de insumos
//     const translatedPlaceholder = {
//         name: 'Nombre',
//         image: 'Imagen',
//         since: 'Desde',
//         until: 'Hasta',
//         description: 'Descripción',
//         price: 'Precio',
//     }

//     // Englobamos todas las props referidas al formulario que vamos a pasarle al Modal genérico
//     const formDetails = {
//         validationSchema: validationSchema,
//         initialValues: initialValues,
//         translatedPlaceholder: translatedPlaceholder,
//         formInputType: {
//             name: 'text',
//             image: 'text',
//             since: 'date',
//             until: 'date',
//             description: 'text',
//             price: 'number',
//         },
//     }
//     return (
//         <GenericModal<IPromocion>
//             openModal={openModal}
//             setOpenModal={setOpenModal}
//             modalTitle="Promoción"
//             formDetails={formDetails}
//             route="sales"
//             getItems={getPromocion}
//         />
//     )
// }
