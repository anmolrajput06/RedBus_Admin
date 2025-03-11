import { element } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Report = React.lazy(() => import('./views/report/Report'))
const UserReport = React.lazy(() => import('./views/report/UserReport'))

const Charts = React.lazy(() => import('./views/charts/Charts'))
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))

const BetAmount = React.lazy(() => import('./views/forms/checks-radios/BetAmount'))

const routes = [

  { path: '/admin/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/admin/tables', name: 'User List', element: Tables },
  { path: '/admin/dailywheel', name: 'Daily Wheel', element: Charts },
  { path: '/admin/report', name: 'Report', element: Report },
  { path: '/admin/userreport/:id', name: 'User Report', element: UserReport },

  { path: '/admin/notification', name: 'Notification', element: Report },
  { path: '/admin/mission', name: 'Mission', element: ChecksRadios },
  {
    path: '/admin/betamount', name: ' Bet Amount', element: BetAmount
  }



]

export default routes
