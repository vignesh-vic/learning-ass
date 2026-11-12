
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import {Sparkles, BookOpen, Lightbulb} from 'lucide-react'

import AiService from '../../services/aiServices'
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
            
        } catch (error) {
            
        }
    }

  return (
    <div>
      AiActions
    </div>
  )
}

export default AiActions
