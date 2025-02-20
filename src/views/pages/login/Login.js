import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import Swal from 'sweetalert2'
import axios from "axios";
import withReactContent from 'sweetalert2-react-content'
import { Eye, EyeOff } from "lucide-react";
import { port } from "../../../port.js";

const MySwal = withReactContent(Swal)

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [visible, setVisible] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      setForgotError("Please enter your email");
      return;
    }

    try {
      const response = await axios.post(`${port}forgotPassword`, {
        email: forgotEmail,
      });

      if (response.data.status === 409) {
        setErrorMsg("Email not registered!");
        setErrorModal(true);
      } else if (response.data.status === 200) {
        setSuccessMsg("Email sent successfully! ✅");
        setForgotEmail("");
        setForgotError("");
      }
    } catch (error) {
      setForgotError("Failed to send email. Try again!");
      console.error("Error:", error);
    }
  };


  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`${port}admin_login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })


      const data = await response.json()
      if (data.status == 409) {

        MySwal.fire({
          title: 'Error!',
          text: data.msg,
          icon: 'error',
          confirmButtonText: 'Try Again',
          timer: 2000,
        }).then(() => {
          navigate('/#/login')
        })
      }
      if (data.status === 200) {

        localStorage.setItem('token', data.token)
        localStorage.setItem('role', 'ADMIN')

        MySwal.fire({
          title: 'Login Success!',
          text: data.msg,
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 2000,
        }).then(() => {
          navigate('/admin/dashboard')
        })


      } else {
        MySwal.fire({
          title: 'Error!',
          text: data.msg,
          icon: 'error',
          confirmButtonText: 'Try Again',
        })
      }
    } catch (error) {
      console.error('Error updating status:', error)

      MySwal.fire({
        title: 'Error!',
        text: 'Failed to Login',
        icon: 'error',
        confirmButtonText: 'Try Again',
      })
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1 style={{ textAlign: 'center' }}>Login</h1>
                    <p className="text-body-secondary" style={{ textAlign: 'center' }}>
                      Sign In to your account
                    </p>
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-2">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="password"
                        autoComplete="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <CInputGroupText onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ cursor: "pointer" }}>
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </CInputGroupText>
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-1" onClick={() => {
                          setVisible(true);
                          setSuccessMsg('');
                        }}>
                          Forgot password?
                        </CButton>
                      </CCol>
                      <CCol xs={12} className="text-center">
                        <CButton color="primary" className="px-4" type="submit">
                          Login
                        </CButton>
                      </CCol>

                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>

      <CModal
        visible={visible}
        onClose={() => {
          setVisible(false);
          setSuccessMsg("");
          setForgotEmail("");
          setForgotError("");
        }}
      >
        <CModalHeader>Forgot Password</CModalHeader>
        <CModalBody>
          {successMsg ? (
            <p style={{ color: "green", textAlign: "center", fontSize: "16px", fontWeight: "bold" }}>
              {successMsg}
            </p>
          ) : (
            <>
              <p>Enter your email to reset password:</p>
              <CFormInput
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
              {forgotError && <p style={{ color: "red", textAlign: "center" }}>{forgotError}</p>}
            </>
          )}
        </CModalBody>
        <CModalFooter>
          {!successMsg && (
            <CButton color="primary" onClick={handleForgotPassword}>Send Reset Link</CButton>
          )}
          <CButton color="secondary" onClick={() => {
            setVisible(false);
            setSuccessMsg("");
            setForgotEmail("");
            setForgotError("");
          }}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal visible={errorModal} onClose={() => setErrorModal(false)}>
        <CModalHeader className="bg-danger text-white">Error</CModalHeader>
        <CModalBody>
          <p style={{ color: "red", textAlign: "center", fontSize: "16px", fontWeight: "bold" }}>
            {errorMsg}
          </p>
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={() => setErrorModal(false)}>Close</CButton>
        </CModalFooter>
      </CModal>

    </div>
  )
}

export default Login
