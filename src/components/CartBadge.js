import React from "react";
import { Badge, IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const CartBadge = ({ cartTotal, handleCartIconClick }) => {
  return (
    <IconButton color="inherit" onClick={handleCartIconClick}>
      <Badge badgeContent={cartTotal} color="secondary">
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  );
};

export default CartBadge;
