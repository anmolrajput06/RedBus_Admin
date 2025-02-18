import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTable } from "react-table";
import ReactPaginate from "react-paginate";
import StatusToggle from "../../base/tables/Toggle.js";
import { X } from "lucide-react";
import { debounce } from "lodash";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import the Trash icon for delete
import DatePicker from "react-datepicker";
import Swal from 'sweetalert2'

import "react-datepicker/dist/react-datepicker.css";
import { port } from "../../../port.js";
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
const today = new Date(); // Get today's date

const ChecksRadios = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [missionData, setMissionData] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [modalVisibleadd, setModalVisibleadd] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [dateRange, setDateRange] = useState([null, null]);
  const [fromDate, toDate] = dateRange;


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log(missionData, "missionData");
      const response = await axios.post(`${port}update_mission_data`, {
        missionid: missionData.id,
        heading: missionData.heading,
        spinCount: missionData.spinCount,
        betAmount: missionData.betAmount,
        prizeAmount: missionData.prizeAmount,
      });
      console.log(response.data.status == 200, "response.data");

      if (response.data.status == 200) {

        MySwal.fire({
          title: 'Updated Success!',
          text: response.data.msg,
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 2000,
        }).then(() => {
          setModalVisible(false);
          fetchData();
        })
      } else {
        MySwal.fire({
          title: 'Error!',
          text: response.data.msg,
          icon: 'error',
          confirmButtonText: 'Try Again',
        })
      }
    } catch (error) {
      console.error("Error updating mission data:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleAddMissionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:7000/add_mission', {
        heading: missionData.heading,
        isSpinCount: true,
        spinCount: missionData.spinCount,
        isBetAmount: true,
        betAmount: missionData.betAmount,
        isTimesSymbol: true,
        symbol: 4,  // Set the symbol and timesSymbol if required
        timesSymbol: 4,
        prizeAmount: missionData.prizeAmount,
      });

      if (response.data.status === 200) {
        Swal.fire({
          title: 'Mission Added!',
          text: response.data.msg,
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 2000,
        }).then(() => {
          setModalVisibleadd(false);
          fetchData();  // Refresh the mission list
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.data.msg,
          icon: 'error',
          confirmButtonText: 'Try Again',
        });
      }
    } catch (error) {
      console.error("Error adding mission:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${port}get_mission_list`, {
        limit: itemsPerPage,
        page: currentPage,
        globlesearch: searchTerm,
        fromDate,
        toDate,
      });

      setData(response.data.missionData || []);
      setTotalCount(response.data.missionDataCount);
      setTotalPages(Math.ceil(response.data.missionDataCount / itemsPerPage));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
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
  const handleDelete = async (missionid) => {
    // Show confirmation modal using SweetAlert
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(`${port}delete_mission_data`, {
          missionid: missionid,
        });

        if (response.data.status == 200) {
          Swal.fire(
            'Deleted!',
            response.data.msg,
            'success'
          );
          fetchData();
        } else {
          Swal.fire(
            'Error!',
            'Failed to delete the mission.',
            'error'
          );
        }
      } catch (error) {
        console.error("Error deleting mission:", error);
        Swal.fire(
          'Error!',
          'An error occurred while deleting the mission.',
          'error'
        );
      }
    }
  };


  const columns = React.useMemo(
    () => [
      {
        Header: "S.No",
        accessor: "serial",
        Cell: ({ row }) => (currentPage - 1) * itemsPerPage + row.index + 1
      },
      { Header: "Name", accessor: "heading" },
      { Header: "Spin Count", accessor: "spinCount" },
      { Header: "Bet Amount", accessor: "betAmount" },
      { Header: "Prize Amount", accessor: "prizeAmount" },
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
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <div style={{ display: 'flex', gap: '10px' }}>
            {/* Edit button */}
            <button
              onClick={() => handleEdit(row.original)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#6261cc",
              }}
            >
              <FaEdit size={18} />
            </button>

            {/* Delete button */}
            <button
              onClick={() => handleDelete(row.original.id)} // Call delete function
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#6261cc",
              }}
            >
              <FaTrash size={18} />
            </button>
          </div>
        ),
      },
    ],
    [currentPage, itemsPerPage]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const handleDateChange = (update) => {
    setDateRange(update);
    setCurrentPage(1);
  };

  const handleEdit = async (rowData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${port}get_mission_data`, {
        id: rowData.id,
      });
      console.log(response.data, "response.data");

      setMissionData(response.data.missionData);
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching mission details:", error);
    } finally {
      setLoading(false);
    }
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
                color: "#aaa",
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
            maxDate={today} // Disable dates after today
          />
          <div>
            <select
              className="form-select d-inline w-auto"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setModalVisibleadd(true)} 
          >
            Add Mission
          </button>
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
                    <th {...column.getHeaderProps()} key={column.id}>
                      {column.render("Header")}
                    </th>
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
                        <td {...cell.getCellProps()} key={cell.column.id}>
                          {cell.render("Cell")}
                        </td>
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
            </div>
          )}
        </>
      )}

      {modalVisible && missionData && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <h5 className="modal-title" style={{ margin: 0 }}>Edit Mission Data</h5>
                <button type="button" className="close" onClick={() => setModalVisible(false)} style={{ marginLeft: "auto" }}>
                  <span>&times;</span>
                </button>
              </div>

              <div className="modal-body">
                <form onSubmit={handleFormSubmit}>
                  <div className="form-group">
                    <label htmlFor="heading">Heading</label>
                    <input
                      type="text"
                      className="form-control"
                      id="heading"
                      value={missionData.heading}
                      onChange={(e) => setMissionData({ ...missionData, heading: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="spinCount">Spin Count</label>
                    <input
                      type="text"
                      className="form-control"
                      id="spinCount"
                      value={missionData.spinCount}
                      onChange={(e) => setMissionData({ ...missionData, spinCount: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="betAmount">Bet Amount</label>
                    <input
                      type="text"
                      className="form-control"
                      id="betAmount"
                      value={missionData.betAmount}
                      onChange={(e) => setMissionData({ ...missionData, betAmount: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="prizeAmount">Prize Amount</label>
                    <input
                      type="text"
                      className="form-control"
                      id="prizeAmount"
                      value={missionData.prizeAmount}
                      onChange={(e) => setMissionData({ ...missionData, prizeAmount: e.target.value })}
                    />
                  </div>
                  {/* Add other fields as needed */}

                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setModalVisible(false)}>
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">Save changes</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalVisibleadd && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
           

              <div className="modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <h5 className="modal-title" style={{ margin: 0 }}>Add New Mission</h5>
                <button type="button" className="close" onClick={() => setModalVisibleadd(false)} style={{ marginLeft: "auto" }}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddMissionSubmit}>
                  <div className="form-group">
                    <label htmlFor="heading">Heading</label>
                    <input
                      type="text"
                      className="form-control"
                      id="heading"
                      value={missionData?.heading || ''}
                      onChange={(e) => setMissionData({ ...missionData, heading: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="spinCount">Spin Count</label>
                    <input
                      type="number"
                      className="form-control"
                      id="spinCount"
                      value={missionData?.spinCount || ''}
                      onChange={(e) => setMissionData({ ...missionData, spinCount: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="betAmount">Bet Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      id="betAmount"
                      value={missionData?.betAmount || ''}
                      onChange={(e) => setMissionData({ ...missionData, betAmount: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="prizeAmount">Prize Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      id="prizeAmount"
                      value={missionData?.prizeAmount || ''}
                      onChange={(e) => setMissionData({ ...missionData, prizeAmount: e.target.value })}
                    />
                  </div>
                  {/* Add more fields as needed */}
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setModalVisibleadd(false)}>
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">Save Mission</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default ChecksRadios;
