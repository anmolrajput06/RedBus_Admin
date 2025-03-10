import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTable } from "react-table";
import ReactPaginate from "react-paginate";
import StatusToggle from "./Toggle";
import { X } from "lucide-react";
import { FaEye } from "react-icons/fa";
import DatePicker from "react-datepicker";
import { BiSolidReport, BiSolidPencil } from "react-icons/bi";
import { BiSolidDollarCircle } from "react-icons/bi";

import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import { port } from "../../../port.js";
const today = new Date(); // Get today's date
import { CSpinner } from '@coreui/react'
const Tables = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [amount, setAmount] = useState("");

  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [modalVisible, setModalVisible] = useState(false);
  const [customerId, setCustomerId] = useState(null);

  const [dateRange, setDateRange] = useState([null, null]);
  const [fromDate, toDate] = dateRange;

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const handleViewDetails = (id) => {
    navigate(`/admin/userreport/${id}`); // Navigate to the new page with id
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${port}customer_list`, {

        limit: itemsPerPage,
        page: currentPage,
        globlesearch: searchTerm,
        fromDate,
        toDate,
      });


      // setData(response.data.data || []);
      // setTotalCount(response.data.pagination.total);
      // setTotalPages(Math.ceil(response.data.pagination.total / itemsPerPage));


      setData(response.data.cusromer || []);
      setTotalCount(response.data.customer_count);
      setTotalPages(Math.ceil(response.data.customer_count / itemsPerPage));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!modalVisible) {
      setAmount("");
    }
  }, [modalVisible]);
  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setModalVisible(true);
  };


  const handleBalanceUpdate = async (type) => {
    if (!selectedCustomer || !amount) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const response = await axios.post(`${port}update_balance`, {
        userid: selectedCustomer,
        amount,
        type,
      });

      if (response.data.status == "success") {
        // Success alert
        Swal.fire({
          title: "Success!",
          text: `Balance ${type} successful.`,
          icon: "success",
          confirmButtonText: "OK",
        });

        fetchData();
        setModalVisible(false);
      } else {
        Swal.fire({
          title: "Error!",
          text: response.data.msg,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error updating balance:", error);

      // Error alert
      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage, fromDate, toDate]);

  useEffect(() => {
    setCurrentPage(1);
    fetchData();
  }, [searchTerm]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "S.No",
        accessor: "serial",
        Cell: ({ row }) => (currentPage - 1) * itemsPerPage + row.index + 1
      },
      { Header: "Name", accessor: "name" },
      { Header: "Email", accessor: "email" },
      { Header: "Balance", accessor: "balance" },
      {
        Header: "Created At",
        accessor: "createdAt",
        Cell: ({ value }) => {
          const date = new Date(value);
          return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
          }).replace(",", "");
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => (
          <StatusToggle rowId={row.original.id} initialStatus={row.original.status}

          />

        )
      },
      {
        Header: "Action",
        Cell: ({ row }) => (
          <div style={{ display: "flex", gap: "10px" }}>
            <BiSolidReport
              onClick={() => handleViewDetails(row.original.id)}
              style={{ fontSize: "25px", cursor: "pointer" }}
              title="View Report"
            />
            <button
              onClick={() => handleEdit(row.original.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                // color: "#6261cc",
              }}
            >
              <BiSolidDollarCircle
                size={25} />
            </button>
          </div>
        ),
      }




    ],
    [currentPage, itemsPerPage]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });
  
  const handleDateChange = (update) => {
    setDateRange(update);
    setCurrentPage(1); // Reset page to 1 when the date range changes
  };
  return (
    <div className="container" style={{ marginBottom: "65px" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">

        <div style={{ position: "relative", width: "250px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <X
              size={20}
              className="position-absolute"
              style={{
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#aaa"
              }}
              onClick={clearSearch}
            />
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <DatePicker
            selectsRange={true}
            startDate={fromDate}
            endDate={toDate}
            onChange={handleDateChange}
            className="form-control"
            isClearable={true}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select date range"
            onKeyDown={(e) => e.preventDefault()}
            style={{ flex: 1 }}
            maxDate={today}
          />
          <div>
            <select className="form-select d-inline w-auto" value={itemsPerPage} onChange={handleItemsPerPageChange}>

              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

      </div>

      {loading ? (
        <div className="d-flex justify-content-center">
          <CSpinner color="primary" />
        </div>
      ) : (
        <>
          <table {...getTableProps()} className="table table-bordered">
            <thead className="table-dark">
              {headerGroups.map((headerGroup, index) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id || index}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()} key={column.id || index} >{column.render("Header")}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.length > 0 ? (
                rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} key={row.id}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()} key={cell.column.id}>{cell.render("Cell")}</td>
                      ))}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="position-relative mt-3">
              <ReactPaginate
                previousLabel={"← Pre"}
                nextLabel={"Next →"}
                breakLabel={"..."}
                pageCount={totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={"pagination justify-content-center"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                activeClassName={"active"}
                forcePage={currentPage - 1}
              />

              {/* <div className="position-absolute end-0 top-50 translate-middle-y">
                <strong>Showing {data.length} of {totalCount} records</strong>
              </div> */}
            </div>
          )}
        </>
      )}

      <Modal show={modalVisible} onHide={() => setModalVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>top up / redeem</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Balance</Form.Label>
            <Form.Control
              type="text"
              value={amount}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value) && value.length <= 10) {
                  setAmount(value);
                }
              }}
            />
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalVisible(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleBalanceUpdate("top up")}>
            Top Up
          </Button>
          <Button variant="primary" onClick={() => handleBalanceUpdate("redeem")}>
            Redeem
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Tables;
