//src/features/items/AddToStoreForm.js

import React, { useState } from "react";
import { useDispatch } from "react-redux"
import { addNote } from "../notes/notesSlice";
import { selectAllStores } from "../stores/storesSlice";

function ListsForm({ item, stores }) {

    //stores needs to be rendered in ItemsList
    
    const dispatch = useDispatch()

    const dStore = [...stores].sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase())) // test store dropdown

    const [description, setDescription] = useState('')
    const [dropdownStore, setDropdownStore] = useState('')

    //after component renders
    //[...stores].sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()))

    const [addRequestStatus, setAddRequestStatus] = useState('idle')

    const handleDescriptionChange = (e) => setDescription(e.target.value)
    const handleDropdownStoreChange = (e) => setDropdownStore(e.target.value)



    const canAdd = [description, dropdownStore].every(Boolean) && addRequestStatus === 'idle'

    /* const handleSubmit = async (e) => {
        e.preventDefault();
        if (canAdd) {
            try {
                setAddRequestStatus('pending')
                const addedItem = await dispatch(addItem({ name, category, need: true })).unwrap()
                await dispatch(addNote({
                    description,
                    store_id: selectedStore.id,
                    item_id: addedItem.id
                })).unwrap()
                setName('')
                setCategory('')
                setDescription('')
            } catch (error) {
                console.error('Item not added to store:', error)
            } finally {
                setAddRequestStatus('idle')
            }
        }
    } */

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
                        value={dropdownStore}
                        onChange={handleDropdownStoreChange}
                    >
                        {stores.map((store) => (
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

export default ListsForm
