// Συνάρτηση που προσθέτει δύο δεκαδικά ψηφία στον αριθμό
export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2); // Στρογγυλοποίηση και μορφοποίηση με 2 δεκαδικά
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

// Συνάρτηση που ενημερώνει την κατάσταση (state) του καλαθιού
export const updateCart = (state) => {
  // Υπολογισμός συνολικής τιμής αντικειμένων (ποσότητα * τιμή για κάθε προϊόν)
  const itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // Υπολογισμός κόστους αποστολής — δωρεάν για παραγγελίες άνω των 50€, αλλιώς 10€
  const shippingPrice = itemsPrice > 50 ? 0 : 10;

  // Υπολογισμός ΦΠΑ (24%)
  const taxPrice = 0.24 * itemsPrice;

  // Υπολογισμός συνολικού ποσού
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // Ενημέρωση του state με μορφοποιημένες τιμές (2 δεκαδικά)
  state.itemsPrice = addDecimals(itemsPrice);
  state.shippingPrice = addDecimals(shippingPrice);
  state.taxPrice = addDecimals(taxPrice);
  state.totalPrice = addDecimals(totalPrice);

  // Αποθήκευση του καλαθιού στο τοπικό αποθηκευτικό χώρο του browser
  localStorage.setItem("cart", JSON.stringify(state));

  // Επιστροφή της ενημερωμένης κατάστασης
  return state;
};
