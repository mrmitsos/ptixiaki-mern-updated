// Συνάρτηση για στρογγυλοποίηση αριθμού σε 2 δεκαδικά ψηφία και μορφοποίησή του ως string
function addDecimals(num) {
  return (Math.round(num * 100) / 100).toFixed(2); // Στρογγυλοποίηση και μορφοποίηση με 2 δεκαδικά
}

// Συνάρτηση που υπολογίζει τις τιμές μιας παραγγελίας
export function calcPrices(orderItems) {
  // Υπολογισμός συνολικής τιμής των προϊόντων (τιμή * ποσότητα) με στρογγυλοποίηση
  const itemsPrice = addDecimals(
    orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // Υπολογισμός κόστους αποστολής: δωρεάν αν τα προϊόντα είναι πάνω από 100, αλλιώς 10
  const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10);

  // Υπολογισμός φόρου 15% επί της τιμής των προϊόντων, στρογγυλοποιημένος
  const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));

  // Υπολογισμός συνολικής τιμής: προϊόντα + αποστολή + φόρος
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  // Επιστροφή των υπολογισμένων τιμών σε ένα αντικείμενο
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
}
