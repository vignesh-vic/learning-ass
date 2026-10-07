import React, { useState } from 'react'
import { Plus, Upload, Trash2, FileText, X } from 'lucide-react'
import toast from 'react-hot-toast'


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
        <div>
            DocumentListPage

        </div>
    )
}

export default DocumentListPage
