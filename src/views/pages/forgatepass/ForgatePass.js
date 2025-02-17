import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
    CRow
} from '@coreui/react'
import axios from "axios";

import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'
import Swal from 'sweetalert2'
import { Eye, EyeOff } from "lucide-react"; // ✅ Lucide icons import
import { port } from "../../../port.js";
console.log(port, "port000000000000");
const ForgatePassword = () => {


    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [id, setId] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setId(params.get("id"));
    }, []);



    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError("Passwords do not match!")
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long!")
            return
        }

        try {
            const response = await axios.post(`${port}reset_password`, {
                password,
                id: id
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response
            if (response.data.status === 200) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Password reset successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 4000,
                }).then(() => {
                    window.location.replace('/#/login');
                })
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: response.data.error,
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                })
            }
        } catch (error) {
            setError("Failed to reset password, please try again!")
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
                                    <CForm onSubmit={handleSubmit}>
                                        <h3 className="text-center">Reset Password</h3>
                                        <p className="text-body-secondary text-center">Enter a new password</p>

                                        {error && <p className="text-danger text-center">{error}</p>}

                                        {/* Password Input */}
                                        <CInputGroup className="mb-2">
                                            <CInputGroupText>
                                                <CIcon icon={cilLockLocked} />
                                            </CInputGroupText>
                                            <CFormInput
                                                type={showPassword ? "text" : "password"}
                                                placeholder="New Password"
                                                autoComplete="new-password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                            <CInputGroupText onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </CInputGroupText>
                                        </CInputGroup>

                                        {/* Confirm Password Input */}
                                        <CInputGroup className="mb-2">
                                            <CInputGroupText>
                                                <CIcon icon={cilLockLocked} />
                                            </CInputGroupText>
                                            <CFormInput
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Confirm Password"
                                                autoComplete="new-password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                            <CInputGroupText onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ cursor: "pointer" }}>
                                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </CInputGroupText>
                                        </CInputGroup>

                                        <CRow className="justify-content-center">
                                            <CCol xs={4} className="d-flex justify-content-center">
                                                <CButton color="primary" className="px-6" type="submit">
                                                    Reset
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
        </div>
    )
}

export default ForgatePassword
