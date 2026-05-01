import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, test, expect, vi } from 'vitest'
import Login from '../auth/Login'

// Mock firebase
vi.mock('../config/firebase', () => ({
  auth: {},
  googleProvider: {}
}))

vi.mock('firebase/auth', () => ({
  signInWithPopup: vi.fn()
}))

const renderLogin = () => render(
  <BrowserRouter>
    <Login />
  </BrowserRouter>
)

describe('Login Page — Unit Tests', () => {

  test('renders Welcome Back heading', () => {
    renderLogin()
    expect(screen.getByText('Welcome Back')).toBeInTheDocument()
  })

  test('renders Customer, Provider and Admin tabs', () => {
    renderLogin()
    expect(screen.getByText('Customer')).toBeInTheDocument()
    expect(screen.getByText('Provider')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  test('renders email and password inputs', () => {
    renderLogin()
    expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  })

  test('shows Google button when Customer tab is selected', () => {
    renderLogin()
    expect(screen.getByText('Continue with Google')).toBeInTheDocument()
  })

  test('hides Google button when Provider tab is selected', () => {
    renderLogin()
    fireEvent.click(screen.getByText('Provider'))
    expect(screen.queryByText('Continue with Google')).not.toBeInTheDocument()
  })

  test('shows error when submitting empty form', async () => {
    renderLogin()
    fireEvent.click(screen.getByText('Sign In to Your Account'))
    expect(await screen.findByText('Please fill in all fields')).toBeInTheDocument()
  })

  test('shows admin hint when Admin tab selected', () => {
    renderLogin()
    fireEvent.click(screen.getByText('Admin'))
    expect(screen.getByText(/Admin access only/i)).toBeInTheDocument()
  })

})