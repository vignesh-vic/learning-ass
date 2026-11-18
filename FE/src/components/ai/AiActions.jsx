import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Sparkles, BookOpen, Lightbulb } from 'lucide-react'
import aiService from '../../services/aiServices'
import toast from 'react-hot-toast'
import MarkdownRenderer from '../common/MarkdownRenderer'
import Model from '../common/Model'

const AiActions = () => {
  const { id: documentId } = useParams()

  const [loadingAction, setLoadingAction] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState('')
  const [modalTitle, setModalTitle] = useState('')
  const [concept, setConcept] = useState('')

  const handleGenerateSummary = async () => {
    setLoadingAction('summary')
    try {
      const { summary } = await aiService.generateSummary(documentId)
      setModalTitle('Generated Summary')
      setModalContent(summary)
      setIsModalOpen(true)
    } catch (error) {
      toast.error('Failed to generate summary')
    } finally {
      setLoadingAction(null)
    }
  }

  const handleExplainConcept = async (e) => {
    e.preventDefault()
    if (!concept.trim()) {
      toast.error('Please enter a concept to explain')
      return
    }
    setLoadingAction('explain')
    try {
      const { explanation } = await aiService.explainConcept(documentId, concept)
      setModalTitle(`Explanation: ${concept}`)
      setModalContent(explanation)
      setIsModalOpen(true)
      setConcept('')
    } catch (error) {
      toast.error('Failed to explain concept')
    } finally {
      setLoadingAction(null)
    }
  }

  return (
    <>
      <div className='space-y-4'>

        {/* Generate Summary Card */}
        <div className='flex items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200'>
          {/* Left */}
          <div className='flex-1'>
            <div className='flex items-center gap-2.5 mb-1.5'>
              <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center shrink-0'>
                <BookOpen className='w-4 h-4 text-blue-500' strokeWidth={2} />
              </div>
              <h4 className='text-sm font-bold text-slate-800'>Generate Summary</h4>
            </div>
            <p className='text-sm text-slate-500 ml-0.5'>Get a concise summary of the entire document.</p>
          </div>

          {/* Right: button */}
          <button
            onClick={handleGenerateSummary}
            disabled={loadingAction === 'summary'}
            className='shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-medium shadow-md shadow-emerald-500/25 transition-all duration-200 disabled:opacity-80 disabled:cursor-not-allowed active:scale-95'
          >
            {loadingAction === 'summary' ? (
              <>
                <svg className='w-4 h-4 animate-spin shrink-0' viewBox='0 0 24 24' fill='none'>
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                  <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
                </svg>
                Loading...
              </>
            ) : 'Summarize'}
          </button>
        </div>

        {/* Explain a Concept Card */}
        <div className='p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200'>
          {/* Header */}
          <div className='flex items-center gap-2.5 mb-1.5'>
            <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shrink-0'>
              <Lightbulb className='w-4 h-4 text-amber-500' strokeWidth={2} />
            </div>
            <h4 className='text-sm font-bold text-slate-800'>Explain a Concept</h4>
          </div>
          <p className='text-sm text-slate-500 mb-4 ml-0.5'>Enter a topic or concept from the document to get a detailed explanation.</p>

          {/* Input + Button */}
          <form onSubmit={handleExplainConcept} className='flex items-center gap-3'>
            <input
              type='text'
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="Ask anything from document..."
              className='flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50 placeholder:text-slate-400 text-slate-700'
              disabled={loadingAction === 'explain'}
            />
            <button
              type='submit'
              disabled={loadingAction === 'explain' || !concept.trim()}
              className='shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-medium shadow-md shadow-emerald-500/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95'
            >
              {loadingAction === 'explain' ? (
                <>
                  <svg className='w-4 h-4 animate-spin shrink-0' viewBox='0 0 24 24' fill='none'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
                  </svg>
                  Loading...
                </>
              ) : 'Explain'}
            </button>
          </form>
        </div>

      </div>

      {/* Modal */}
      <Model isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
        <div className='prose prose-sm prose-slate max-w-none max-h-[60vh] overflow-y-auto'>
          <MarkdownRenderer content={modalContent} />
        </div>
      </Model>
    </>
  )
}

export default AiActions
