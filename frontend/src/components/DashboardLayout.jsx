import React from "react"
import { useSelector } from "react-redux"
import Navbar from "./Navbar"
import SideMenu from "./SideMenu"

const DashboardLayout = ({ children, activeMenu }) => {
  const { currentUser } = useSelector((state) => state.user)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeMenu={activeMenu} />

      {currentUser && (
        <div className="flex flex-1 overflow-hidden">
          <div className="max-[1080px]:hidden">
            <SideMenu activeMenu={activeMenu} />
          </div>

          <div className="flex-1 ml-64 max-[1080px]:ml-0 overflow-y-auto">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardLayout