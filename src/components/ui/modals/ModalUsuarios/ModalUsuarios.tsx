
// import * as Yup from "yup";
// import { GenericModal } from "../GenericModal";
// import { IUsuario } from "../../../../types/IUsuario";
// import { useAppSelector } from "../../../../hooks/redux";

// interface IModalUsuario {
//     getUsuarios: () => void; // Función para obtener las Promocion
//     openModal: boolean;
//     setOpenModal: (state: boolean) => void;
// }
// export const ModalUsuarios = ({ getUsuarios, openModal, setOpenModal }: IModalUsuario) => {

//     const elementActive = useAppSelector(
//         (state) => state.tableReducer.elementActive
//     );

//     // Necesario para el modal genérico con insumos
//     const initialValues: IUsuario = elementActive?.element || {
//         id: 0,
//         name: '',
//         actions: '',
//         active: true,
//     };

//     //validación del formulario específico para insumos
//     const validationSchema = Yup.object({
//         name: Yup.string().required('Campo requerido'),
//     }) as Yup.ObjectSchema<object>;

//     // Traducción de los placeholders del formulario de insumos
//     const translatedPlaceholder = {
//         name: 'Nombre',
//     }

//     // Englobamos todas las props referidas al formulario que vamos a pasarle al Modal genérico
//     const formDetails = {
//         validationSchema: validationSchema,
//         initialValues: initialValues,
//         translatedPlaceholder: translatedPlaceholder,
//         formInputType: {
//             name: 'text',
//         },
//     }
//     return (
//         <GenericModal<IUsuario>
//             modalTitle="Usuario"
//             getItems={getUsuarios}
//             openModal={openModal}
//             setOpenModal={setOpenModal}
//             route="users"
//             formDetails={formDetails} />
//     )
// }
