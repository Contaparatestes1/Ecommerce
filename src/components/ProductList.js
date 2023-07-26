import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  IconButton,
  Input,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import myImage from "./assets/espresso.png";
import myImage2 from "./assets/maracujá.png";

const products = [
  {
    id: "Produto1",
    name: "Café espresso",
    description: "Café cremoso feito na temperatura e pressões perfeitas.",
    price: 10.99,
    image: myImage,
  },
  {
    id: "Produto2",
    name: "Suco de maracujá",
    description: "Suco de maracujá gelado, cremoso, docinho.",
    price: 15.99,
    image: myImage2,
  },
];

const ProductList = ({ addToCart }) => {
  const [quantities, setQuantities] = useState({});
  const [disabledButtons, setDisabledButtons] = useState({});

  useEffect(() => {
    const initialQuantities = JSON.parse(
      localStorage.getItem("productQuantities")
    );
    if (initialQuantities) {
      setQuantities(initialQuantities);
    } else {
      const initialQuantities = {};
      for (const product of products) {
        initialQuantities[product.id] = 0;
      }
      setQuantities(initialQuantities);
    }
  }, []);

  useEffect(() => {
    const updatedDisabledButtons = {};
    for (const productId in quantities) {
      const quantity = quantities[productId];
      updatedDisabledButtons[productId] = quantity <= 0;
    }
    setDisabledButtons(updatedDisabledButtons);
  }, [quantities]);

  const handleQuantityChange = (productId, value) => {
    setQuantities((prevQuantities) => {
      const parsedValue = parseInt(value);
      const updatedQuantities = {
        ...prevQuantities,
        [productId]: isNaN(parsedValue) ? 0 : parsedValue,
      };
      return updatedQuantities;
    });
  };

  useEffect(() => {
    localStorage.setItem("productQuantities", JSON.stringify(quantities));
  }, [quantities]);

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 0;
    if (quantity > 0) {
      addToCart({ ...product, quantity });
    }
  };

  const handleDecrease = (productId) => {
    const currentValue = quantities[productId] || 0;
    const newValue = Math.max(currentValue - 1, 0);
    handleQuantityChange(productId, newValue);
  };

  const handleIncrease = (productId) => {
    const currentValue = quantities[productId] || 0;
    const newValue = Math.min(currentValue + 1, 100);
    handleQuantityChange(productId, newValue);
  };

  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item key={product.id} xs={12} sm={6} md={4}>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px",
              border: "1px solid #c4c4c4",
            }}
          >
            <CardMedia
              component="img"
              height="150"
              src={product.image}
              alt={product.name}
              sx={{ width: "62%", height: "50%", objectFit: "contain" }}
            />
            <CardContent
              sx={{
                flexGrow: 1,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              <Typography gutterBottom variant="h6">
                {product.name}
              </Typography>
              <Typography variant="body1">{product.description}</Typography>
              <Typography variant="body2" color="text.secondary">
                R$ {product.price.toFixed(2)}
              </Typography>
            </CardContent>
            <Grid
              container
              spacing={1}
              sx={{
                width: "100%",
                justifyContent: "center",
                padding: "5px 0px 8px",
              }}
            >
              <Grid item>
                <IconButton
                  aria-label="decrease"
                  onClick={() => handleDecrease(product.id)}
                  disabled={quantities[product.id] <= 0}
                >
                  <RemoveIcon />
                </IconButton>
                <Input
                  type="text"
                  value={
                    quantities[product.id] !== undefined
                      ? quantities[product.id]
                      : 0
                  }
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (!isNaN(newValue)) {
                      handleQuantityChange(product.id, parseInt(newValue));
                    }
                  }}
                  inputProps={{
                    style: {
                      textAlign: "center",
                      width: "80px",
                      appearance: "none",
                      MozAppearance: "textfield",
                      paddingRight: "1px",
                      border: "1px solid #C4C4C4",
                      borderRadius: "4px",
                      outline: "none",
                    },
                  }}
                />
                <IconButton
                  aria-label="increase"
                  onClick={() => handleIncrease(product.id)}
                >
                  <AddIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => handleAddToCart(product)}
                  variant="contained"
                  disabled={disabledButtons[product.id]}
                >
                  Incluir
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList;
