// Εναλλακτικά: χρησιμοποιήστε διαφορετική βάση URL ανάλογα με το περιβάλλον (ανάπτυξη ή παραγωγή)
// export const BASE_URL = process.env.NODE_ENV === "development" ? "http://localhost:5000" : "";

// Η βασική διεύθυνση URL του backend (παραμένει κενή γιατί χρησιμοποιείται σχετική διαδρομή)
export const BASE_URL = "";

// Διαδρομή για προϊόντα
export const PRODUCTS_URL = "/api/products";

// Διαδρομή για χρήστες
export const USERS_URL = "/api/users";

// Διαδρομή για παραγγελίες
export const ORDERS_URL = "/api/orders";

// Διαδρομή για ρύθμιση του PayPal client ID
export const PAYPAL_URL = "/api/config/paypal";

// Διαδρομή για αποστολή (upload) αρχείων
export const UPLOAD_URL = "/api/upload";
