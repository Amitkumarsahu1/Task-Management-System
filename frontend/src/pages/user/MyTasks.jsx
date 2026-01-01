import React, { useEffect, useState, useCallback } from "react"
import DashboardLayout from "../../components/DashboardLayout"
import { useNavigate, useLocation } from "react-router-dom"
import axiosInstance from "../../utils/axioInstance"
import TaskStatusTabs from "../../components/TaskStatusTabs"
import Pagination from "../../components/Pagination"
import { FaSpinner } from "react-icons/fa"
import { GrPowerReset } from "react-icons/gr"
import TaskCard from "../../components/TaskCard"
import toast from "react-hot-toast"

const MyTask = () => {
  const [allTasks, setAllTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalTasks, setTotalTasks] = useState(0)
  const tasksPerPage = 8

  const [tabs, setTabs] = useState([
    { label: "All", count: 0 },
    { label: "Pending", count: 0 },
    { label: "In Progress", count: 0 },
    { label: "Completed", count: 0 },
  ])

  const [filterStatus, setFilterStatus] = useState("All")

  const navigate = useNavigate()
  const location = useLocation()

  // Fetch tasks
  const getAllTasks = useCallback(async () => {
    setLoading(true)
    
    try {
      const response = await axiosInstance.get("/tasks", {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
          page: currentPage,
          limit: tasksPerPage,
        },
      })

      const tasksData = response.data?.tasks || []
      const statusSummary = response.data?.statusSummary || {}
      const pagination = response.data?.pagination || {}

      setAllTasks(tasksData)
      setTotalPages(pagination.totalPages || 1)
      setTotalTasks(pagination.totalTasks || 0)

      
      setTabs([
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ])
    } catch (error) {
      console.error("Error fetching tasks: ", error)
      toast.error("Failed to load tasks.")
    } finally {
      setLoading(false)
    }
  }, [filterStatus, currentPage])

  
  const handleTaskStatusUpdated = useCallback(() => {
    getAllTasks()
    toast.success("Task list refreshed!")
  }, [getAllTasks])

  const handleClick = (taskId) => {
    navigate(`/user/task-details/${taskId}`)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStatusChange = (status) => {
    setFilterStatus(status)
    setCurrentPage(1) 
  }

  useEffect(() => {
    
    if (location.state?.refresh) {
      getAllTasks()
      navigate(location.pathname, { replace: true, state: {} })
      return
    }

    getAllTasks()
  }, [filterStatus, currentPage, getAllTasks, location.state?.refresh, navigate, location.pathname])

  return (
    <DashboardLayout activeMenu={"My Tasks"}>
      <div className="min-h-screen bg-gray-50 pt-4 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col">

        {/* Header */}
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-6 mb-6">
            
            {/* Title */}
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                My Tasks 📋
              </h2>
              <p className="mt-1 text-base text-gray-500">
                Overview of all your assigned tasks.
              </p>
            </div>

            
            <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={handleStatusChange}
              />

              <button
                onClick={handleTaskStatusUpdated}
                disabled={loading}
                className={`p-3 rounded-lg text-gray-600 border border-gray-300 hover:bg-gray-100 transition duration-150 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                title="Refresh Tasks"
              >
                <GrPowerReset className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        <hr className="mb-6"/>

        {/* Task List */}
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FaSpinner className="animate-spin h-6 w-6 text-indigo-500 mx-auto" />
                <p className="mt-2 text-sm text-indigo-600">Loading tasks...</p>
              </div>
            </div>
          ) : (
            <>
              {allTasks.length > 0 ? (
                <>
                  {/* Task Count Info */}
                  <div className="mb-4 text-sm text-gray-600">
                    Showing {((currentPage - 1) * tasksPerPage) + 1} - {Math.min(currentPage * tasksPerPage, totalTasks)} of {totalTasks} tasks
                  </div>

                  
                  <div className="flex-1 min-h-[600px]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                      {allTasks.map((item) => (
                        <TaskCard
                          key={item._id}
                          title={item.title}
                          description={item.description}
                          priority={item.priority}
                          status={item.status}
                          progress={item.progress}
                          createdAt={item.createdAt}
                          dueDate={item.dueDate}
                          assignedTo={item.assignedTo?.map((user) => user.profileImageUrl)}
                          attachmentCount={item.attachments?.length || 0}
                          completedTodoCount={item.completedCount || 0}
                          todoChecklist={item.todoChecklist || []}
                          onClick={() => handleClick(item._id)}
                          onStatusChange={handleTaskStatusUpdated}
                        />
                      ))}
                    </div>
                  </div>

                  
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-dashed border-gray-300 max-w-md mx-auto px-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1a9 9 0 1118 0 9 9 0 01-18 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">
                      No tasks found in "{filterStatus}"
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try checking a different status or enjoy your free time!
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MyTask