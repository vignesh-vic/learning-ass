import React, { useEffect, useState } from 'react'
import Spinner from '../../components/common/Spinner'
import progressService from '../../services/progressService'
import { BookOpen, BrainCircuit, Clock, FileText, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'

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
       label: 'Total Documents' ,
      value: dashboardData.overview.totalDocuments,
      icons:FileText,
      gradient:'from-blue-400 to-cyan-500',
      shadowColor:'shadow-blue-500/25'
      
      },
    {
      label: 'Total Flashcards' ,
      value: dashboardData.overview.totalFlashcards,
      icons:BookOpen,
      gradient:'from-purple-400 to-pink-500',
      shadowColor:'shadow-blue-500/25'
      
      },
    {
      label: 'Total totalQuizzes' ,
      value: dashboardData.overview.totalQuizzes,
      icons: BrainCircuit,
      gradient:'from-emerald-400 to-teal-500',
      shadowColor:'shadow-emerald-500/25'
      
      }
  ]


  return (
    <div>
dashboard
    </div>
  )
}

export default DashboradPage
