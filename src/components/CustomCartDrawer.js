import React, { useEffect, useState } from "react";
import {
  Drawer,
  Container,
  List,
  IconButton,
  Typography,
  Grid,
  TextField,
  Button,
  useMediaQuery,
  Snackbar,
  Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CartItem from "../components/CartItem";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";

const CustomCartDrawer = ({
  isCartOpen,
  handleCartIconClick,
  updateQuantity,
  cartItems,
  setCartItems,
}) => {
  const isMobile = useMediaQuery("(max-width:500px)");
  const isCartEmpty = !Array.isArray(cartItems) || cartItems.length === 0;
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const cartSubtotal = Array.isArray(cartItems)
    ? cartItems.reduce(
        (subtotal, item) => subtotal + item.price * item.quantity,
        0
      )
    : 0;

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleRemoveFromCart = (itemId) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCartItems);

    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleBuy = async () => {
    if (isCartEmpty) {
      showSnackbar(
        "O carrinho está vazio. Adicione itens para comprar.",
        "error"
      );
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(userEmail)) {
      showSnackbar("Digite um email válido.", "error");
      return;
    }

    try {
      const carrinhoData = cartItems.reduce((acc, item) => {
        const productName = item.name;
        const subtotal = item.price * item.quantity;

        return {
          ...acc,
          [productName]: {
            productId: item.id,
            description: item.description,
            quantity: item.quantity,
            price: item.price,
            subtotal: subtotal,
          },
        };
      }, {});

      await axios.post(
        "http://localhost:8000/api/finalizar-compra",
        carrinhoData
      );

      const emailData = {
        email: userEmail,
        cartItems,
        cartSubtotal,
      };

      await axios.post(
        "http://localhost:8000/api/enviar-email-confirmacao",
        emailData
      );

      showSnackbar("Parabéns: Você comprou com sucesso.", "success");

      setCartItems([]);
      setUserEmail("");
    } catch (error) {
      console.error("Erro ao finalizar compra:", error);
      showSnackbar(
        "Erro ao finalizar a compra. Por favor, tente novamente.",
        "error"
      );
    }
  };

  return (
    <React.Fragment>
      <Drawer
        anchor="right"
        open={isCartOpen}
        onClose={() => handleCartIconClick()}
        sx={{}}
      >
        <Container
          sx={{
            width: isMobile ? "100vw" : 350,
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h5">Carrinho de Compras</Typography>
            <IconButton color="inherit" onClick={handleCartIconClick}>
              <CloseIcon />
            </IconButton>
          </div>
          {cartItems.length === 0 ? (
            <Typography variant="body1">Seu carrinho está vazio.</Typography>
          ) : (
            <List>
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeFromCart={() => handleRemoveFromCart(item.id)}
                />
              ))}
            </List>
          )}
          <Grid
            item
            sx={{
              alignSelf: "center",
              padding: "28px",
            }}
          >
            <form>
              <Typography variant="body2">
                Digite seu email, para finalizar a compra.
              </Typography>
              <TextField
                placeholder="Digite seu email"
                fullWidth
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </form>
          </Grid>

          <Grid
            item
            sx={{
              alignSelf: "flex-end",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              width: "100%",
            }}
          >
            <Typography variant="h6">
              Total: R${" "}
              {typeof cartSubtotal === "number"
                ? cartSubtotal.toFixed(2)
                : "0.00"}
            </Typography>

            <Button variant="contained" onClick={handleBuy}>
              Comprar
            </Button>
          </Grid>
        </Container>
      </Drawer>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={closeSnackbar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        TransitionComponent={Slide}
        TransitionProps={{
          direction: "right",
        }}
      >
        <MuiAlert onClose={closeSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </React.Fragment>
  );
};

export default CustomCartDrawer;
