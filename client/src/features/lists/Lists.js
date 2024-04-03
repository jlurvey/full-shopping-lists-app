import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"
import { selectAllItems, fetchItems } from "../items/itemsSlice";
import { selectAllStores, fetchStores, setSelectedStore } from "../stores/storesSlice";
import ListsItem from "./ListsItem";
import ListsForm from "./ListsForm";
import { selectAllNotes, fetchNotes } from "../notes/notesSlice";

function Lists() {
    const dispatch = useDispatch()
    const items = useSelector(selectAllItems)
    const itemStatus = useSelector((state) => state.items.status)
    const itemsError = useSelector((state) => state.items.error)
    const stores = useSelector(selectAllStores)
    const storeStatus = useSelector((state) => state.stores.status)
    const storesError = useSelector((state) => state.stores.error)
    const notes = useSelector(selectAllNotes)
    const noteStatus = useSelector((state) => state.notes.status)
    const notesError = useSelector((state) => state.notes.error)
    const selectedStore = useSelector((state) => state.stores.selectedStore)

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
    }, [itemStatus, storeStatus, noteStatus, items, notes, dispatch]);

    useEffect(() => {
        if (!selectedStore && stores.length > 0) {
            const sortedStores = [...stores].sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()))
            dispatch(setSelectedStore(sortedStores[0]));
        }
    }, [selectedStore, stores, dispatch]);

    let content

    if (itemStatus === 'succeeded' && storeStatus === 'succeeded' && noteStatus === 'succeeded' && selectedStore) {
        const filteredItems = [...items]
            .filter(item => item.notes.some(note => note.store.id === selectedStore.id))
            .sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()))
            .sort((a, b) => b.need - a.need)
        content = filteredItems.map((item) => (
            <ListsItem
                key={item.id}
                item={item}
                description={item.notes.find(note=>note.store_id === selectedStore.id).description}
            />
        ))

    } else if (itemStatus === 'failed' || storeStatus === 'failed' || noteStatus === 'failed') {
        if (itemStatus === 'failed') {
            content = <div>{itemsError}</div>
        }
        if (storeStatus === 'failed') {
            content = <div>{storesError}</div>
        }
        if (noteStatus === 'failed') {
            content = <div>{notesError}</div>
        }
    }

    return (
        <div>
            <ListsForm
                stores={[...stores].sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()))}
                selectedStore={selectedStore}
            />
            {content}
        </div>
    )
}

export default Lists
