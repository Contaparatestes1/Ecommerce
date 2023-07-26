import React from "react";
import { ListItemText, IconButton, Avatar, Paper, Grid } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const CartItem = ({ item, updateQuantity, removeFromCart }) => {
  const handleDecrease = () => {
    const newQuantity = item.quantity - 1;
    if (newQuantity > 0) {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleIncrease = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const itemPrice = (item.price * item.quantity).toFixed(2);

  return (
    <Paper
      sx={{
        padding: "10px",
        marginBottom: "20px",
        border: "1px solid #c4c4c4",
      }}
    >
      <Grid
        container
        spacing={1}
        sx={{
          display: "flex",
          flexWrap: "nowrap",
          justifyContent: "space-around",
        }}
      >
        <Grid item>
          <Avatar
            alt={item.name}
            src={item.image}
            sx={{ height: 100, width: 100 }}
          />
        </Grid>
        <Grid item xs={7}>
          <Grid item xs container direction="column" spacing={1}>
            <Grid item xs>
              <ListItemText
                primary={item.name}
                secondary={
                  <>
                    Quantidade: {item.quantity}
                    <br />
                    Valor Unitário: R$ {item.price.toFixed(2)}
                    <br />
                    Total: R$ {itemPrice}
                  </>
                }
              />
            </Grid>
            <Grid item xs>
              <Grid container alignItems="center" spacing={3}>
                <Grid item>
                  <IconButton
                    color="secondary"
                    edge="end"
                    aria-label="decrease"
                    onClick={handleDecrease}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton
                    color="primary"
                    edge="end"
                    aria-label="increase"
                    onClick={handleIncrease}
                  >
                    <AddIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton
                    color="error"
                    edge="end"
                    aria-label="remove"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CartItem;
