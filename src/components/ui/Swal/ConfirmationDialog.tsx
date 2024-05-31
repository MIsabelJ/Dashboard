import React from "react";
import Swal from "sweetalert2";

// FIXME: NO FUNCIONA ESTE COMPONENTE

interface ConfirmationDialogProps {
  title: string;
  text: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  children: React.ReactNode; // Agregamos esta prop para renderizar un elemento hijo
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  title,
  text,
  confirmButtonText = "Sí, adelante",
  cancelButtonText = "Cancelar",
  onConfirm,
  onCancel,
  children, // Utilizamos esta prop para renderizar el elemento hijo
}) => {
  const showConfirmationDialog = () => {
    Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText,
      cancelButtonText,
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      } else if (onCancel) {
        onCancel();
      }
    });
  };

  return <div onClick={showConfirmationDialog}>{children}</div>;
};

export default ConfirmationDialog;
