import { ButtonsTable } from "../../ButtonsTable/ButtonsTable";
import { Button, Card, CardActions, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

// -------------------- INTERFAZ --------------------
export interface ICardProps<T> {
  items: any[];
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
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          padding: "24px",
          gap: "16px",
        }}
      >
        <Card
          sx={{
            width: "250px",
            height: "280px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
            border: "2px dashed grey",
            borderRadius: "10px",
            boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
            "&:hover": { boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)" },
          }}
          onClick={() => setOpenModal(true)}
        >
          <Typography
            variant="h4"
            component="h1"
            style={{ cursor: "pointer", marginBottom: "3px", color: "grey" }}
          >
            Añadir
          </Typography>
          <Typography
            variant="h6"
            component="h5"
            style={{ cursor: "pointer", marginBottom: "15px", color: "grey" }}
          >
            {denominacion}
          </Typography>
          <AddIcon sx={{ fontSize: "70px", color: "grey" }} color="action" />
        </Card>

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
                opacity: item.eliminado ? 0.5 : 1.0,
                cursor: item.eliminado ? "not-allowed" : "pointer",
              }}
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
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
            border: "2px dashed grey",
            borderRadius: "10px",
            boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
            "&:hover": { boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)" },
          }}
          onClick={() => setOpenModal(true)}
        >
          <Typography
            variant="h4"
            component="h1"
            style={{ cursor: "pointer", marginBottom: "3px", color: "grey" }}
          >
            Añadir
          </Typography>
          <Typography
            variant="h6"
            component="h5"
            style={{ cursor: "pointer", marginBottom: "15px", color: "grey" }}
          >
            {denominacion}
          </Typography>
          <AddIcon sx={{ fontSize: "70px", color: "grey" }} color="action" />
        </Card>
      </div>
    );
  }
};
