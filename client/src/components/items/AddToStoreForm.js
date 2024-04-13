//src/features/items/AddToStoreForm.js

import React, { useState } from "react";
import { useDispatch } from "react-redux"
import { addNote } from "../../features/notes/notesSlice";

function AddToStoreForm({ item, stores, onClose }) {

    const formStores = stores.slice().sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()))

    const dispatch = useDispatch()

    const [formStore, setFormStore] = useState(formStores[0].id)
    const [description, setDescription] = useState('')

    const [addRequestStatus, setAddRequestStatus] = useState('idle')

    const handleFormStoreChange = (e) => setFormStore(parseInt(e.target.value))
    const handleDescriptionChange = (e) => setDescription(e.target.value)

    const canAdd = [item.id, formStore, description].every(Boolean) && addRequestStatus === 'idle'

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (canAdd) {
            try {
                setAddRequestStatus('pending')
                await dispatch(addNote({
                    description,
                    store_id: formStore,
                    item_id: item.id
                })).unwrap()
                setDescription('')
                setFormStore(formStores[0].id)
                onClose()
            } catch (error) {
                console.error('Item not added to store:', error)
            } finally {
                setAddRequestStatus('idle')
            }
        }
    }

    const handleClose = () => onClose();


    return (
        <div>
            <form
                className='add'
                onSubmit={handleSubmit}>
                Item: {item.name}
                Category: {item.category}
                Store:
                <select
                    form='addItemToStore'
                    type='select'
                    name='store'
                    value={formStore}
                    onChange={handleFormStoreChange}
                >
                    {formStores.map((store) => (
                        <option
                            key={store.id}
                            value={store.id}
                        >
                            {store.name}
                        </option>
                    ))}
                </select>
                Note:
                <input
                    type='text'
                    name='description'
                    value={description}
                    onChange={handleDescriptionChange}
                />
                <button
                    className='add'
                    type='submit'
                >
                    Add Item to Store
                </button>
            </form>
            <button onClick={handleClose}>Close</button>
        </div >
    )
};

export default AddToStoreForm
