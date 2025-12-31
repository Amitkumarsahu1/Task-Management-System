import React from "react"

const UserCard = ({ userInfo }) => {
  const totalTasks = (userInfo?.pendingTasks || 0) + (userInfo?.inProgressTasks || 0) + (userInfo?.completedTasks || 0)
  const completionRate = totalTasks > 0 ? Math.round(((userInfo?.completedTasks || 0) / totalTasks) * 100) : 0

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return "U"
    const words = name.trim().split(" ")
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
    return (words[0][0] + words[words.length - 1][0]).toUpperCase()
  }

  // Get consistent random color based on name
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
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
      {/* User Info */}
      <div className="flex items-center gap-3 mb-5">
        {userInfo?.profileImageUrl ? (
          <img
            src={userInfo.profileImageUrl}
            alt={userInfo?.name}
            className="h-16 w-16 rounded-full object-cover border-2 border-gray-100"
          />
        ) : (
          <div
            className={`h-16 w-16 rounded-full ${getAvatarColor(
              userInfo?.name
            )} flex items-center justify-center text-white text-xl font-bold border-2 border-gray-100`}
          >
            {getInitials(userInfo?.name)}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {userInfo?.name || "User"}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            {userInfo?.email || ""}
          </p>
        </div>
      </div>

      {/* Task Stats */}
      <div className="space-y-3">
        <StatRow
          label="Pending"
          count={userInfo?.pendingTasks || 0}
          color="yellow"
        />
        <StatRow
          label="In Progress"
          count={userInfo?.inProgressTasks || 0}
          color="blue"
        />
        <StatRow
          label="Completed"
          count={userInfo?.completedTasks || 0}
          color="green"
        />
      </div>

      {/* Progress Bar */}
      {totalTasks > 0 && (
        <div className="mt-5 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Overall Progress</span>
            <span className="text-sm font-semibold text-gray-900">{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default UserCard

const StatRow = ({ label, count, color }) => {
  const getColorClasses = () => {
    switch (color) {
      case "yellow":
        return "bg-yellow-100 text-yellow-800"
      case "blue":
        return "bg-blue-100 text-blue-800"
      case "green":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className={`${getColorClasses()} px-3 py-1 rounded-full text-sm font-semibold min-w-[50px] text-center`}>
        {count}
      </span>
    </div>
  )
}