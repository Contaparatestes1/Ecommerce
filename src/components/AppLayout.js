import React, { useState } from "react";
import CustomAppBar from "./CustomAppBar";
import CustomCartDrawer from "./CustomCartDrawer";
import CustomMenuDrawer from "./CustomMenuDrawer";

const AppLayout = ({
  cartTotal,
  updateQuantity,
  removeFromCart,
  cartItems,
  setCartItems,
}) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCartIconClick = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleMenuIconClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <React.Fragment>
      <CustomAppBar
        cartTotal={cartTotal}
        handleMenuIconClick={handleMenuIconClick}
        handleCartIconClick={handleCartIconClick}
      />

      <CustomCartDrawer
        isCartOpen={isCartOpen}
        handleCartIconClick={handleCartIconClick}
        cartItems={cartItems}
        setCartItems={setCartItems}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />

      <CustomMenuDrawer
        isMenuOpen={isMenuOpen}
        handleMenuIconClick={handleMenuIconClick}
      />
    </React.Fragment>
  );
};

export default AppLayout;
