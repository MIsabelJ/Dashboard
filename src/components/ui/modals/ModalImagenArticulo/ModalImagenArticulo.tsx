import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { IImagenArticuloPost } from '../../../../types/ImagenArticulo/IImagenArticuloPost';

interface ImagenArticuloModalProps {
    show: boolean;
    handleClose: () => void;
    handleSave: (imagenArticulo: IImagenArticuloPost) => void;
}

const ImagenArticuloModal: React.FC<ImagenArticuloModalProps> = ({ show, handleClose, handleSave }) => {
    const [url, setUrl] = useState<string>('');

    const onSave = () => {
        handleSave({ url });
        setUrl(''); // Reset form
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Imagen de Artículo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formUrl">
                        <Form.Label>URL de la Imagen</Form.Label>
                        <Form.Control
                            type="text"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={onSave}>
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};