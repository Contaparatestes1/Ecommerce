import React, { useEffect, useState } from "react";
import AppLayout from "../AppLayout";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";

const Orders = ({ updateQuantity, removeFromCart, cartTotal }) => {
  const [cartItems, setCartItems] = useState([]);
  const [ordersData, setOrdersData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/Pedidos");
        setOrdersData(response.data);
      } catch (error) {
        console.error("Erro ao buscar os pedidos:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <React.Fragment>
      <AppLayout
        cartTotal={cartTotal}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "70px",
          paddingTop: "70px",
          width: "100%",
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h5" sx={{ paddingBottom: "30px" }}>
            Pedidos Realizados
          </Typography>
          {ordersData.map((order) => (
            <Accordion key={order.id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{order.id}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {Object.entries(order.itensDoPedido).map(
                    ([productName, item]) => (
                      <React.Fragment key={item.productId}>
                        <List>
                          <ListItem>
                            <ListItemText primary={`Produto: ${productName}`} />
                          </ListItem>

                          <ListItem>
                            <ListItemText
                              secondary={`Description: ${item.description}`}
                            />
                          </ListItem>

                          <ListItem>
                            <ListItemText
                              secondary={`Preço: R$ ${item.price.toFixed(2)}`}
                            />
                          </ListItem>

                          <ListItem>
                            <ListItemText
                              secondary={`Quantidade: ${item.quantity} `}
                            />
                          </ListItem>

                          <ListItem>
                            <ListItemText
                              secondary={`Subtotal: ${item.subtotal}`}
                            />
                          </ListItem>
                        </List>
                        <Divider />
                      </React.Fragment>
                    )
                  )}
                  <ListItem>
                    <ListItemText
                      primary="Total"
                      secondary={`R$ ${order.valorTotal.toFixed(2)}`}
                    />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Orders;
