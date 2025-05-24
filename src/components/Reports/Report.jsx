import React from 'react'
import Dashheader from '../Dashboard/Dashheader/Dashheader'
import { useNavigate } from 'react-router-dom'
 
const Reports = () => {
  const navigate = useNavigate()

  return (
    <>
      <Dashheader />
<div style={{ 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  minHeight: '100vh', 
  width: '100%'
}}>
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    gap: '2rem'
  }}>
    {/* Booked Flat Report Card */}
    <div
      style={{ 
        width: '18rem', 
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(235,148,19,0.25), 0 2px 8px rgba(0,0,0,0.10)',
        transition: 'transform 0.3s cubic-bezier(.4,2,.6,1), box-shadow 0.3s cubic-bezier(.4,2,.6,1)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '2px solid rgb(235, 148, 19)',
        textAlign: 'center',
        background: '#fff',
      }}
      onClick={() => navigate('/reports/bookedflatreport')}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.03)';
        e.currentTarget.style.boxShadow = '0 0 24px 4px rgba(235,148,19,0.45), 0 6px 16px rgba(0,0,0,0.15)';
        e.currentTarget.style.borderColor = '#ffb300';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(235,148,19,0.25), 0 2px 8px rgba(0,0,0,0.10)';
        e.currentTarget.style.borderColor = 'rgb(235, 148, 19)';
      }}
    >
      <div style={{ padding: '1.5rem' }}>
        <h5 style={{ fontWeight: '600', color: '#333', marginBottom: '1rem' }}>Booked Flat History</h5>
        <p style={{ color: '#666' }}>All Booked Flat Reports & Invoices.</p>
      </div>
    </div>
    
    {/* Flat Details Report Card */}
    <div 
      style={{ 
        width: '18rem', 
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(235,148,19,0.25), 0 2px 8px rgba(0,0,0,0.10)',
        transition: 'transform 0.3s cubic-bezier(.4,2,.6,1), box-shadow 0.3s cubic-bezier(.4,2,.6,1)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '2px solid rgb(235, 148, 19)',
        textAlign: 'center',
        background: '#fff',
      }}
      onClick={() => navigate('/reports/paymentHistory')}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.03)';
        e.currentTarget.style.boxShadow = '0 0 24px 4px rgba(235,148,19,0.45), 0 6px 16px rgba(0,0,0,0.15)';
        e.currentTarget.style.borderColor = '#ffb300';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(235,148,19,0.25), 0 2px 8px rgba(0,0,0,0.10)';
        e.currentTarget.style.borderColor = 'rgb(235, 148, 19)';
      }}
    >
      <div style={{ padding: '1.5rem' }}>
        <h3 style={{ fontWeight: '600', color: '#333', marginBottom: '1rem' }}>Payment History</h3>
        <p style={{ color: '#666' }}>View Invoices and Reports of Payment History.</p>
      </div>
    </div>
  </div>
</div>
    </>
  )
}

export default Reports