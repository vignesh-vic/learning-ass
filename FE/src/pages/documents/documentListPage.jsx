import React, { useState, useEffect } from 'react'
import { Plus, Upload, Trash2, FileText, X } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/common/Button'

import documentService from '../../services/documentService'
import Spinner from '../../components/common/Spinner'
import DocumentCard from './DocumentCard'



const DocumentListPage = () => {
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(true)


    const [isUploadModelOpen, setIsUploadModelOpen] = useState(false)
    const [uploadFile, setUploadFile] = useState(null)
    const [uploadTitle, setUploadTitle] = useState('')
    const [uploading, setUploading] = useState(false)


    const [isDeleteModelOpen, setIsDeleteModelOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const [selectedDoc, setSelectedDoc] = useState(null)


    const fetchDocuments = async () => {
        try {
            const data = await documentService.getDocuments()
            setDocuments(data)

        } catch (error) {
            toast.error('failed to fetch documents.')
        }
        finally {
            setLoading(false)
        }

    }


    useEffect(() => {
        fetchDocuments()
    }, [])


    const handleFileChange = (e) => {
        const file = e.target.files[0]

        if (file) {

            setUploadFile(file)
            setUploadTitle(file.name.replace(/\.[^/.]+$/, "")) // Remove file extension for title
        }
    }


    const handleUpload = async () => {

        e.preventDefault()

        if (!uploadFile || !uploadTitle) {
            toast.error('Please select a file and provide a title.')
            return
        }

        setUploading(true)

        const formData = new FormData()
        formData.append('file', uploadFile)
        formData.append('title', uploadTitle)


        try {
            await documentService.uploadDocument(formData)
            toast.success('Document uploaded successfully.')
            setIsUploadModelOpen(false)
            setUploadFile(null)
            setUploadTitle('')
            setLoading(true)
            fetchDocuments()
        } catch (error) {
            toast.error('Failed to upload document.')
        }
        finally {
            setUploading(false)
        }

    }


    const handleDeleteRequest = async (doc) => {

        if (!selectedDoc) {
            toast.error('No document selected for deletion.')
            return
        }

        setSelectedDoc(doc)
        setIsDeleteModelOpen(true)

    }



    const handleConfirmDelete = async () => {

        if (!selectedDoc) {
            toast.error('No document selected for deletion.')
            return
        }

        setDeleting(true)

        try {

            await documentService.deleteDocument(selectedDoc.id)
            toast.success(`Document "${selectedDoc.title}" deleted.`)
            setIsDeleteModelOpen(false)
            setSelectedDoc(null)
            setDocuments(documents.filter(doc => doc.id !== selectedDoc.id))

        } catch (error) {
            toast.error('Failed to delete document.')
        }
        finally {
            setDeleting(false)
        }
    }

    const renderContent = () => {

        if( loading) {
            return (
                <div className='flex items-center justify-center min-h-[400px]'>
                    <Spinner />
                </div>
            )
        }

        if (documents.length === 0) {
            return (
                <div className='flex items-center justify-center min-h-[400px]'>
                    <div className='text-center max-w-md'>
                        <div className='inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 shadow-lg shadow-slate-200/50 mb-4'>
                            <FileText className='h-10 w-10 text-slate-400' strokeWidth={1.5} />

                        </div>
                        <h3 className='text-xl font-medium text-slate-900 tracking-tight mb-2'>No Documents Available</h3>
                        <p className='text-sm text-slate-500 mb-6'>Get started by uploading your first document.</p>
                        <button onClick={() => setIsUploadModelOpen(true)} className='inline-flex  items-center  gap-2 px-6 py-3 bg-linear-to-r  from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm  font-semibold rounded-xl  transition-all duration-200 shadow-lg  shadow-emerald-500/25 hover:shadow-emerald-500/30 active:scale-[0.98]  mt-4'>
                            <Plus className='mr-2 h-4 w-4' strokeWidth={2.5} />
                            Upload Document
                        </button>
                    </div>     
                </div>
            )
        }

        return (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
                {documents.map((doc) => (
                    <DocumentCard
                        key={doc.id}
                        document={doc}
                        onDelete={() => handleDeleteRequest}
                    />
                ))}
            </div>
        )

    }


    return (
        <div className='min-h-screen'>

            <div className='absolute inset-0 bg-[radial-gradient(#e5e7eb_1px, transparent_1px)] bg-size-[16px_16px] opacity-30 pointer-events-none'></div>


            <div className='relative  max-w-7xl  mx-auto'>
                <div className='flex  items-center justify-between mb-10'>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
                            My Documents
                        </h1>

                        <p className='mt-2 text-sm text-gray-700'>
                            Manage and organize your learning  materials in one place.
                        </p>
                    </div>
                    {
                        documents.length > 0 && (

                            <Button onClick={() => setIsUploadModelOpen(true)} >

                                <Plus className='mr-2 h-4 w-4' strokeWidth={2.5} />
                                Upload Document
                            </Button>
                        )


                    }
                </div>
                {renderContent()}


            </div>


        </div>
    )
}

export default DocumentListPage
