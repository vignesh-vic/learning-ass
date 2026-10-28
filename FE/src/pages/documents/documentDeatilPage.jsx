import { useParams, Link } from "react-router-dom"
import documentService from "../../services/documentService"
import Spinner from "../../components/common/Spinner"
import toast from "react-hot-toast"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"
import PageHeader from "../../components/common/PageHeader"
import Tabs from "../../components/common/Tabs"


const DocumentDetailPage = () => {
  
  const {id}=useParams()
  const [document,setDocuments]=useState(null)
  const [loading,setLoading]=useState(true)
  const [activeTab,setActiveTab]=useState('Content')

  useEffect(()=>{
    const fetchDocumentDetails=async()=>{
      try {
        const data=await documentService.getDocuments()
        setDocuments(data)

      } catch (error) {
        toast.error('Failed to fetch document details')
      }finally{
        setLoading(false)
      }
    }
    fetchDocumentDetails()
  },[id])

  
  const getPdfUrl=()=>{
    if(!document?.data?.filePath) return null
    const filePath=document.data.filePath

    if (filePath.startsWidth('https://') || filePath.startsWidth('https://')){
      return filePath
    }

    const baseUrl = process.env.REACT_APP_API_URL || "https://localhost:8000"
   return  `${baseUrl}${filePath.startsWith('/') ? '': filePath}`
  
  }

  const renderContent=()=>{

    if(loading){
      return <Spinner/>
    
    }

    if(!document){

      return <p className="text-center p-8">No document found</p>
    }

    const pdfUrl=getPdfUrl()


    return (
          <div className="bg-white border  border-gray-300 rounded-lg p-4 overflow-hidden shadow-sm">
              <div className="flex items-center justify-between p-4  bg-gray-50 border-b border-gray-300 ">
                <span className="text-sm  font-semibold text-gray-700">
                  Document Viewer
                </span>
                <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800"

                >
                  <ExternalLink className="w-4 h-4"/>
                  Open in new tab
                </a>
              </div>

              <div className="bg-gray-50">
                <iframe
                src={pdfUrl}
                title="Document Viewer"
                className='w-full h-[70vh] bg-white  rounded border border-gray-300'
                frameBorder="0"
                style={{colorScheme:'light'}}
                />
              </div>

            
              </div>

          )

  }

  const renderChat=()=>{
   return "renderChat" 
  }

  const renderAIActions=()=>{
    return "renderActions" 
  }

  const renderFlashcardsTab=()=>{
    return "renderFlashcardsTab" 
  }
  
  const renderQuizzesTab=()=>{
    return "renderQuizzesTab" 
  }

  const tabs=[
    {name:'Content',label:renderContent()},
    {name:'Chat',label:renderChat()},
    { name: 'AI Actions', label: renderAIActions() },
    {name:'Flashcards',label:renderFlashcardsTab()},
    {name:'Quizzes',label:renderQuizzesTab()}
  ]
    

  if(loading){
    return <Spinner/>

  }

  if(!document){
    return <div className="text-center p-8 ">Document not found.</div>
  }

  
  console.log(document?.data );

  return (
    <div className="p-4">
         <div>

          <Link to="/documents" className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-blue-800 mb-4">
            <ArrowLeft size={16}/>
            Back to Documents
          </Link>
         </div>
         <PageHeader title={document?.data?.title}/>
         <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab}/> 
    </div>
  )
}

export default DocumentDetailPage
