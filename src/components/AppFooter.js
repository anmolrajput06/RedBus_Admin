import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>

        <span className="ms-1">&copy; {new Date().getFullYear()} REDBUS.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="gamecrio.com" target="_blank" rel="noopener noreferrer">
          REDBUS &amp; Dashboard
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
