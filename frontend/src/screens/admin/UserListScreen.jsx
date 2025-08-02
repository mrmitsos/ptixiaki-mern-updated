import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { FaTimes, FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../slices/usersApiSlice";
import { toast } from "react-toastify";

const UserListScreen = () => {
  // Παίρνουμε τη λίστα των χρηστών από το backend μέσω του hook useGetUsersQuery
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  // Hook για διαγραφή χρήστη
  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  // Συνάρτηση που διαχειρίζεται τη διαγραφή χρήστη με επιβεβαίωση
  const deleteHandler = async (id) => {
    if (window.confirm("Είσαι σίγουρος/η;")) {
      try {
        await deleteUser(id).unwrap();
        toast.success("Ο χρήστης διαγράφηκε επιτυχώς");
        refetch(); // Ανανεώνουμε τη λίστα μετά τη διαγραφή
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  return (
    <>
      <h1>Χρήστες</h1>

      {/* Εμφάνιση loader όταν φορτώνει ή διαγράφει */}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        // Αν υπάρχει σφάλμα κατά τη φόρτωση, το εμφανίζουμε
        <Message variant="danger">{error}</Message>
      ) : (
        // Εμφάνιση των χρηστών σε έναν πίνακα
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>ΟΝΟΜΑ</th>
              <th>EMAIL</th>
              <th>ΔΙΑΧΕΙΡΙΣΤΗΣ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* Κάθε χρήστης αντιστοιχίζεται σε μία γραμμή */}
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  {/* Κάνοντας κλικ στο email ανοίγει το mail client */}
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {/* Αν είναι διαχειριστής εμφανίζουμε πράσινο τικ, αλλιώς κόκκινο Χ */}
                  {user.isAdmin ? (
                    <FaCheck style={{ color: "green" }} />
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td>
                  {/* Κουμπί επεξεργασίας που πηγαίνει στη σελίδα επεξεργασίας χρήστη */}
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <FaEdit />
                    </Button>
                  </LinkContainer>

                  {/* Κουμπί διαγραφής που καλεί τη deleteHandler */}
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(user._id)}
                  >
                    <FaTrash style={{ color: "white" }} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserListScreen;
