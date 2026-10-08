import React, { useState, useEffect } from 'react'
import { Plus, Upload, Trash2, FileText, X } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/common/Button'

import documentService from '../../services/documentService'
import Spinner from '../../components/common/Spinner'




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
        return <div>renderContent</div>
    }


    return (
        <div className='min-h-screen'>

            <div className='absolute inset-0 bg-[radial-gradient(#e5e7eb_1px, transparent_1px)] bg-size-[16px_16px] opacity-30 pointer-events-none'></div>


            <div className='relative '>
                <div>
                    <div>
                        <h1>
                            My Documents
                        </h1>

                        <p>
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
