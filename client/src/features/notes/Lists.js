import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"
import { selectAllItems, fetchItems } from "../items/itemsSlice";
import { selectAllStores, fetchStores, setSelectedStore } from "../stores/storesSlice";
import { selectAllNotes, fetchNotes } from "./notesSlice";
import ListsItem from "./ListsItem";

function Lists() {
    const dispatch = useDispatch()
    const items = useSelector(selectAllItems)
    const itemStatus = useSelector((state) => state.items.status)
    const itemsError = useSelector((state) => state.items.error)
    const stores = useSelector(selectAllStores)
    const storeStatus = useSelector((state) => state.stores.status)
    const storesError = useSelector((state) => state.stores.error)
    const selectedStore = useSelector((state) => state.stores.selectedStore)
    const notes = useSelector(selectAllNotes)
    const noteStatus = useSelector((state) => state.notes.status)
    const notesError = useSelector((state) => state.notes.error)
    const selectedNote = useSelector((state) => state.notes.selectedNote)


    useEffect(() => {
        if (itemStatus === 'idle') {
            dispatch(fetchItems())
        }
        if (storeStatus === 'idle') {
            dispatch(fetchStores())
        }
        if (noteStatus === 'idle') {
            dispatch(fetchNotes())
        }

    }, [itemStatus, storeStatus, noteStatus, dispatch]);

    useEffect(() => {
        if (!selectedStore && stores.length > 0) {
            dispatch(setSelectedStore(stores[0]));
        }
    }, [selectedStore, stores, dispatch]);

    let content

    if (noteStatus === 'succeeded' && storeStatus === 'succeeded' && selectedStore) {
        const filteredNotes = [...notes]
            .filter(note => note.store.id === selectedStore.id)
            .sort((a, b) => a.item.name.toUpperCase().localeCompare(b.item.name.toUpperCase()))
            .sort((a, b) => b.item.need - a.item.need)
        content = filteredNotes.map((note) => (
            <ListsItem
                key={note.id}
                note={note} 
            />
        ))

    } else if (itemStatus === 'failed' || storeStatus === 'failed') {
        if (itemStatus === 'failed') {
            content = <div>{itemsError}</div>
        }
        if (storeStatus === 'failed') {
            content = <div>{storesError}</div>
        }
    }

    return (
        <div>
            {content}
        </div>
    )
}

export default Lists
