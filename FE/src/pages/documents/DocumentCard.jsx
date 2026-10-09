import React from 'react'
import { useNavigate } from 'react-router-dom'

import { FileText, Trash2, BookOpen, BrainCircuit, Clock } from 'lucide-react'
import moment from 'moment'


const formatFileSize = (sizeInBytes) => {
if(bytes == undefined || bytes === 0) return '0 Bytes';
const k = 1024;
const units = ['B', 'KB', 'MB', 'GB', 'TB'];
let size = sizeInBytes;
let unitIndex = 0;

while (size >= k && unitIndex < units.length - 1) {
    size /= k;
    unitIndex++;    

}

return `${size.toFixed(1)} ${units[unitIndex]}`;
}




const DocumentCard = ({document, OnDelete}) => {

    const navigate = useNavigate()

    const handleNavigate = () => {
        navigate(`/documents/${document._id}`)
    }

    const handleDelete = (e) => {
        e.stopPropagation()
        OnDelete(document._id)
    }
  return (
    <div>
          DocumentCard
    </div>
  )
}

export default DocumentCard
