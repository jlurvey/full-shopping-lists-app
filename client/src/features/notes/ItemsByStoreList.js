//src/components/features/notes/ItemsByStoreList.js

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"
import { selectAllNotes, selectNoteById } from "./notesSlice";

function ItemsByStoreList() {
    const dispatch = useDispatch()
    const notes =useSelector(selectAllNotes)
    const noteStatus = useSelector((state) => state.notes.status)
    const error = useSelector((state) => state.notes.error)

    useEffect(() => {
        if (noteStatus === 'idle') {
            dispatch(fetchNotes())
        }
    }, [noteStatus, dispatch])

    let content

}

