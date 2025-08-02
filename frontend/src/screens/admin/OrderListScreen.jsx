import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetOrdersQuery } from "../../slices/ordersApiSlice";

const OrderListScreen = () => {
  // Παίρνουμε τη λίστα των παραγγελιών από το backend μέσω του hook useGetOrdersQuery
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <>
      <h1>Παραγγελίες</h1>

      {/* Εμφάνιση loader κατά τη φόρτωση */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        // Εμφάνιση μηνύματος λάθους αν υπάρχει πρόβλημα
        <Message variant="danger">{error}</Message>
      ) : (
        // Πίνακας με τις παραγγελίες
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>ΧΡΗΣΤΗΣ</th>
              <th>ΗΜΕΡΟΜΗΝΙΑ</th>
              <th>ΣΥΝΟΛΟ</th>
              <th>ΠΛΗΡΩΜΗ</th>
              <th>ΠΑΡΑΔΟΣΗ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* Για κάθε παραγγελία μία γραμμή με τα στοιχεία */}
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>{" "}
                {/* Μόνο η ημερομηνία */}
                <td>{order.totalPrice}</td>
                {/* Εμφάνιση ημερομηνίας πληρωμής ή κόκκινο Χ αν δεν πληρώθηκε */}
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                {/* Εμφάνιση ημερομηνίας παράδοσης ή κόκκινο Χ αν δεν παραδόθηκε */}
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                {/* Κουμπί για να δει λεπτομέρειες της παραγγελίας */}
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant="light" className="btn-sm">
                      Λεπτομέρειες
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;
