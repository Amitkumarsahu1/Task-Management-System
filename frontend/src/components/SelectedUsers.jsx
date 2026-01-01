import React, { useEffect, useState } from "react"
import axiosInstance from "../utils/axioInstance"
import { FaUsers } from "react-icons/fa"
import Modal from "./Modal"

const SelectedUsers = ({ selectedUser, setSelectedUser }) => {
  const [allUsers, setAllUsers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tempSelectedUser, setTempSelectedUser] = useState([])

  // Fetch users
  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get("/users/get-users")
      if (response.data?.length > 0) {
        setAllUsers(response.data)
      }
    } catch (error) {
      console.log("Error fetching users:", error)
    }
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  
  useEffect(() => {
    if (isModalOpen) {
      setTempSelectedUser(selectedUser)
    }
  }, [isModalOpen, selectedUser])

  const toggleUserSelection = (userId) => {
    setTempSelectedUser((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    )
  }

  const handleAssign = () => {
    setSelectedUser([...tempSelectedUser])
    setIsModalOpen(false)
  }

  // Avatar helpers
  const getInitials = (name) => {
    if (!name) return "U"
    const words = name.trim().split(" ")
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
    return (words[0][0] + words[words.length - 1][0]).toUpperCase()
  }

  const getAvatarColor = (name) => {
    if (!name) return "bg-blue-500"
    const colors = [
      "bg-blue-500",
      "bg-indigo-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-rose-500",
      "bg-orange-500",
      "bg-amber-500",
      "bg-emerald-500",
      "bg-teal-500",
      "bg-cyan-500",
    ]
    return colors[name.charCodeAt(0) % colors.length]
  }

  
  const selectedUsersData = allUsers.filter((user) =>
    selectedUser.includes(user._id)
  )

  return (
    <div className="space-y-4 mt-2">
      
      {selectedUsersData.length === 0 && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200 shadow-md"
          type="button"
        >
          <FaUsers className="text-lg" />
          Add Members
        </button>
      )}

      
      {selectedUsersData.length > 0 && (
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="flex -space-x-2">
            {selectedUsersData.slice(0, 3).map((user) =>
              user.profileImageUrl ? (
                <img
                  key={user._id}
                  src={user.profileImageUrl}
                  alt={user.name}
                  className="h-10 w-10 rounded-full border-2 border-white object-cover"
                />
              ) : (
                <div
                  key={user._id}
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold border-2 border-white ${getAvatarColor(
                    user.name
                  )}`}
                >
                  {getInitials(user.name)}
                </div>
              )
            )}
          </div>

          <span className="text-sm text-gray-600 font-medium">
            {selectedUsersData.length} member
            {selectedUsersData.length > 1 ? "s" : ""} selected
          </span>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select User"
      >
        <div className="space-y-4 h-[60vh] overflow-y-auto">
          {allUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 p-3 border-b border-gray-300"
            >
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={user.name}
                  className="h-16 w-16 rounded-full object-cover border-2 border-gray-100"
                />
              ) : (
                <div
                  className={`h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-bold border-2 border-gray-100 ${getAvatarColor(
                    user.name
                  )}`}
                >
                  {getInitials(user.name)}
                </div>
              )}

              <div className="flex-1">
                <p className="font-medium text-gray-800">{user.name}</p>
                <p className="text-[13px] text-gray-500">{user.email}</p>
              </div>

              <input
                type="checkbox"
                checked={tempSelectedUser.includes(user._id)}
                onChange={() => toggleUserSelection(user._id)}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-md transition-colors duration-200"
            onClick={() => setIsModalOpen(false)}
          >
            CANCEL
          </button>

          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200"
            onClick={handleAssign}
          >
            DONE
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default SelectedUsers
