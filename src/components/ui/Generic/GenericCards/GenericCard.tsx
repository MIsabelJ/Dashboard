import { ReactNode } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import { ButtonsTable } from "../../ButtonsTable/ButtonsTable";
import { SwitchButton } from "../../ButtonsTable/Switch";
import AddIcon from "@mui/icons-material/Add";
import { ModalSucursal } from "../../modals/ModalSucursal/ModalSucursal";

interface IGenericAtribute<T> {
  label: string;
  key: string;
  render?: (item: T) => ReactNode;
}
export interface ICardProps<T> {
  items: any[];
  handleClick: (id: number) => void;
  handleDelete: (id: number) => void;
  setOpenModal: (state: boolean) => void;
}

export const GenericCards = <T extends { id: number }>({
  items,
  handleClick,
  handleDelete,
  setOpenModal,
}: ICardProps<T>) => {
  if (items && items.length > 0) {
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          padding: "24px",
          gap: "16px",
        }}
      >
        {items.map((item) => (
          <>
            <Card
              key={item.id}
              sx={{
                width: "250px",
                height: "280px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                "&:hover": {
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.5)",
                },
              }}
            >
              <div style={{ textAlign: "center" }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {item.nombre}
                </Typography>
                <SwitchButton id={item.id} currentState={item.eliminado} />
              </div>
              <div style={{ marginBottom: "10px" }}>
                {item.razonSocial && (
                  <Typography variant="body2" gutterBottom>
                    Descripción: {item.razonSocial}
                  </Typography>
                )}
                {item.direccion && (
                  <Typography variant="body2" gutterBottom>
                    Dirección: {item.direccion}
                  </Typography>
                )}
              </div>
              <CardActions
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button size="small" onClick={() => handleClick(item.id)}>
                  Ver más
                </Button>
                <ButtonsTable
                  el={item}
                  handleDelete={handleDelete}
                  setOpenModal={setOpenModal}
                />
              </CardActions>
            </Card>
          </>
        ))}
        <Card
          sx={{
            width: "250px",
            height: "280px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
            "&:hover": { boxShadow: "0 8px 16px rgba(0, 0, 0, 0.5)" },
          }}
          onClick={() => setOpenModal(true)}
        >
          <Typography variant="h5" component="h2" style={{ cursor: "pointer" }}>
            Añadir +
          </Typography>
        </Card>
      </div>
    );
  } else {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "24px",
          gap: "16px",
        }}
      >
        <Card
          sx={{
            width: "250px",
            height: "280px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
            "&:hover": { boxShadow: "0 8px 16px rgba(0, 0, 0, 0.5)" },
          }}
          onClick={() => setOpenModal(true)}
        >
          <Typography variant="h5" component="h2" style={{ cursor: "pointer" }}>
            Añadir +
          </Typography>
        </Card>
      </div>
    );
  }
};
