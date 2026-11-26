import React, { useEffect, useState } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ArrowLeft,
  Sparkles,
  Brain,
} from "lucide-react";

import toast from "react-hot-toast";
import moment from "moment";

import flascardService from "../../../services/flashcardService";
import aiService from "../../../services/aiServices";
import Spinner from "../Spinner";
import Model from "../Model";
import FlashCard from "./FlashCard";
import flashcardService from "../../../services/flashcardService";

const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModelOpen, setIsDeleteModelOpen] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);

  const [deleting,setDeleting]=useState(false)

  const fetchFlashcardSets = async () => {
    try {
      const response =
        await flascardService?.getFlashcardsForDocument(documentId);
      setFlashcardSets(response.data);
    } catch (error) {
      toast.error("Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchFlashcardSets(documentId);
    }
  }, [documentId]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Flashcards generated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to generate flashcards")
    }
    finally {
      setGenerating(false)
    }
  };

  const HandleNextCard = () => {
    if (selectedSet) {
      handleReview(currentCardIndex)
      setCurrentCardIndex((prev) => (prev + 1) % selectedSet?.cards?.length)
    }
  }

  const handlePrevCard = () => {
    if (selectedSet) {
      handleReview(currentCardIndex)
      setCurrentCardIndex((prev) => (prev - 1 + selectedSet?.cards?.length) % selectedSet?.cards?.length)
    }

  }

  const handleReview = async (index) => {
    const currentCard = selectedSet?.cards[currentCardIndex]
    if (!currentCard) return;
    try {
      await flashcardService.reviewFlashcard(currentCard?._id, index)
      toast.success("Flashcard reviewed")
    } catch (error) {
      toast.error("Failed to review flashcard")
    }
  }

  const handleToggleStar = async (cardId) => {

  }

  const handleDeleteRequest = async (e, set) => {
    e.stopPropagation()
    setSetToDelete(set)
    setIsDeleteModelOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!setToDelete) return;
    setDeleting(true)
    try {
      await flascardService.deleteFlashcardSet(setToDelete._id)
    } catch (error) {
      
    }
  }


  const handleSelectSet = (set) => {
    setSelectedSet(set)
    setCurrentCardIndex(0)
  }

  const renderFlashcardViewer = () => {

  }

  const renderSetList = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      )

    }
    if (flashcardSets.length === 0) {



      return (
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 mb-16">
            <Brain className="w-8 h-8 text-emerald-600" strokeWidth={2} />
          </div>
          <h3 className="text-xl font-semibold text-slate-900  mb-2">
            No Flashcards Yet
          </h3>
          <p className="text-sm  text-slate-500 mb-8 text-center max-w-sm">
            Generate flashcards from your document to start learning and reinforce your knowledge
          </p>
          <button onClick={handleGenerateFlashcards}
            disabled={generating}
            className="group inline-flex items-center gap-2 px-6 h-12 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm rounded-xl  transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 "
          >
            {
              generating ? (
                <>
                  <div className="w-4 h-4  border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>

              ) : (
                <>
                  <Sparkles strokeWidth={2} className="w-4 h-4  " />
                  Generate Flashcards
                </>
              )
            }
          </button>
        </div>
      )
    }

    return <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div className="">
          <h3 className="text-lg font-semibold text-slate-900">
            Your Flashcard Sets
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {flashcardSets.length}
            {flashcardSets.length === 1 ? " set" : " sets"} available

          </p>
        </div>
        <button onClick={handleGenerateFlashcards} disabled={generating} className="group inline-flex items-center gap-2 px-5 h-11 bg-linear-to-r  from-emerald-500 to-teal-500  hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100">
          {generating ? <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating...

          </> : <>

            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Generate New Set
          </>}


        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {flashcardSets?.map((set) => (
          <div
            key={set._id}
            onClick={() => handleSelectSet(set)}
            className="group relative bg-white/80 backdrop-blur-xl  border-2 border-slate-200  hover:border-emerald-300 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/10"
          >

            <button onClick={(e) => handleDeleteRequest(e, set)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <Trash2 strokeWidth={2} className="w-4 h-4" />

            </button>

            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl  bg-linear-to-br from-emerald-100 to-teal-100">
                <Brain className="h-4 w-4 text-emerald-600" strokeWidth={2} />
              </div>

              <div>
                <h4 className="text-base font-semibold text-slate-900 mb-1">
                  Flashcard Set
                </h4>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Created {moment(set.createdAt).format("MMM D, YYYY")}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <span className=" text-sm font-semibold text-emerald-700">
                    {set.cards.length}
                    {set.cards.length === 1 ? " card" : " cards"}
                  </span>
                </div>
              </div>

            </div>

          </div>
        ))}
      </div>
    </div>


  }


  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/50 p-8">
        {selectedSet ? renderFlashcardViewer() : renderSetList()}
      </div>;

      <Model

        isOpen={isDeleteModelOpen}
        onClose={() => setIsDeleteModelOpen(false)}
        title="Delete Flashcard Set"

      >
        <div className="spac-y-6">
          <p className="text-slate-600">
            Are you sure you want to delete this flashcard set? This action cannot be undo and all cards will be permanently removed.
          </p>
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
            type="button"
            onClick={()=>setIsDeleteModelOpen(false)


            }

            className="px-5 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition-all duration-200  disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={deleting}
              >
                Cancel
            </button>
            <button 
              onClick={handleConfirmDelete}
              disabled={deleting}

              className="px-5 h-11 bg-linear-to-r from-rose-500 to-red-500 hover:from-rose-600  hover:to-red-500 text-white font-semibold text-xs rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"

            >
              {
                deleting ? 

                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                  Deleting...
                </span>:
                (
                  "Delete Set"
                )
              }

            </button>
          </div>
        </div>
      </Model>
    </>
  )
}

export default FlashcardManager;
