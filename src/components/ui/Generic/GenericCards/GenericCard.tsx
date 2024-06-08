import { ButtonsTable } from "../../ButtonsTable/ButtonsTable";
import { Button, Card, CardActions, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import "./GenericCard.css";

// -------------------- INTERFAZ --------------------
export interface ICardProps<T> {
  items: T[];
  handleClick: (id: number) => void;
  handleDelete: (id: number) => void;
  setOpenModal: (state: boolean) => void;
  denominacion: string;
  setSelectedId: (state: number) => void;
  editable?: boolean;
}

// ------------------------------ COMPONENTE PRINCIPAL ------------------------------
export const GenericCards = <
  T extends { id: number; nombre: string; eliminado: boolean }
>({
  items,
  handleClick,
  handleDelete,
  setOpenModal,
  denominacion,
  setSelectedId,
  editable,
}: ICardProps<T>) => {
  // -------------------- RENDER --------------------
  if (items && items.length > 0) {
    return (
      <div className="generic-cards-container">
        <Card className="generic-card" onClick={() => setOpenModal(true)}>
          <Typography
            variant="h4"
            component="h1"
            className="generic-card-title">
            Añadir
          </Typography>
          <Typography
            variant="h6"
            component="h5"
            className="generic-card-subtitle">
            {denominacion}
          </Typography>
          <AddIcon sx={{ fontSize: "70px", color: "grey" }} color="action" />
        </Card>

        {items.map((item) => (
          <Card
            key={item.id}
            className={`item-card ${
              item.eliminado ? "item-card-disabled" : "item-card-enabled"
            }`}>
            <div style={{ textAlign: "center" }}>
              <Typography variant="h5" component="h2" gutterBottom>
                {item.nombre}
              </Typography>
            </div>
            <CardActions className="item-card-actions">
              <Button
                size="small"
                onClick={() => {
                  !item.eliminado ? handleClick(item.id) : null;
                }}>
                Ver más
              </Button>
              <ButtonsTable
                el={{ ...item }}
                handleDelete={handleDelete}
                setOpenModal={setOpenModal}
                setSelectedId={setSelectedId}
                editable={editable}
              />
            </CardActions>
          </Card>
        ))}
      </div>
    );
  } else {
    return (
      <div className="empty-state-container">
        <Card className="generic-card" onClick={() => setOpenModal(true)}>
          <Typography
            variant="h4"
            component="h1"
            className="generic-card-title">
            Añadir
          </Typography>
          <Typography
            variant="h6"
            component="h5"
            className="generic-card-subtitle">
            {denominacion}
          </Typography>
          <AddIcon sx={{ fontSize: "70px", color: "grey" }} color="action" />
        </Card>
      </div>
    );
  }
};
