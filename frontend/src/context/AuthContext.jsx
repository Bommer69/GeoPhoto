import { createContext, useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

/**
 * AuthProvider Component
 * Provides authentication state and methods to child components
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
    setLoading(false)
  }, [])

  /**
   * Login user
   */
  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password)
      setUser({
        id: response.id,
        username: response.username,
        email: response.email,
        fullName: response.fullName
      })
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Đăng nhập thất bại!' 
      }
    }
  }

  /**
   * Register new user
   */
  const register = async (username, email, password, fullName) => {
    try {
      await authService.register(username, email, password, fullName)
      return { success: true }
    } catch (error) {
      console.error('Register error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Đăng ký thất bại!' 
      }
    }
  }

  /**
   * Logout user
   */
  const logout = () => {
    authService.logout()
    setUser(null)
  }

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = () => {
    return !!user && authService.isAuthenticated()
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}

/**
 * useAuth Hook
 * Custom hook to access auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
