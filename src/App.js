import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import './scss/examples.scss'
import { use } from 'react'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const ForgatePassword = React.lazy(() => import('./views/pages/forgatepass/ForgatePass'))

const App = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)
  const storedToken = localStorage.getItem('token')
  const storedRole = localStorage.getItem('role')


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-d

  useEffect(() => {
    if (!storedToken || !storedRole) {
      if(!window.location.href.includes('/#/')) {
        window.location.href = '/#/login'
      }
      if (location.pathname.includes('#/reset') || location.pathname.includes('/reset')) {
        navigate('/reset')
      } else {
        navigate('/login')
      }
    } else if (storedToken && storedRole === 'ADMIN') {
      if (location.pathname == '/') {
        navigate('/admin/dashboard')
      }
      if (location.pathname.includes('login')) {
        navigate('/admin/dashboard')
      }

      if(!window.location.href.includes('/#/')) {
        window.location.href = '/#/admin/dashboard'
      }

    }
  }, [storedToken, storedRole, location.pathname])

  return (
    <Suspense
      fallback={
        <div className="pt-3 text-center">
          <CSpinner color="primary" variant="grow" />
        </div>
      }
    >
      <Routes>
        <Route path="/login" name="Login Page" element={<Login />} />
        <Route path="/register" name="Register Page" element={<Register />} />
        <Route path="/reset" name="Forgate Password Page" element={<ForgatePassword />} />
        <Route path="/reset/:id" name="Forgate Password Page" element={<ForgatePassword />} />

        <Route path="/" name="Login Page" element={<Login />} />
        <Route path="/500" name="Page 500" element={<Page500 />} />
        <Route path="/admin/*" element={storedRole === 'ADMIN' ? <DefaultLayout /> : <Login />} />
      </Routes>
    </Suspense>
  )
}

export default App
