import { element } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Signin = React.lazy(() => import('./views/admin/Login'))
const Report = React.lazy(() => import('./views/report/Report'))
const Charts = React.lazy(() => import('./views/charts/Charts'))

const routes = [
  
  { path: '/login', name: 'Login', element: Signin },
  { path: '/admin/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/admin/tables', name: 'User List', element: Tables },
  { path: '/admin/dailywheel', name: 'Daily Wheel', element: Charts },
  { path: '/admin/report', name: 'Report', element: Report },
  { path: '/admin/notification', name: 'Notification', element: Report }



]

export default routes
