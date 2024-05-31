import React from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import { AppBar } from "./StyledComponents";

const Navbar = ({
  open,
  handleDrawerOpen,
  sectionName,
}: {
  open: boolean;
  handleDrawerOpen: () => void;
  sectionName: string;
}) => {
  return (
    <AppBar position="fixed" open={open}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{ mr: 2, ...(open && { display: "none" }) }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          {sectionName}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
