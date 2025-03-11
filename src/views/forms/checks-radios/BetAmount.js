import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTable } from "react-table";
import ReactPaginate from "react-paginate";
import { X } from "lucide-react";
import { FaEdit, FaTrash } from "react-icons/fa";
import DatePicker from "react-datepicker";
import Swal from 'sweetalert2'
import { CFormInput, CButton, CFormLabel, CFormCheck, CFormSelect } from "@coreui/react";
import "react-datepicker/dist/react-datepicker.css";
import { port } from "../../../port.js";
import withReactContent from 'sweetalert2-react-content'
import { CSpinner } from '@coreui/react'


const MySwal = withReactContent(Swal)
const today = new Date();

const BetAmount = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const [missionData, setMissionData] = useState({
        BetAmount: "",
        spinCount: "",
        isBetAmount: false,
        isTimesSymbol: false,
        BetAmount: "",
        betAmount: "",
        symbol: ""
    });
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [modalVisibleadd, setModalVisibleadd] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [dateRange, setDateRange] = useState([null, null]);
    const [fromDate, toDate] = dateRange;
    const [errors, setErrors] = useState({});




    const handleInputChangeNumber = (field, value) => {
        if (!/^\d*\.?\d*$/.test(value)) return;

        if (value.length > 10) return;

        let floatValue = parseFloat(value);

        if (floatValue === 0) {
            setErrors((prev) => ({
                ...prev,
                [field]: "Bet amount must be greater than 0",
            }));
        } else {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }

        // if (value === ".") {
        //     setErrors((prev) => ({
        //         ...prev,
        //         [field]: "Invalid number format",
        //     }));
        //     setFormData((prev) => ({
        //         ...prev,
        //         [field]: "",
        //     }));
        //     return;
        // }


        if (value.includes(".")) {
            let [integerPart, decimalPart] = value.split(".");
            decimalPart = decimalPart.slice(0, 2);
            value = `${integerPart}.${decimalPart}`;
        }

        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const initialFormState = {
        isBetAmount: false,
        isTimesSymbol: false,
        isBetAmount_value: "",
        isTimesSymbol_value: "",
        BetAmount: "",
        betAmount: "",
        spinCount: "",
        BetAmount: "",
        symbol: ""
    };
    const [formData, setFormData] = useState(initialFormState);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (errorsupdate.BetAmount || !missionData.BetAmount) {
            setErrorsupdate((prev) => ({
                ...prev,
                BetAmount: missionData.BetAmount ? errorsupdate.BetAmount : "Bet Amount is required",
            }));
            return;
        }
        setLoading(true);


        let newErrors = {};


        if (!missionData.BetAmount) {
            newErrors.BetAmount = "Bet Amount Amount is required";
        }


        if (Object.keys(newErrors).length > 0) {
            setErrorsupdate(newErrors);
            return;
        }
        try {
            const response = await axios.post(`${port}update_bet_amount_data`, {
                missionid: missionData.id,
                BetAmount: missionData.BetAmount,


            });

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

        if (errors.BetAmount) {
            return;
        }

        setLoading(true);

        try {
            let newErrors = {};


            if (!formData.BetAmount) {
                newErrors.BetAmount = "Bet Amount is required";
            }

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
            const requestData = {
                BetAmount: formData.BetAmount,

            };

            const response = await axios.post(`${port}add_bet_amount`, requestData);

            if (response.data.status === 200) {
                Swal.fire({
                    title: 'Bet Amount Added!',
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
            const response = await axios.post(`${port}get_bet_amount_list`, {
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
                const response = await axios.post(`${port}delete_bet_amount_data`, {
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

    const handleOpenModal = () => {
        setFormData({
            BetAmount: "",
            spinCount: "",
            BetAmount: "",
            symbol: "",
            isBetAmount: false,
            isTimesSymbol: false,
        });

        setErrors({});
        setModalVisibleadd(true);
    };

    // const columns = React.useMemo(
    //     () => [
    //         {
    //             Header: "S.No",
    //             accessor: "serial",
    //             Cell: ({ row }) => (currentPage - 1) * itemsPerPage + row.index + 1
    //         },
    //         { Header: "Bet Amount", accessor: "BetAmount" },
    //         {
    //             Header: "Created At",
    //             accessor: "createdAt",
    //             Cell: ({ value }) => {
    //                 const date = new Date(value);
    //                 return date.toLocaleDateString("en-GB", {
    //                     day: "2-digit",
    //                     month: "short",
    //                     year: "2-digit",
    //                 }).replace(",", "");
    //             },
    //         },
    //         {
    //             Header: "Action",
    //             accessor: "action",
    //             Cell: ({ row }) => (
    //                 <div style={{ display: 'flex', gap: '10px' }}>
    //                     {/* Edit button */}
    //                     <button
    //                         onClick={() => handleEdit(row.original)}
    //                         style={{
    //                             background: "none",
    //                             border: "none",
    //                             cursor: "pointer",
    //                             color: "#6261cc",
    //                         }}
    //                     >
    //                         <FaEdit size={18} />
    //                     </button>

    //                     {/* Delete button */}
    //                     <button
    //                         onClick={() => handleDelete(row.original.id)} // Call delete function
    //                         style={{
    //                             background: "none",
    //                             border: "none",
    //                             cursor: "pointer",
    //                             color: "#6261cc",
    //                         }}
    //                     >
    //                         <FaTrash size={18} />
    //                     </button>
    //                 </div>
    //             ),
    //         },
    //     ],
    //     [currentPage, itemsPerPage]
    // );


    const columns = React.useMemo(
        () => [
            {
                Header: "S.No",
                accessor: "serial",
                Cell: ({ row }) => (currentPage - 1) * itemsPerPage + row.index + 1
            },
            { Header: "Bet Amount", accessor: "BetAmount" },
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
                Cell: ({ row, data }) => (
                    <div style={{ display: 'flex', gap: '10px' }}>
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

                        {data.length > 2 && (
                            <button
                                onClick={() => handleDelete(row.original.id)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#6261cc",
                                }}
                            >
                                <FaTrash size={18} />
                            </button>
                        )}
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
            const response = await axios.post(`${port}get_bet_amount_data`, {
                id: rowData.id,
            });

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
            const isChecked = !prev[field];
            return {
                ...prev,
                [field]: isChecked,
                [`${field}_value`]: isChecked ? prev[`${field}_value`] : "",
                ...(field === "isTimesSymbol" && !isChecked ? { symbol: "" } : {}),
            };
        });
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [field]: value.trim() === "" ? `${getFieldLabel(field)} is required` : "",
        }));
    };



    const getFieldLabel = (field) => {
        const labels = {
            BetAmount: "Bet Amount",
        };
        return labels[field] || "This field";
    };

    useEffect(() => {
        if (modalVisibleadd) {
            setFormData(initialFormState);
        }
    }, [modalVisibleadd]);

    const [errorsupdate, setErrorsupdate] = useState({});



    const handleNumberChange = (field, value) => {
        if (!/^\d*\.?\d*$/.test(value)) return;

        if (value.length > 10) return;

        let floatValue = parseFloat(value);

        if (floatValue === 0) {
            setErrorsupdate((prev) => ({
                ...prev,
                [field]: "Bet amount must be greater than 0",
            }));
        } else {
            setErrorsupdate((prev) => ({
                ...prev,
                [field]: "",
            }));
        }

        if (value.includes(".")) {
            let [integerPart, decimalPart] = value.split(".");
            decimalPart = decimalPart.slice(0, 2);
            value = `${integerPart}.${decimalPart}`;
        }

        setMissionData((prev) => ({ ...prev, [field]: value }));

        if (value === "") {
            setErrorsupdate((prev) => ({
                ...prev,
                [field]: `${field === "BetAmount" ? "Bet Amount" : "Spin Count"} is required`,
            }));
        }
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
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>

                            <option value="50">50</option>
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={handleOpenModal}>
                        Add Bet Amount
                    </button>

                </div>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center">
                    <CSpinner color="primary" />
                </div>) : (
                <>
                    <table {...getTableProps()} className="table table-bordered">
                        <thead className="table-dark">
                            {headerGroups.map((headerGroup, index) => (
                                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id || index}>
                                    {headerGroup.headers.map((column) => (
                                        <th {...column.getHeaderProps()} key={column.id || index}>
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
                                <h5 className="modal-title" style={{ margin: 0 }}>Edit Bet Amount Data</h5>
                                <button type="button" className="close" onClick={() => setModalVisible(false)} style={{ marginLeft: "auto" }}>
                                    <span>&times;</span>
                                </button>
                            </div>

                            <div className="modal-body">
                                <form onSubmit={handleFormSubmit} className="space-y-4">



                                    <div className="mb-3">
                                        <CFormLabel htmlFor="BetAmount">Bet Amount</CFormLabel>
                                        <CFormInput
                                            id="BetAmount"
                                            type="text"
                                            value={missionData.BetAmount}
                                            onChange={(e) => handleNumberChange("BetAmount", e.target.value)}
                                        />
                                        {errorsupdate.BetAmount && (
                                            <p className="text-danger small mt-1">{errorsupdate.BetAmount}</p>
                                        )}
                                    </div>



                                    <div className="modal-footer">
                                        <CButton type="button" color="secondary" onClick={() => setModalVisible(false)}>
                                            Close
                                        </CButton>
                                        <CButton type="submit" color="primary" disabled={loading}>
                                            {loading ? "Saving..." : "Save Changes"}
                                        </CButton>
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
                                <h5 className="modal-title" style={{ margin: 0 }}>Add New Bet Amount</h5>
                                <button type="button" className="close" onClick={() => setModalVisibleadd(false)} style={{ marginLeft: "auto" }}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleAddMissionSubmit} className="space-y-4">



                                    <div className="mb-3">
                                        <CFormLabel htmlFor="BetAmount">Bet Amount</CFormLabel>
                                        <CFormInput
                                            id="BetAmount"
                                            type="text"
                                            value={formData.BetAmount || ""}
                                            onChange={(e) => handleInputChangeNumber("BetAmount", e.target.value)}
                                        />
                                        {errors.BetAmount && (
                                            <p className="text-danger small mt-1">{errors.BetAmount}</p>
                                        )}

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

export default BetAmount;
