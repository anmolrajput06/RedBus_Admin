import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom' // Import useNavigate
import { CRow, CCol, CWidgetStatsA } from '@coreui/react'
import axios from "axios";
import { port } from "../../port.js";
const WidgetsDropdown = (props) => {
  const [totalCustomers, setTotalCustomers] = useState(0)
  const navigate = useNavigate() // Initialize navigate hook

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.post(`${port}customer_list`)
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
    <CRow
      className={props.className}
      xs={{ gutter: 4 }}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <CCol sm={3} xl={3} xxl={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CWidgetStatsA
          color="primary"
          value={totalCustomers}
          title="Total Customers"
          onClick={handleRedirect} // Box Clickable
          style={{ cursor: 'pointer', textAlign: 'center' }}
        />
      </CCol>
    </CRow>

  )
}

export default WidgetsDropdown
