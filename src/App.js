import React from 'react'
import { AuthProvider } from './context/UseContext'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import PrivateRoute from './components/PrivateRoute'
import Dashboard from './pages/dashboard/Dashboard'
import OauthCallback from './components/OauthCallback'
import Error from './pages/Error'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/oauth/callback' element={<OauthCallback />} />
          <Route path='/error' element={<Error />} />

          {/* ✅ Fix typo in path: "dashbard" → "dashboard" */}
          <Route
            path='/dashboard'
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* 404 fallback route */}
          <Route
            path='*'
            element={
              <div className='bg-black min-h-screen text-green-500 flex items-center justify-center text-xl font-mono'>
                ❌ 404 - Page Not Found
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
