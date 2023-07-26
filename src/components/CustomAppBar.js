import React from "react";
import { AppBar, Toolbar, IconButton, Typography, Badge } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const CustomAppBar = ({
  cartTotal,
  handleMenuIconClick,
  handleCartIconClick,
}) => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleMenuIconClick}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          E-commerce
        </Typography>
        <IconButton color="inherit" onClick={handleCartIconClick}>
          <Badge badgeContent={cartTotal} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
