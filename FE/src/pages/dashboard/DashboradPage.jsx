import React, { useEffect, useState } from 'react'
import Spinner from '../../components/common/Spinner'
import progressService from '../../services/progressService'
import { BookOpen, BrainCircuit, Clock, FileText, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link } from "react-router-dom";

const DashboradPage = () => {

  const [dashboardData, setDashBoardData] = useState(null)
  const [loading, setLoading] = useState(true)


  const fetchDashboardData = async () => {

    try {
      const data = await progressService.getDashboardData()
      setDashBoardData(data?.data)

    } catch (error) {
      toast.error('failed to fetch dashboard data.')
    } finally {
      setLoading(false)
    }

  }


  useEffect(() => {

    fetchDashboardData()

  }, [])


  if (loading) {
    return <Spinner />
  }


  if (!dashboardData || !dashboardData.overview) {

    return (
      <div className='min-h-screen bg-linear-to-br  from-slate-50 via-white to-slate-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-flex items-center justify-between w-16 h-16 rounded-2xl bg-slate-100 mb-4'>
            <TrendingUp className='w-8 h-8 text-slate-400' />
          </div>
          <p className='text-slate-600 text-sm'>
            No dashboard data available
          </p>
        </div>
      </div>
    )
  }


  const stats = [
    {
      label: 'Total Documents',
      value: dashboardData.overview.totalDocuments,
      icons: FileText,
      gradient: 'from-blue-400 to-cyan-500',
      shadowColor: 'shadow-blue-500/25'

    },
    {
      label: 'Total Flashcards',
      value: dashboardData.overview.totalFlashcards,
      icons: BookOpen,
      gradient: 'from-purple-400 to-pink-500',
      shadowColor: 'shadow-blue-500/25'

    },
    {
      label: 'Total totalQuizzes',
      value: dashboardData.overview.totalQuizzes,
      icons: BrainCircuit,
      gradient: 'from-emerald-400 to-teal-500',
      shadowColor: 'shadow-emerald-500/25'

    }
  ]


  return (
    <div className='min-h-screen'>

      <div className='absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-30 pointer-events-none' />

      <div className='relative max-w-7xl mx-auto  '>
        <div className='mb-6'>
          <h1 className='text-2xl font-medium text-slate-900 mb-2'>
            Dashboard
          </h1>
          <p className='text-sm text-slate-500'>
            Track your learning progress and performance with our comprehensive dashboard.
          </p>

        </div>
        <div className='grid grid-cols-1 md:grid-cols-3  gap-6 mb-5'>
          {stats.map((stat, index) => (
         <>
              <div key={index} className={`group p-4 rounded-xl bg-white shadow-md transition-transform duration-300 hover:scale-105`}>
                <div className='flex items-center gap-4 justify-between '>
                  <span className='text-sm text-slate-500 uppercase tracking-wide'>
                    {stat.label}
                  </span>
                  <div className={`w-11 h-11 rounded-xl bg-linear-to-br ${stat.gradient} shadow-lg ${stat.shadowColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icons strokeWidth={2} className='text-white w-5 h-5' />
                  </div>
                </div>
                <div className='text-2xl font-semibold text-slate-900 tracking-tight'>
                  {stat.value}
                </div>
              </div>
         </>
          ))}
        </div>
        <div className='bg-white rounded-2xl shadow-xl p-4  border border-slate-200/60   '>
          <div className='flex items-center gap-4'>

            <div className='inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-100 mb-4 from-0% to-100% via-50% bg-linear-to-r'>
              <Clock strokeWidth={2} className='w-5 h-5 text-slate-500' />
            </div>
            <h3 className='text-lx font-medium text-slate-900 mb-2'>
              Recent Activity
            </h3>

          </div>


          {dashboardData.recentActivity &&
            (dashboardData.recentActivity.documents.length > 0 ||
              dashboardData.recentActivity.quizzes.length > 0) ? (
            <div className='space-y-4 mt-4'>
              {[
                ...(dashboardData.recentActivity.documents || []).map((doc) => ({
                  id: doc._id,
                  description: doc.title,
                  timestamp: doc.lastAccessed,
                  link: `/documents/${doc._id}`,
                  type: "document",
                })),

                ...(dashboardData.recentActivity.quizzes || []).map((quiz) => ({
                  id: quiz._id,
                  description: quiz.title,
                  timestamp: quiz.lastAttempted,
                  link: `/quiz/${quiz._id}`,
                  type: "quiz",
                })),
              ]
                .sort(
                  (a, b) =>
                    new Date(b.timestamp).getTime() -
                    new Date(a.timestamp).getTime()
                )
                .map((activity, index) => (
                  <div
                    key={activity.id || index}
                    className="group flex items-center justify-between p-4 rounded-xl bg-slate-50/50 border border-slate-200/60 hover:bg-white hover:border-slate-300/60  hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className={`w-2 h-2 rounded-full ${activity.type === "document"
                              ? "bg-linear-to-r from-blue-500 to-cyan-500"
                              : "bg-linear-to-r from-emerald-400 to-teal-500"
                            }`}
                        />

                        <p className="text-sm text-slate-700 font-medium truncate">
                          {activity.type === "document"
                            ? "Accessed Document"
                            : "Attempted Quiz"}
                          :{" "}
                          <span className="text-blue-500 hover:underline">
                            {activity.description}
                          </span>
                        </p>
                      </div>

                      <p className="text-sm text-slate-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>

                    {activity.link && (
                      <Link
                        to={activity.link}
                        className="text-xs ml-4 text-emerald-500 hover:text-emerald-700 font-semibold  duration-300 rounded-lg transition-all  "
                      >
                          View
                        </Link>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4">
                <Clock className="w-8 h-8 text-slate-500" />
              </div>

              <p className="text-sm text-slate-500">No recent activity</p>

              <p className="text-slate-500">Start Learning to see your progress here</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default DashboradPage
