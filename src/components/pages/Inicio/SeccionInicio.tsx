import * as React from "react";
import { useNavigate } from "react-router-dom";
// ---------- ESTILOS ----------
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  ChartOptions,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";
import "./inicio.css";

// ------------------------------ CÓDIGO ------------------------------
export const SeccionInicio = () => {
  // -------------------- GRÁFICOS --------------------
  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    LinearScale,
    CategoryScale,
    PointElement,
    LineElement,
    Title
  );

  const pieData = {
    labels: [
      "Lunes",
      "Martes",
      "Viernes",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ],
    datasets: [
      {
        label: "Esta semana",
        // Esto debería entrar dinámicamente
        data: [12, 19, 3, 5, 2, 3, 7],
        backgroundColor: [
          "rgb(235, 95, 26)",
          "rgb(245, 163, 22)",
          "rgb(255, 209, 23)",
          "rgb(102, 198, 222)",
          "rgb(53, 181, 232)",
          "rgb(66, 138, 201)",
          "rgb(42, 83, 161)",
        ],
        borderWidth: 0,
      },
    ],
  };
  const pieOptions = {
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: {
          padding: 20,
        },
      },
      tooltip: {
        titleFontSize: 16,
        bodyFontSize: 14,
      },
    },
  };

  const lineData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    //Los datos de los datasets deberían entrar dinámicamente
    datasets: [
      {
        label: "Sucursal 1",
        data: [65, 59, 80, 81, 56, 55, 40],
        yAxisID: "y-axis-1",
        borderColor: "rgb(235, 95, 26)",
        backgroundColor: "rgb(235, 95, 26)",
      },
      {
        label: "Sucursal 2",
        data: [28, 48, 40, 19, 86, 27, 90],
        yAxisID: "y-axis-1",
        borderColor: "rgb(245, 163, 22)",
        backgroundColor: "rgb(245, 163, 22)",
      },
      {
        label: "Sucursal 3",
        data: [52, 16, 44, 46, 51, 42, 96],
        yAxisID: "y-axis-1",
        borderColor: "rgb(255, 209, 23)",
        backgroundColor: "rgb(255, 209, 23)",
      },
    ],
  };

  const lineOptions = {
    type: "line",
    data: lineData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      stacked: false,
      plugins: {
        title: {
          display: true,
          text: "Ventas semanales",
          fontSize: 18,
          fontColor: "#333",
          padding: 20,
        },
      },
      scales: {
        x: {
          type: "category",
          display: true,
        },
        y: {
          type: "linear",
          display: true,
          position: "left",
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
        },
        y2: {
          type: "linear",
          display: true,
          position: "right",
        },
      },
    },
  };

  // -------------------- STATES --------------------
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(true);

  // -------------------- FUNCIONES --------------------
  const navigate = useNavigate();

  // -------------------- HARDCODED --------------------
  const productos = [
    {
      nombre: "Pizza Muzzarella",
      descripcion: "Clásica pizza de muzzarella",
    },
    {
      nombre: "Lomo Completo",
      descripcion:
        "Bifes de lomo, mayo casera, huevo, jamón, queso, tomate y lechuga",
    },
    {
      nombre: "Hamburguesa Clásica",
      descripcion:
        "Medallón de carne con queso mozzarella, lechuga, tomate, cebolla y papas",
    },
    {
      nombre: "Lomo Criollo",
      descripcion:
        "Bifes de lomo, mayo casera, huevo, jamón, queso y salsa criolla",
    },
    {
      nombre: "Pizza Napolitana",
      descripcion: "Pizza con rodajas de tomate y queso rallado",
    },
  ];

  // -------------------- RENDER --------------------
  return (
    <div id="seccion-inicio">
      <h2 style={{ fontSize: "22px", margin: "15px 0" }}>Resumen</h2>
      <div id="chart-container">
        <div className="charts box" style={{ width: "40vw" }}>
          <h2>Ventas por sucursal</h2>
          <Line data={lineData} options={lineOptions as ChartOptions<"line">} />
        </div>
        <div className="charts box" style={{ width: "25vw" }}>
          <h2>Ventas por semana</h2>
          <Pie data={pieData} options={pieOptions as ChartOptions<"pie">} />
        </div>
      </div>
      <div>
        <h2 style={{ fontSize: "22px", marginTop: "15px" }}>
          Productos más vendidos
        </h2>
        <List dense={dense}>
          {" "}
          {productos.map(({ nombre, descripcion }, index) => {
            return (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton
                    onClick={() => navigate("/inicio")} // Cambiar al modal correspondiente
                    edge="end"
                    aria-label="edit"
                  >
                    <ModeEditIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <ShoppingBagIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={nombre}
                  secondary={secondary ? descripcion : null}
                />
              </ListItem>
            );
          })}
        </List>
      </div>
    </div>
  );
};
