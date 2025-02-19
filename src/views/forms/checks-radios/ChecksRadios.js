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
import { CFormInput, CButton, CFormLabel, CFormCheck, CFormSelect } from "@coreui/react";


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


  const initialFormState = {
    isBetAmount: false,
    isTimesSymbol: false,
    isBetAmount_value: "",
    isTimesSymbol_value: "",
    prizeAmount: "",
    betAmount: "",
    spinCount: "",
    heading: "",
    symbol: ""
  };

  const [formData, setFormData] = useState(initialFormState);

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
      const requestData = {
        heading: formData.heading,
        spinCount: formData.spinCount || 0,
        isBetAmount: formData.isBetAmount,
        betAmount: formData.isBetAmount ? formData.isBetAmount_value : 0,
        isTimesSymbol: formData.isTimesSymbol,
        symbol: formData.symbol || 0,
        timesSymbol: formData.isTimesSymbol ? formData.isTimesSymbol_value : 0,
        prizeAmount: formData.prizeAmount || 0,
      };

      const response = await axios.post(`${port}add_mission`, requestData);

      if (response.data.status === 200) {
        Swal.fire({
          title: 'Mission Added!',
          text: response.data.msg,
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 2000,
        }).then(() => {
          setModalVisibleadd(false);
          fetchData();  
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

  const handleCheckboxChange = (field) => {
    setFormData((prev) => {
      const isChecked = !prev[field]; // Get the updated checked state
      return {
        ...prev,
        [field]: isChecked,
        [`${field}_value`]: isChecked ? prev[`${field}_value`] : "", // Reset if unchecked
      };
    });
  };


  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  const handleInputChangeNumber = (field, value) => {
    if (/^\d*$/.test(value)) { // Allow only numbers
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };


  useEffect(() => {
    if (modalVisibleadd) {
      setFormData(initialFormState);
    }
  }, [modalVisibleadd]);

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
                <form onSubmit={handleAddMissionSubmit} className="space-y-4">
                  {["isBetAmount", "isTimesSymbol"].map((field) => (
                    <div key={field} className="mb-3">
                      <CFormCheck
                        id={field}
                        checked={formData[field]}
                        onChange={() => handleCheckboxChange(field)}
                        label={field.replace("_", " ")}
                      />
                      <CFormInput
                        id={`${field}_value`}
                        type="text"
                        disabled={!formData[field]}
                        value={formData[`${field}_value`] || ""}
                        onChange={(e) => handleInputChangeNumber(`${field}_value`, e.target.value)}
                      />
                    </div>
                  ))}

                  <div className="mb-3">
                    <CFormLabel htmlFor="prizeAmount">Prize Amount</CFormLabel>
                    <CFormInput
                      id="prizeAmount"
                      type="text"
                      value={formData.prizeAmount || ""}
                      onChange={(e) => handleInputChangeNumber("prizeAmount", e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <CFormLabel htmlFor="prizeAmount">Spin Count</CFormLabel>
                    <CFormInput
                      id="spinCount"
                      type="text"
                      value={formData.spinCount || ""}
                      onChange={(e) => handleInputChangeNumber("spinCount", e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <CFormLabel htmlFor="symbol">Symbol</CFormLabel>
                    <CFormSelect
                      id="symbol"
                      value={formData.symbol || ""}
                      onChange={(e) => handleInputChange("symbol", e.target.value)}
                    >
                      <option value="">Select a symbol</option>
                      <option value="1">Scatter</option>
                      <option value="2">Bus</option>
                      <option value="4">London Eye</option>
                      <option value="3">Taxi</option>
                      <option value="5">A</option>
                      <option value="6">K</option>
                      <option value="7">Q</option>
                      <option value="8">J</option>
                    </CFormSelect>
                  </div>

                  <div className="mb-3">
                    <CFormLabel htmlFor="heading">Mission Name</CFormLabel>
                    <CFormInput
                      id="heading"
                      type="text"
                      value={formData.heading || ""}
                      onChange={(e) => handleInputChange("heading", e.target.value)}
                    />
                  </div>

                  <CButton type="submit" color="primary" className="w-full" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                  </CButton>
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
