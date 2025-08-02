import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Paginate = ({ pages, page, isAdmin = false, keyword = "" }) => {
  return (
    // Εμφανίζουμε το pagination μόνο αν έχουμε πάνω από μία σελίδα
    pages > 1 && (
      <Pagination>
        {/* Δημιουργούμε έναν πίνακα από τους αριθμούς των σελίδων */}
        {[...Array(pages).keys()].map((x) => (
          // LinkContainer για να κάνουμε κάθε αριθμό σελίδας clickable και να οδηγεί στην αντίστοιχη σελίδα
          <LinkContainer
            key={x + 1}
            to={
              // Αν δεν είναι admin
              !isAdmin
                ? // Αν υπάρχει keyword, πάμε στη σελίδα με αναζήτηση
                  keyword
                  ? `/search/${keyword}/page/${x + 1}`
                  : // Αν δεν υπάρχει keyword, πάμε απλά στη σελίδα
                    `/page/${x + 1}`
                : // Αν είναι admin, πλοηγούμαστε στη λίστα προϊόντων με pagination
                  `/admin/productlist/${x + 1}`
            }
          >
            {/* Εμφανίζουμε τον αριθμό σελίδας και τον κάνουμε ενεργό αν είναι η τρέχουσα σελίδα */}
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
