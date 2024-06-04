import React from "react";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import {
  Collapse,
  FormControl,
  InputLabel,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  useTheme,
} from "@mui/material";
import { DrawerHeader } from "./StyledComponents";
import { dashboardItems } from "./DashboardItems";
import { AccountCircle } from "@mui/icons-material";
import { ISucursal } from "../../../types/Sucursal/ISucursal";

const drawerWidth = 240;

const Sidebar = ({
  open,
  handleDrawerClose,
  handleSubMenuClick,
  openSubMenu,
  sucursalSelected,
  sucursales,
  handleChangeSucursal,
  empresa,
  navigate,
}: any) => {
  const theme = useTheme();

  return (
    <Drawer
      style={{ zIndex: 100 }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      {/* <DrawerHeader>
        <IconButton onClick={handleDrawerClose} style={{ alignSelf: "center" }}>
          {theme.direction === "ltr" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader> */}
      <h5 style={{ padding: "15px", marginBottom: "0" }}>{empresa ? empresa.nombre : ""}</h5>
      <Divider />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "0px",
        }}
      >
        <IconButton aria-label="user" color="primary">
          <AccountCircle fontSize="large" />
        </IconButton>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-select-small-label">Sucursal</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={sucursales ? Number(sucursalSelected) : ""}
            label="Branch"
            onChange={(event) => handleChangeSucursal(event)}
          >
            {sucursales &&
              sucursales?.map((sucursal: ISucursal, index: number) => (
                <MenuItem key={index} value={sucursal.id}>
                  {sucursal.nombre}
                </MenuItem>
              ))}
          </Select>

        </FormControl>
      </div>
      <Divider />
      <List>
        {dashboardItems.list.map(({ text, icon, subItems, route }, index) => (
          <div key={index}>
            <ListItem
              onClick={() => {
                if (subItems) {
                  handleSubMenuClick(text);
                } else {
                  navigate(`/${route}`);
                }
              }}
              disablePadding
            >
              <ListItemButton>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
                {subItems &&
                  (openSubMenu[text] ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </ListItem>
            {subItems && (
              <Collapse in={openSubMenu[text]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {subItems.map((subItem, subIndex) => (
                    <ListItem
                      key={`${index}-${subIndex}`}
                      onClick={() => navigate(`/${subItem.route}`)}
                      disablePadding
                      sx={{ pl: 4 }}
                    >
                      <ListItemButton>
                        <ListItemIcon>{subItem.icon}</ListItemIcon>
                        <ListItemText primary={subItem.text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </div>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
