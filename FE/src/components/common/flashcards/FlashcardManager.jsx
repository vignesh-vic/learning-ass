import React, { useState } from 'react'
import
{
Plus,
ChevronLeft,
ChevronRight,
Trash2,
ArrowLeft,
Sparkles,
Brain
}
from
'lucide-react'

import toast from 'react-hot-toast'
import moment from 'moment'

import flascardService from "../../../services/flashcardService"
import aiService from '../../../services/aiServices'
import Spinner from '../Spinner'
import Model from '../Model'
import FlashCard from './FlashCard'


const FlashcardManager = ({documentId}) => {

  const [flashcardSets,setFlashcardSets]=useState([])
  const [selectedSet, setSelectedSet]=useState(null)

  const [loading,setLoading]=useState(true)
  const [generating,setGenerating]=useState(false)

  const [currentCardIndex,setCurrentCardIndex]=useState(0)
  const [isDeleteModelOpen,setIsDeleteModelOpen]=useState(false)
  const [setToDelete,setSetToDelete]=useState(null)



  const fetchFlashcardSets= async()=>{

    try {
      const response=await flascardService.
    } catch (error) {
      toast.error("Failed to fetch")
    }finally{

      setLoading(false)
    }


  }




  return (
    <div>
          FlashcardManager
    </div>
  )
}

export default FlashcardManager
