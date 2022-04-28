import React, { useEffect, useState } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import { data } from "./data"
import Split from "react-split"
import {nanoid} from "nanoid"

export default function App() {
    /**
     * Challenge:
     * 1. Every time the `notes` array changes, save it 
     *    in localStorage. You'll need to use JSON.stringify()
     *    to turn the array into a string to save in localStorage.
     * 2. When the app first loads, initialize the notes state
     *    with the notes saved in localStorage. You'll need to
     *    use JSON.parse() to turn the stringified array back
     *    into a real JS array.
     */

    const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem("notes")) || [])
    const [currentNoteId, setCurrentNoteId] = useState(
        (notes[0] && notes[0].id) || ""
    )

    const [firstName, setFirstName] = useState(localStorage.getItem("firstName") || "")

    useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes))
    }, [notes])
    
    useEffect(() => {
        localStorage.setItem("firstName", firstName)
        { firstName ? document.title = `${firstName}'s Notes App` : document.title = `Notes App`}
    }, [firstName])

    function handleChange(event){
        console.log("handleChange")
        const {name, value} = event.target
        setFirstName(value)
    }

    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }

    function updateNote(text) {
        //Puts most recently updated note at the top
        setNotes(oldNotes => {
            const newArray = []
            for(let i = 0; i < oldNotes.length; i++) {
                const oldNote = oldNotes[i]
                if(oldNote.id === currentNoteId) {
                    newArray.unshift({ ...oldNote, body: text })
                } else {
                    newArray.push(oldNote)
                }
            }
            return newArray
        })
    }
    
    function deleteNote(event, selectedNoteId) {
        // Stop parent object from being selected after deletion occurs
        event.stopPropagation()
        setNotes(oldNotes => oldNotes.filter(oldNote => oldNote.id !== selectedNoteId))
    }

    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    firstName={firstName}
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                {/* ASK FOR FIRST NAME TO ADD A GREETING */}
                { firstName ? 
                <h1>Welcome back {firstName}</h1>
                :
                <>
                <h1>What's your first name?</h1>
                <input  
                    name="firstName"
                    type="text"
                    onChange={handleChange}
                    placeholder="Enter first name"
                    value={firstName}
                />
                <h4>You can start creating notes after you finish entering your name</h4>
                </>
}
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
