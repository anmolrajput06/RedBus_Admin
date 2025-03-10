import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// Lazy-loaded components
const Dashboard = React.lazy(() => import('../views/dashboard/Dashboard'))
const Tables = React.lazy(() => import('../views/base/tables/Tables'))
const Report = React.lazy(() => import('../views/report/Report'))
const UserReport = React.lazy(() => import('../views/report/UserReport'))

const Charts = React.lazy(() => import('../views/charts/Charts'))
const ChecksRadios = React.lazy(() => import('../views/forms/checks-radios/ChecksRadios'))

const AppContent = () => {
  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tables" element={<Tables />} />
          <Route path="dailywheel" element={<Charts />} />
          <Route path="report" element={<Report />} />
          <Route path='mission' element={<ChecksRadios />} />
          <Route path="userreport/:id" element={<UserReport />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default AppContent
