//src/features/items/AddToStoreForm.js

import React, { useState } from "react";
import { useDispatch } from "react-redux"
import { addNote } from "../notes/notesSlice";

function AddToStoreForm({ item, stores }) {

    const formStores = [...stores].sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()))
    
    const dispatch = useDispatch()

    const [description, setDescription] = useState('')
    const [formStore, setFormStore] = useState(formStores[0].id)

    console.log(formStore)

    const [addRequestStatus, setAddRequestStatus] = useState('idle')

    const handleDescriptionChange = (e) => setDescription(e.target.value)
    const handleFormStoreChange = (e) => setFormStore(parseInt(e.target.value))

    const canAdd = [item.id, description, formStore].every(Boolean) && addRequestStatus === 'idle'

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
            } catch (error) {
                console.error('Item not added to store:', error)
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
                <label>
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
                </label>
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
        </div >
    )
};

export default AddToStoreForm
