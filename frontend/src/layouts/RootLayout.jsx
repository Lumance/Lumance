import React from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const RootLayout = () => {
  return (
    <div className='min-h-screen min-w-full bg-[#0E0C15]'>
        <Navbar />
        <Outlet />
    </div>
  )
}

export default RootLayout