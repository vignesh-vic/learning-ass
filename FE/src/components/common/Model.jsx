import { X } from 'lucide-react'
import React from 'react'


const Model = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>

      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className='relative z-10 w-full max-w-lg mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl'>

        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
            {title}
          </h3>
          <button
            className='p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-800 transition-colors'
            onClick={onClose}
          >
            <X strokeWidth={2} size={18} />
          </button>
        </div>

        {/* Body */}
        <div className='px-6 py-5'>
          {children}
        </div>

      </div>
    </div>
  )
}

export default Model
