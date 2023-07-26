import React from "react";
import {
  Drawer,
  Container,
  List,
  ListItem,
  ListItemText,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";

const CustomMenuDrawer = ({ isMenuOpen, handleMenuIconClick }) => {
  const isMobile = useMediaQuery("(max-width:500px)");

  return (
    <Drawer
      anchor="left"
      open={isMenuOpen}
      onClose={() => handleMenuIconClick()}
    >
      <Container sx={{ width: isMobile ? "100vw" : 250, padding: "8px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            marginBottom: "16px",
          }}
        >
          <IconButton color="inherit" onClick={handleMenuIconClick}>
            <CloseIcon />
          </IconButton>
        </div>
        <List>
          <ListItem button component={Link} to="/">
            <ListItemText primary="Home" />
          </ListItem>

          <ListItem button component={Link} to="/pedidos">
            <ListItemText primary="Pedidos" />
          </ListItem>
        </List>
      </Container>
    </Drawer>
  );
};

export default CustomMenuDrawer;
