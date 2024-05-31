import { ButtonsTable } from "../../ButtonsTable/ButtonsTable";
import { Button, Card, CardActions, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import "./GenericCard.css"

// -------------------- INTERFAZ --------------------
export interface ICardProps<T> {
  items: T[];
  handleClick: (id: number) => void;
  handleDelete: (id: number) => void;
  setOpenModal: (state: boolean) => void;
  denominacion: string;
}

// ------------------------------ COMPONENTE PRINCIPAL ------------------------------
export const GenericCards = <T extends { id: number }>({
  items,
  handleClick,
  handleDelete,
  setOpenModal,
  denominacion,
}: ICardProps<T>) => {
  // -------------------- RENDER --------------------
  if (items && items.length > 0) {
    return (
      <div className="generic-cards-container">
        <Card className="generic-card" onClick={() => setOpenModal(true)}>
          <Typography
            variant="h4"
            component="h1"
            className="generic-card-title"
          >
            Añadir
          </Typography>
          <Typography
            variant="h6"
            component="h5"
            className="generic-card-subtitle"
          >
            {denominacion}
          </Typography>
          <AddIcon sx={{ fontSize: "70px", color: "grey" }} color="action" />
        </Card>

        {items.map((item) => (
          <>
            <Card
              key={item.id}
              className={`item-card ${
                item.eliminado ? "item-card-disabled" : "item-card-enabled"
              }`}
            >
              <div style={{ textAlign: "center" }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {item.nombre}
                </Typography>
              </div>
              <div style={{ marginBottom: "10px" }}>
                {item.razonSocial && (
                  <Typography variant="body2" gutterBottom>
                    Razón social: {item.razonSocial}
                  </Typography>
                )}
                {item.direccion && (
                  <Typography variant="body2" gutterBottom>
                    Dirección: {item.direccion.calle} {item.direccion.numero}
                  </Typography>
                )}
              </div>
              <CardActions className="item-card-actions">
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
      </div>
    );
  } else {
    return (
      <div className="empty-state-container">
        <Card className="generic-card" onClick={() => setOpenModal(true)}>
          <Typography
            variant="h4"
            component="h1"
            className="generic-card-title"
          >
            Añadir
          </Typography>
          <Typography
            variant="h6"
            component="h5"
            className="generic-card-subtitle"
          >
            {denominacion}
          </Typography>
          <AddIcon sx={{ fontSize: "70px", color: "grey" }} color="action" />
        </Card>
      </div>
    );
  }
};
