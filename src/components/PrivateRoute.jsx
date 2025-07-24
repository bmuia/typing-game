import React from 'react'
import { useAuth } from '../context/UseContext'
import { Navigate } from 'react-router-dom'

function PrivateRoute({children }) {

    const { isAuthenticated } = useAuth()

    return isAuthenticated ? children : <Navigate to='/' replace />
}

export default PrivateRoute