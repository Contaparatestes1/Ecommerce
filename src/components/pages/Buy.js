import React, { useState } from "react";
import { Container } from "@mui/material";
import ProductList from "../ProductList";
import CustomAppBar from "../CustomAppBar";
import AppLayout from "../AppLayout";

const calculateTotalProducts = (cartItems) => {
  const uniqueProducts = new Set(cartItems.map((item) => item.id));
  return uniqueProducts.size;
};

const Buy = () => {
  const [cartItems, setCartItems] = useState([]);
  const cartTotal = calculateTotalProducts(cartItems);

  const addToCart = (product) => {
    const itemInCart = cartItems.find((item) => item.id === product.id);
    if (itemInCart) {
      setCartItems((prevCartItems) =>
        prevCartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        )
      );
    } else {
      setCartItems((prevCartItems) => [...prevCartItems, { ...product }]);
    }
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item.id !== productId));
  };

  return (
    <React.Fragment>
      <CustomAppBar cartTotal={cartTotal} />

      <AppLayout
        cartTotal={cartTotal}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />

      <Container maxWidth="lg" sx={{ padding: "24px", marginTop: "64px" }}>
        <ProductList addToCart={addToCart} />
      </Container>
    </React.Fragment>
  );
};

export default Buy;
