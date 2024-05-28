import React, { useEffect, useState } from 'react';
import { IUnidadMedidaPost } from '../../../../types/UnidadMedida/IUnidadMedidaPost';
import { Modal, Button, Form } from 'react-bootstrap';
import { IUnidadMedida } from '../../../../types/UnidadMedida/IUnidadMedida';
import { UnidadMedidaService } from '../../../../services/UnidadMedidaService';
import { useAppDispatch } from '../../../../hooks/redux';
import { setDataTable } from '../../../../redux/slices/TablaReducer';

// ---------- INTERFAZ ----------
interface UnidadMedidaModalProps {
    show: boolean;
    handleClose: () => void;
    selectedId?: number;
}

// ------------------------------ COMPONENTE PRINCIPAL ------------------------------
export const UnidadMedidaModal: React.FC<UnidadMedidaModalProps> = ({ show, handleClose, selectedId }) => {
    const [values, setValues] = useState<IUnidadMedida | IUnidadMedidaPost>()

    const API_URL = import.meta.env.VITE_API_URL;
    const unidadMedidaService = new UnidadMedidaService(API_URL + "/unidad-medida");
    const dispatch = useAppDispatch();

    const handleSave = async () => {
        if (selectedId) {
            try {
                console.log(values)
                await unidadMedidaService.put(selectedId, values as IUnidadMedidaPost);
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                const unidadMedida: IUnidadMedidaPost = { denominacion: values?.denominacion || '' };
                await unidadMedidaService.post(unidadMedida);
            } catch (error) {
                console.error(error);
            }
        }
        getAll();
        handleClose();
        setValues(undefined);
    };

    const getAll = async () => {
        await unidadMedidaService.getAll().then((unidadMedidaData) => {
            dispatch(setDataTable(unidadMedidaData));
        });
    };

    const getOne = async () => {
        try {
            if (selectedId) {
                const unidadMedida = await unidadMedidaService.getById(selectedId);
                if (unidadMedida) {
                    setValues(unidadMedida);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setValues((prevValues) => prevValues ? { ...prevValues, denominacion: value } : { denominacion: value });
    };

    useEffect(() => {
        if (selectedId) {
            console.log(selectedId)
            getOne();
        } else {
            setValues({ denominacion: '' }); // Clear form for new entry
        }
    }, [selectedId]);

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{selectedId ? 'Editar' : 'Agregar'} Unidad de Medida</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Control
                    type="text"
                    value={values?.denominacion || ''}
                    onChange={handleChange}
                />
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
