import React from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Button, Card } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useDeliverOrderMutation,
} from "../slices/ordersApiSlice";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const OrderScreen = () => {
  // Παίρνουμε το orderId από τα URL params
  const { id: orderId } = useParams();

  // Καλούμε το API για να πάρουμε τα στοιχεία της παραγγελίας
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  // Mutation για πληρωμή παραγγελίας
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  // Mutation για σήμανση παραγγελίας ως παραδοθείσας
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  // PayPal script state
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  // Καλούμε το API για να πάρουμε το PayPal client ID
  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPaypal,
  } = useGetPaypalClientIdQuery();

  // Παίρνουμε τα στοιχεία χρήστη από το store
  const { userInfo } = useSelector((state) => state.auth);

  // useEffect για φόρτωση του PayPal script μόλις έχουμε client ID
  useEffect(() => {
    if (!errorPaypal && !loadingPayPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPaypal]);

  // Συνάρτηση που καλείται όταν η πληρωμή εγκριθεί επιτυχώς
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details }).unwrap();
        refetch(); // Ενημέρωση δεδομένων παραγγελίας
        toast.success("Η πληρωμή ολοκληρώθηκε με επιτυχία");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }

  // Συνάρτηση δοκιμαστικής πληρωμής (χωρίς πραγματική συναλλαγή)
  async function onApproveTest() {
    await payOrder({ orderId, details: { payer: {} } });
    refetch();
    toast.success("Η πληρωμή ολοκληρώθηκε με επιτυχία");
  }

  // Συνάρτηση για χειρισμό σφαλμάτων πληρωμής
  function onError(error) {
    toast.error(error.message);
  }

  // Δημιουργία παραγγελίας PayPal
  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  // Χειρισμός σήμανσης παραγγελίας ως παραδοθείσας από τον admin
  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Η παραγγελία παραδόθηκε");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  // Render component ανάλογα με κατάσταση φόρτωσης ή σφάλματος
  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error.data.message || error.error}</Message>
  ) : (
    <>
      <h1>Παραγγελία {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            {/* Πληροφορίες αποστολής */}
            <ListGroup.Item>
              <h2>Αποστολή</h2>
              <p>
                <strong>Όνομα: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                {order.user.email}
              </p>
              <p>
                <strong>Διεύθυνση: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Παραδόθηκε στις {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Δεν έχει παραδοθεί</Message>
              )}
            </ListGroup.Item>

            {/* Πληροφορίες πληρωμής */}
            <ListGroup.Item>
              <h2>Τρόπος Πληρωμής</h2>
              <p>
                <strong>Μέθοδος:</strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">
                  Πληρώθηκε στις {order.paidAt}
                </Message>
              ) : (
                <Message variant="danger">Δεν έχει πληρωθεί</Message>
              )}
            </ListGroup.Item>

            {/* Προϊόντα παραγγελίας */}
            <ListGroup.Item>
              <h2>Προϊόντα Παραγγελίας</h2>
              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={1}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={4}>
                      {item.qty} x ${item.price} = ${item.qty * item.price}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* Περίληψη Παραγγελίας και Ενέργειες */}
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Περίληψη Παραγγελίας</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Προϊόντα</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
                <Row>
                  <Col>Αποστολή</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
                <Row>
                  <Col>Φόρος</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
                <Row>
                  <Col>Σύνολο</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {/* --- ΠΛΗΡΩΜΗ --- */}
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      <Button
                        onClick={onApproveTest}
                        style={{ marginBottom: "10px" }}
                      >
                        Δοκιμαστική Πληρωμή
                      </Button>
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        />
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}

              {/* --- ΣΗΜΑΝΣΗ ΩΣ ΠΑΡΑΔΟΘΕΝ --- */}
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverOrderHandler}
                    >
                      Σήμανση ως Παραδοθέν
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
