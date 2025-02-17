import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { port } from "../../port.js";
console.log(port, "port000000000000");
const MySwal = withReactContent(Swal);
const DailyWheel = () => {
  const defaultData = {
    1: "0", 2: "0", 3: "0", 4: "0", 5: "0",
    6: "0", 7: "0", 8: "0", 9: "0", 10: "0",
    11: "0", 12: "0", 13: "0", 14: "0", 15: "0",
    16: "0", 17: "0", 18: "0"
  };

  const [wheelData, setWheelData] = useState(defaultData);
  const [loading, setLoading] = useState(true);

  // Fetch Data from API on Component Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${port}dailywheeldata`, {
          headers: { "Accept": "application/json" },
        });
        const result = response

        if (result.status === 200 && result.data) {
          console.log(result.data.data, "apiData");
          const apiData = result.data.data[0].dailyWheelData;
          const
            formattedData = Object.keys(apiData).reduce((acc, key) => {
              acc[key.replace("value", "")] = apiData[key];
              return acc;
            }, {});

          setWheelData(formattedData);
        } else {
          setWheelData(defaultData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setWheelData(defaultData);
      } finally {
        setLoading(false);
      }
    };


    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*\.?\d*$/.test(value)) {
      setWheelData({ ...wheelData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert keys to match API format (value1, value2, ...)
    const formattedData = Object.keys(wheelData).reduce((acc, key) => {
      acc[`value${key}`] = wheelData[key];
      return acc;
    }, {});

    try {
      const response = await fetch(`${port}update_dailywheeldata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();
      console.log(result.status == 200, "0-0-0-0-", result);

      if (result.status == 200) {
        MySwal.fire({
          title: "Updated!",
          text: result.msg,
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        MySwal.fire({
          title: "Error!",
          text: "Failed to update",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      MySwal.fire({
        title: "Error!",
        text: "Failed to update",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  const entries = Object.entries(wheelData);
  const half = Math.ceil(entries.length / 2);
  const firstHalf = entries.slice(0, half);
  const secondHalf = entries.slice(half);

  if (loading) return <p className="text-center p-4">Loading data...</p>;

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded-md">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border p-4 text-left w-1/4">S.No</th>
              <th className="border p-4 text-left w-1/4">Value</th>
              <th className="border p-4 text-left w-1/4"></th>
              <th className="border p-4 text-left w-1/4">S.No</th>
              <th className="border p-4 text-left w-1/4">Value</th>
            </tr>
          </thead>
          <tbody>
            {firstHalf.map(([key1, value1], index) => {
              const [key2, value2] = secondHalf[index] || ["", ""];
              return (
                <tr key={key1}>
                  <td className="border p-4 font-semibold text-left">{key1}</td>
                  <td className="border p-4 text-left">
                    <input
                      type="text"
                      name={key1}
                      value={value1}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="border p-4"></td>
                  <td className="border p-4 font-semibold text-left">{key2}</td>
                  <td className="border p-4 text-left">
                    {key2 && (
                      <input
                        type="text"
                        name={key2}
                        value={value2}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button
          type="submit"
          style={{ marginLeft: "40%" }}
          className="mt-4 px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-800"
        >
          Update Data
        </button>

      </form>
    </div>
  );
};

export default DailyWheel;
