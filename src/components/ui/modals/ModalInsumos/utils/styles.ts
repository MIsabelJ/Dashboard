import { darken, lighten, styled } from "@mui/material/styles";

export const GroupHeader = styled("div")(({ theme }) => ({
  position: "relative",
  top: "-8px",
  padding: "4px 10px",
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === "light"
      ? lighten(theme.palette.primary.light, 0.85)
      : darken(theme.palette.primary.main, 0.8),
}));

export const GroupItems = styled("ul")({
  padding: 0,
});
