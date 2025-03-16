import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div>
      mainlayout
      <Outlet />
    </div>
  )
}

export default MainLayout
