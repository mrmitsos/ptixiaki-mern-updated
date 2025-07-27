export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

/* 

First code that updated below

export const updateCart = (state) => {
  // calculate items price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // calculate shipping price, if over 50 free shipping, else 3
  state.shippingPrice = addDecimals(state.itemsPrice > 50 ? 0 : 10);

  // calculate tac price, 24%
  state.taxPrice = addDecimals(Number((0.24 * state.itemsPrice).toFixed(2)));

  // calculate total price
  state.totalPrice =
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice).toFixed(2);

  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};

*/

export const updateCart = (state) => {
  const itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const shippingPrice = itemsPrice > 50 ? 0 : 10;
  const taxPrice = 0.24 * itemsPrice;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  state.itemsPrice = addDecimals(itemsPrice);
  state.shippingPrice = addDecimals(shippingPrice);
  state.taxPrice = addDecimals(taxPrice);
  state.totalPrice = addDecimals(totalPrice);

  localStorage.setItem("cart", JSON.stringify(state));
  return state;
};
