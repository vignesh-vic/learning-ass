import { useParams, Link } from "react-router-dom"
import documentService from "../../services/documentService"
import Spinner from "../../components/common/Spinner"
import toast from "react-hot-toast"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"
import PageHeader from "../../components/common/PageHeader"
import Tabs from "../../components/common/Tabs"
import ChatInterface from "../../components/chat/ChatInterface"
import AiActions from "../../components/ai/AiActions"


const DocumentDetailPage = () => {
  
  const { id } = useParams()
  const [document, setDocuments] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Content')

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const data = await documentService.getDocumentById(id)
        setDocuments({ data })
      } catch (error) {
        toast.error('Failed to fetch document details')
      } finally {
        setLoading(false)
      }
    }
    fetchDocumentDetails()
  }, [id])

  const getPdfUrl = () => {
    if (!document?.data?.filePath) return null
    const filePath = document.data.filePath

    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath
    }

    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000"
    return `${baseUrl}${filePath.startsWith('/') ? filePath : '/' + filePath}`
  }

  const pdfUrl = getPdfUrl()

  const renderContent = () => {
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-4 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-300">
          <span className="text-sm font-semibold text-gray-700">
            Document Viewer
          </span>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <ExternalLink className="w-4 h-4" />
            Open in new tab
          </a>
        </div>

        <div className="bg-gray-50">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              title="Document Viewer"
              className="w-full h-[70vh] bg-white rounded border border-gray-300"
              frameBorder="0"
              style={{ colorScheme: 'light' }}
            />
          ) : (
            <p className="text-center p-8 text-gray-500">Unable to load PDF preview.</p>
          )}
        </div>
      </div>
    )
  }

  const renderChat = () => {
    return <ChatInterface/>
  }

  const renderAIActions = () => {
    return <AiActions/>
  }

  const renderFlashcardsTab = () => {
    return "renderFlashcardsTab"
  }

  const renderQuizzesTab = () => {
    return "renderQuizzesTab"
  }

  // FIX 4: Tabs component renders `tab.content` for the panel body
  //         and `tab.label` for the button text — these were mixed up
  const tabs = [
    { name: 'Content',    label: 'Content',    content: renderContent() },
    { name: 'Chat',       label: 'Chat',       content: renderChat() },
    { name: 'AI Actions', label: 'AI Actions', content: renderAIActions() },
    { name: 'Flashcards', label: 'Flashcards', content: renderFlashcardsTab() },
    { name: 'Quizzes',    label: 'Quizzes',    content: renderQuizzesTab() },
  ]

  if (loading) {
    return <Spinner />
  }

  if (!document) {
    return <div className="text-center p-8">Document not found.</div>
  }

  return (
    <div className="p-4">
      <div>
        <Link
          to="/documents"
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft size={16} />
          Back to Documents
        </Link>
      </div>
      <PageHeader title={document?.data?.title} />
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}

export default DocumentDetailPage
