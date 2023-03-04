import 'bootstrap/dist/css/bootstrap.min.css';  
import React from "react";
import { Pagination } from "react-bootstrap";

function PaginationComponent(props) {
  const { page, totalPages, size, totalRecords, onChangePage } = props;
  if(page && size && totalPages) {
    return (
      <Pagination>
        {page > 1 && <Pagination.Prev onClick={() => onChangePage(page - 1)} />}
        <Pagination.Item disabled={true}>{`${(page - 1) * size + 1} - ${
          page * size > totalRecords ? totalRecords : page * size
        } of ${totalRecords}`}</Pagination.Item>
        {page < totalPages && <Pagination.Next onClick={() => onChangePage(page + 1)} />}
      </Pagination>
    )
  }
  return null;
}

export default PaginationComponent;