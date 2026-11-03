import React, { useEffect, useRef, useState } from 'react'

import { Send, MessageSquare, Sparkles } from 'lucide-react'
import { useParams } from 'react-router-dom'
import aiService from '../../services/aiServices'
// import { useAuth } from '../../context/authContext'
import Spinner from '../common/Spinner'
import MarkdownRenderer from '../common/MarkdownRenderer'

const ChatInterface = () => {
  const { id: documentId } = useParams()
  // const { user } = useAuth()
  const [history, setHistory] = useState([])
  const [messgae, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const messageRef = useRef(null)


  const scrpollToBottom = () => {
    messageRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {

    const fetchChatHistory = async () => {
      try {
        const response = await aiService.getChatHistory(documentId)
        setHistory(response.data)
        setInitialLoading(false)
      } catch (error) {
        console.error('Error fetching chat history:', error)
        setInitialLoading(false)
      }
    }

    fetchChatHistory()

  }, [documentId])


  useEffect(() => {
    scrpollToBottom()
  }, [history])


  const handleSendMessage = async (e) => {

    e.preventDefault()
    if (!messgae.trim()) return;

    const userMessage = { role: 'user', content: messgae, timestamp: new Date().toISOString() }

    setHistory((prevHistory) => [...prevHistory, userMessage])
    setMessage('')
    setLoading(true)

    try {
      const response = await aiService.chat(documentId, userMessage.content)
      const assistantMessage = { role: 'assistant', content: response.data.answer, timestamp: new Date().toISOString(), relavantChunks: response.data.relavantChunks }
      setHistory((prevHistory) => [...prevHistory, assistantMessage])
      setLoading(false)
    } catch (error) {
      const errorMessage = { role: 'assistant', content: 'Sorry, I encountered an error. please try again', timestamp: new Date().toISOString() }

      setHistory((prevHistory) => [...prevHistory, errorMessage])
    }
    setLoading(false)

  }

  const renderMessage = (message, index) => {
    return
  }


  if(initialLoading){
    return (
      <div className='flex flex-col  h-[70vh] bg-white/80 backdrop-blue-xl border border-slate-200/60 rounded-2xl  items-center justify-center  shadow-xl  shadow-slate-200/50'>
        <div className='w-14 h-14 rounded-2xl  flex bg-linear-to-br from-emerald-100 to-teal-100 items-center justify-center mb-4 '>
              <MessageSquare className='w-7 h-7 text-emerald-600' strokeWidth={2}/>
          </div>
        <Spinner />
        <p className='text-sm text-stale-500 mt-3 font-medium'>Loading chat History... </p>
      </div>
    )
  }


  return (
    <div>
      ChatInterface
    </div>
  )
}

export default ChatInterface
