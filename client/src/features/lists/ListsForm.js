//src/features/items/ListsForm.js

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux"

import { addItem } from "../items/itemsSlice";
import { selectStoreById, setSelectedStore } from "../stores/storesSlice";

function ListsForm({ stores, selectedStore }) {

    console.log(selectedStore)

    const [name, setName] = useState('');
    const [category, setCategory] = useState('')
    const [noteDesc, setNoteDesc] = useState('')
    const [addRequestStatus, setAddRequestStatus] = useState('idle')



    const dispatch = useDispatch()
    const handleNameChange = (e) => setName(e.target.value)
    const handleCategoryChange = (e) => setCategory(e.target.value)
    const handleNoteDescChange = (e) => setNoteDesc
    const handleStoreChange = (e) => dispatch(setSelectedStore(stores.find(store => store.id === parseInt(e.target.value))))

    const canAdd = [name, category].every(Boolean) && addRequestStatus === 'idle'

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (canAdd) {
            try {
                setAddRequestStatus('pending')
                await dispatch(addItem({ name, category, need: true })).unwrap()
                setName('')
                setCategory('')
            } catch (error) {
                console.error('Failed to add item')
            } finally {
                setAddRequestStatus('idle')
            }
        }
    }

    return (
        <div>
            <form
                className='add'
                onSubmit={handleSubmit}>
                Item Name:
                <input
                    type='text'
                    name='name'
                    value={name}
                    onChange={handleNameChange}
                />
                Category:
                <input
                    type='text'
                    name='category'
                    value={category}
                    onChange={handleCategoryChange}
                />
                Note:
                <input
                    type='text'
                    name='noteDesc'
                    value={noteDesc}
                    onChange={handleNoteDescChange}
                />
                Store:
                <select
                    form='addItem'
                    type='select'
                    name='store'
                    value={selectedStore ? selectedStore.id : ''}
                    onChange={handleStoreChange}
                >
                    {stores.map((store) => (
                        <option key={store.id} value={store.id}>
                            {store.name}
                        </option>
                    ))}
                </select>
                <button className='add' type='submit'>Add Item</button>
            </form>
        </div>
    )
};

export default ListsForm
