import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4 fixed-bottom">
      <div style={{ marginLeft: "240px" }}>
        <span>&copy; {new Date().getFullYear()} REDBUS.</span>
      </div>

      <div className="ms-auto">
        <span className="me-1">Powered by </span>
        <span style={{ color: "#6261cc", textDecoration: "underline", cursor: "pointer" }}>
          REDBUS
        </span>

      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
