import React, { useState } from 'react'

const FlashCard = ({flashCard, onToggleStar}) => {
  
    const [isFlipped,setIsFlipped]=useState(false)

    const handleFlip=()=>{
        setIsFlipped(!isFlipped)
    }

    
    return (
    <div>
          FlashCard 
    </div>
  )
}

export default FlashCard
