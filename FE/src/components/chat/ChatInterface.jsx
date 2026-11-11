import React, { useEffect, useRef, useState } from 'react'

import { Send, MessageSquare, Sparkles } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import aiService from '../../services/aiServices'
import Spinner from '../common/Spinner'
import MarkdownRenderer from '../common/MarkdownRenderer'

const ChatInterface = () => {
  const { id: documentId } = useParams()
  const user = useSelector((state) => state.auth.user)
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
    const isUser = message.role === 'user'
    return (
      <div key={index} className={`flex items-start gap-3 my-4  ${isUser ? 'justify-end' : ''} `}>
          {!isUser && (
            <div className='w-9 h-9 rounded-2xl shadow-sm '>
              <Sparkles className='' strokeWidth={2} />
              </div>
          )}
        <div className={`max-w-lg p-4 rounded-2xl shadow-sm  ${isUser ? 'bg-linear-to-br from-emerald-500 to-teal-500 text-white rounded-br-md ' : 'bg-white border border-slate-200/60 text-slate-800 rounded-bl-md '}`}>
            {isUser?(
          <p>
            {message.content}
          </p>  
          ):( 
            <MarkdownRenderer content={message.content}/>
          )
            
            }
          </div>
          {isUser && (
            <div className='w-9 h-9 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm shrink-0'>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
      </div>
    )
  }


  if (initialLoading) {
    return (
      <div className='flex flex-col  h-[70vh] bg-white/80 backdrop-blue-xl border border-slate-200/60 rounded-2xl  items-center justify-center  shadow-xl  shadow-slate-200/50'>
        <div className='w-14 h-14 rounded-2xl  flex bg-linear-to-br from-emerald-100 to-teal-100 items-center justify-center mb-4 '>
          <MessageSquare className='w-7 h-7 text-emerald-600' strokeWidth={2} />
        </div>
        <Spinner />
        <p className='text-sm text-stale-500 mt-3 font-medium'>Loading chat History... </p>
      </div>
    )
  }


  return (
    <div className='flex flex-col h-[70vh] bg-white/80 backdrop-blue-xl border border-slate-200/60 rounded-2xl shadow-xl  shadow-slate-200/50 overflow-hidden'>
      <div className='flex-1 p-6  overflow-y-hidden bg-linear-to-br  from-slate-50/50 via-white/50 to-slate-50/50'>
        {
          history.length === 0 ? (
            <div className='flex flex-col  items-center  justify-center h-full text-center'>

              <div className='w-14 h-14 rounded-2xl  flex bg-linear-to-br from-emerald-100 to-teal-100 items-center justify-center mb-4 '>
                <MessageSquare className='w-7 h-7 text-emerald-600' strokeWidth={2} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                Start a conversation.
              </h3>

              <p className="text-sm text-slate-500">
                Ask me anything about the document and I will try to answer your questions based on the content of the document.
              </p>

            </div>
          ) :
            (
              history.map(renderMessage)
            )

        }
        <div ref={messageRef} />
        {
          loading && (
            <div className='flex items-center gap-3 my-4'>
              <div className='w-8 h-8 rounded-2xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25  flex items-center justify-center shrink-0'>
                <Sparkles className='w-4 h-4 text-white' strokeWidth={2} />
              </div>
              <div className='flex items-center gap-2 px-4 py-3 rounded-2xl rounded-bl-md  bg-white border  border-slate-200/60  '>
                <div className='flex-1 gap-1'>
                  <span className='w-2 h-2 bg-slate-400 rounded-full animate-bounce' style={{ animationDelay: '0s' }}></span>
                  <span className='w-2 h-2 bg-slate-400 rounded-full animate-bounce' style={{ animationDelay: '150s' }}></span>
                  <span className='w-2 h-2 bg-slate-400 rounded-full animate-bounce' style={{ animationDelay: '300s' }}></span>
                </div>
              </div>
            </div>
          )
        }
      </div>
      {/* input area for sending message */}

<div className='p-5 border-t border-slate-200/60 bg-white/80'>


  <form onSubmit={handleSendMessage} className='flex items-center gap-3 p-4 border-t border-slate-200/60 bg-white'>
    <input
      type="text"

      value={messgae}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Ask follow-up questions about the document..."
      className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
      disabled={loading}
    />
    <button
      type="submit"
      className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white transition-all duration-200 shadow-lg shadow-emerald-500/25 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
      disabled={loading || !messgae.trim()}
    > 
      <Send className="w-5 h-5" strokeWidth={2}/>
    </button>
  </form> 
</div>


    </div>
  )
}

export default ChatInterface
