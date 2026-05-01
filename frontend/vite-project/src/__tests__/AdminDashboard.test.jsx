import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import AdminDashboard from '../pages/AdminDashboard'

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      data: {
        adminStats: { totalUsers: 5, totalProviders: 3, totalJobs: 10, totalBids: 20 },
        adminAllProviders: [],
        adminAllUsers: [],
        adminAssignedJobs: []
      }
    })
  })
)

beforeEach(() => {
  localStorage.setItem('adminToken', 'test-token')
})

describe('Admin Dashboard — Unit Tests', () => {

  test('renders Dashboard Overview heading', async () => {
    render(<BrowserRouter><AdminDashboard /></BrowserRouter>)
    expect(screen.getByText('Dashboard Overview')).toBeInTheDocument()
  })

  test('renders all 4 stat cards', () => {
    render(<BrowserRouter><AdminDashboard /></BrowserRouter>)
    expect(screen.getByText('Total Customers')).toBeInTheDocument()
    expect(screen.getByText('Total Providers')).toBeInTheDocument()
    expect(screen.getByText('Total Jobs')).toBeInTheDocument()
    expect(screen.getByText('Total Bids')).toBeInTheDocument()
  })

  test('renders sidebar navigation links', () => {
    render(<BrowserRouter><AdminDashboard /></BrowserRouter>)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Providers')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
  })

  test('renders Recent Providers section', () => {
    render(<BrowserRouter><AdminDashboard /></BrowserRouter>)
    expect(screen.getByText('Recent Providers')).toBeInTheDocument()
  })

  test('renders Recent Customers section', () => {
    render(<BrowserRouter><AdminDashboard /></BrowserRouter>)
    expect(screen.getByText('Recent Customers')).toBeInTheDocument()
  })

})