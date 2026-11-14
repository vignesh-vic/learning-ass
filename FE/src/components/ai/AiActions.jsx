
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import {Sparkles, BookOpen, Lightbulb} from 'lucide-react'

import aiService from '../../services/aiServices'
import toast from 'react-hot-toast'
import MarkdownRenderer from '../common/MarkdownRenderer'


const AiActions = () => {

    const { id: documentId } = useParams()

    const [loadingAction, setLoadingAction] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState('')
    const [modalTitle, setModalTitle] = useState('')
    const [conept, setConcept] = useState('')

    const handleGenerateSummary = async () => {
        try {
            const {summary} = await aiService.generateSummary(documentId)
            setModalTitle('Generated Summary')
            setModalContent(summary)
            setIsModalOpen(true)
        } catch (error) {
            toast.error('Failed to generate summary')

        }finally {
            setLoadingAction(null)
        }
    }


    const handleExplainConcept = async (e) => {
      e.preventDefault()

      if(!conept.trim()) {
        toast.error('Please enter a concept to explain')
        return
      }
      setLoadingAction('explain')
        try {
            const {explanation} = await aiService.explainConcept(documentId, conept)

            setModalTitle(`Explanation of ${conept}`)
            setModalContent(explanation)
            setIsModalOpen(true)
            setConcept('')

        }
        catch (error) {
            toast.error('Failed to explain concept')
        }finally {
            setLoadingAction(null)
        }
      }
  return (
    <>
      <div>
              <div>
                  <div>
                    
                    <div>

                    <Sparkles className='' strokeWidth={2}/>

                    </div>

                    </div>  

                    <h3>
                      AI Assistant
                    </h3>
                    <p>
                      Powerd by advanced AI
                    </p>
              </div>  
      </div> 


      <div>

        <div>
            <div>
               <div>
                <div>
                    <div>
                      <div>
                        <BookOpen className='' strokeWidth={2}/>
                      </div>
                      <h4>
                        Generate Summary
                      </h4>
                    </div>
                    <p>

                      Get a concise summary of the document's content
                    </p>
                </div>
                <button onClick={handleGenerateSummary} disabled={loadingAction === 'summary'}>
                  {loadingAction === 'summary' ? (<span>

                      <div/>
                      Loading...

                  </span>) : 'Summarize'}
                </button>
              </div>
               </div>
            </div>
        </div>
    </>
  )
}

export default AiActions
