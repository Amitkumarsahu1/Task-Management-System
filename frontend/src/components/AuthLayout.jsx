import React from "react"

const AuthLayout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-full md:w-1/2 overflow-y-auto">
        <div className="min-h-full flex flex-col px-12 pt-8 pb-12">
          <div className="flex-grow flex items-center justify-center">
            {children}
          </div>
        </div>
      </div>

      <div className="hidden md:block w-1/2">
        <img
          src="banner.jpg"
          alt="Login background"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  )
}

export default AuthLayout
