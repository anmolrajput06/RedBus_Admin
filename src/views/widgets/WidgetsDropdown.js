import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom' // Import useNavigate
import { CRow, CCol, CWidgetStatsA } from '@coreui/react'
import axios from "axios";
import { port } from "../../port.js";
console.log(port, "port000000000000");
const WidgetsDropdown = (props) => {
  const [totalCustomers, setTotalCustomers] = useState(0)
  const navigate = useNavigate() // Initialize navigate hook

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.post(`${port}customer_list`)
        console.log(response.data.customer_count, "response");
        setTotalCustomers(response.data.customer_count)
      } catch (error) {
        console.error('Error fetching customer data:', error)
      }
    }

    fetchCustomers()
  }, [])

  // Function to handle click and navigate
  const handleRedirect = () => {
    navigate('/admin/tables') // Redirect to /base/tables
  }

  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      <CCol sm={3} xl={3} xxl={2}>
        <CWidgetStatsA
          color="primary"
          value={totalCustomers}
          title="Total Customers"
          onClick={handleRedirect} // Box Clickable
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
        />
      </CCol>
    </CRow>
  )
}

export default WidgetsDropdown
