import { useState } from "react";
import Switch from "react-switch";
import axios from "axios";
import Swal from "sweetalert2";
import { port } from "../../../port.js";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const StatusToggle = ({ rowId, initialStatus }) => {
  const [checked, setChecked] = useState(initialStatus === "active");

  const handleChange = async (nextChecked) => {
    try {
      const newStatus = nextChecked ? "active" : "inactive";


      const response = await axios.post(`${port}update_status`, {
        userId: rowId,
        status: newStatus,
      });

      setChecked(nextChecked);

      MySwal.fire({
        title: "Status Updated!",
        text: response.data.msg,
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error updating status:", error);

      MySwal.fire({
        title: "Error!",
        text: "Failed to update status",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div>
      <Switch
        onChange={handleChange}
        checked={checked}
        onColor="#4F46E5"
        offColor="#D1D5DB"
        uncheckedIcon={false}
        checkedIcon={false}
      />
    </div>
  );
};

export default StatusToggle;
