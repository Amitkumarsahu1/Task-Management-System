import React, { useEffect, useState } from "react"
import DashboardLayout from "../../components/DashboardLayout"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axioInstance"
import TaskStatusTabs from "../../components/TaskStatusTabs"
import Pagination from "../../components/Pagination"
import { FiFilter } from "react-icons/fi"
import { HiOutlineViewGrid } from "react-icons/hi"
import TaskCard from "../../components/TaskCard"
import toast from "react-hot-toast"

const SpinnerLoader = () => (
  <div className="flex justify-center items-center h-40">
    <svg className="animate-spin h-8 w-8 text-indigo-500" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  </div>
)

const ManageTasks = () => {
  const [allTasks, setAllTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [tabs, setTabs] = useState([
    { label: "All", count: 0 },
    { label: "Pending", count: 0 },
    { label: "In Progress", count: 0 },
    { label: "Completed", count: 0 },
  ])

  const [filterStatus, setFilterStatus] = useState("All")

  // ✅ pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalTasks, setTotalTasks] = useState(0)
  const tasksPerPage = 9

  const navigate = useNavigate()

  const getAllTasks = async () => {
    setIsLoading(true)

    try {
      const response = await axiosInstance.get("/tasks", {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
          page: currentPage,
          limit: tasksPerPage,
        },
      })

      const data = response.data || {}

      setAllTasks(data.tasks || [])
      setTotalPages(data.pagination?.totalPages || 1)
      setTotalTasks(data.pagination?.totalTasks || 0)

      const summary = data.statusSummary || {}

      setTabs([
        { label: "All", count: summary.all || 0 },
        { label: "Pending", count: summary.pendingTasks || 0 },
        { label: "In Progress", count: summary.inProgressTasks || 0 },
        { label: "Completed", count: summary.completedTasks || 0 },
      ])
    } catch (error) {
      console.error("Error fetching tasks:", error)
      toast.error("Failed to fetch tasks")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [filterStatus])

  useEffect(() => {
    getAllTasks()
  }, [filterStatus, currentPage])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <DashboardLayout activeMenu={"Manage Task"}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/10 p-6 flex flex-col">

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Task Management
                </h1>
                <p className="text-white/90 text-sm md:text-base">
                  Viewing {totalTasks} {filterStatus.toLowerCase()} tasks
                </p>
              </div>
            </div>
          </div>

          {/* FILTER TABS */}
          <div className="p-6 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <FiFilter className="text-gray-400 text-xl" />
              <span className="text-sm font-semibold text-gray-600">
                Filter by Status
              </span>
            </div>

            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col">
          {isLoading ? (
            <SpinnerLoader />
          ) : allTasks.length > 0 ? (
            <>
              {/* TASK GRID */}
              <div className="flex-1 min-h-[600px]">
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
                      assignedTo={item.assignedTo?.map(u => u.profileImageUrl)}
                      attachmentCount={item.attachments?.length || 0}
                      completedTodoCount={
                        typeof item.completedCount === "number"
                          ? item.completedCount
                          : item.todoChecklist?.filter(t => t.completed).length || 0
                      }
                      todoChecklist={item.todoChecklist || []}
                      onClick={() =>
                        navigate("/admin/create-task", {
                          state: { taskId: item._id },
                        })
                      }
                    />
                  ))}
                </div>
              </div>

              {/* PAGINATION (fixed at bottom) */}
              {totalPages > 1 && (
                <div className="mt-auto pt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <HiOutlineViewGrid className="text-5xl text-blue-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Tasks Found
              </h3>
              <button
                onClick={() => navigate("/admin/create-task")}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl"
              >
                Create New Task
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ManageTasks
