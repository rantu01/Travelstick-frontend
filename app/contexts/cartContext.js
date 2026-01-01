// @ts-nocheck
'use client';
import { createContext, use, useContext, useEffect } from 'react';
import { notification } from 'antd';
import { deleteCart, fetchCart, fetchCartCalculation, postCart } from '../helper/backend';
import { useAction, useActionConfirm, useFetch } from '../helper/hooks';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, getCart] = useFetch(fetchCart);
  const [calculatedPrice, getCalculatedPrice] = useFetch(fetchCartCalculation);

  const addItem =  (_id, qty, type) => {
    let payload = { product: _id, quantity: qty }
    useAction(postCart, { body: payload },()=>{
      getCart();
      getCalculatedPrice();
    });
  };
  const removeItem = (id) => {
  let payload = { _id: id }; // Fix: _id matches what deleteCart expects

  useActionConfirm(
    deleteCart,
    payload,
    () => {
      getCart();
      getCalculatedPrice();
    },
    'Are you sure you want to remove this item from cart?',
    'Yes, Delete'
  );
};


  return (
    <CartContext.Provider
      value={{
        cart,
        getCart,
        addItem,
        calculatedPrice,
        getCalculatedPrice,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
