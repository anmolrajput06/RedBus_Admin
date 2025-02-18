import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTable } from "react-table";
import ReactPaginate from "react-paginate";
import StatusToggle from "./Toggle";
import { X } from "lucide-react";
import { debounce } from "lodash";
import { FaEye } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { port } from "../../../port.js";
console.log(port, "port000000000000");
const Tables = () => {
  console.log("Tables");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [modalVisible, setModalVisible] = useState(false);
  const [customerId, setCustomerId] = useState(null);

  const [dateRange, setDateRange] = useState([null, null]);
  const [fromDate, toDate] = dateRange;

  const handleViewDetails = (id) => {
    setCustomerId(id);
    setModalVisible(true);
  };

  const fetchData = debounce(async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${port}customer_list`, {
        // const response = await axios.post(`https://newpenal.pandpinfotech.com/backend/getall/clients`, {

        limit: itemsPerPage,
        page: currentPage,
        globlesearch: searchTerm,
        fromDate,
        toDate,
      });

      console.log(response.data.pagination.total, "----------");

      setData(response.data.data || []);
      setTotalCount(response.data.pagination.total);
      setTotalPages(Math.ceil(response.data.pagination.total / itemsPerPage));


      // setData(response.data.data || []);
      // setTotalCount(response.data.customer_count);
      // setTotalPages(Math.ceil(response.data.customer_count / itemsPerPage));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, 500);

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
          <StatusToggle rowId={row.original.id} initialStatus={row.original.status} />
        )
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
    <div className="container">
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
            style={{ flex: 1 }} // To allow DatePicker to take the available space
          />

          <div>
            <select
              className="form-select d-inline w-auto"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              style={{ width: 'auto', display: 'inline-block' }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          <table {...getTableProps()} className="table table-bordered">
            <thead className="table-dark">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()} key={column.id}>{column.render("Header")}</th>
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
    </div>
  );
};

export default Tables;
