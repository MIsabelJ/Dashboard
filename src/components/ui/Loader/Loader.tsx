import React from "react";
import { CircularProgress } from "@mui/material";

export const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        gap: "2vh",
        marginTop: "30px",
      }}
    >
      <CircularProgress color="secondary" />
      <h2 style={{ fontSize: "20px" }}>Cargando...</h2>
    </div>
  );
};
