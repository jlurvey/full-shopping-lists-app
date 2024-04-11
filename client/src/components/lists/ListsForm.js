//src/features/items/ListsForm.js

import React, { useState } from "react";
import { useDispatch } from "react-redux"
import { addItem, } from "../../features/items/itemsSlice";
import { addNote, } from "../../features/notes/notesSlice";
import { setSelectedStore } from "../../features/stores/storesSlice";

function ListsForm({ stores, selectedStore, categories }) {

    const [name, setName] = useState('');
    const [category, setCategory] = useState(categories[0].name)
    const [description, setDescription] = useState('')
    const [addRequestStatus, setAddRequestStatus] = useState('idle')


    const dispatch = useDispatch()
    const handleNameChange = (e) => setName(e.target.value)
    const handleCategoryChange = (e) => setCategory(e.target.value)
    const handleDescriptionChange = (e) => setDescription(e.target.value)
    const handleStoreChange = (e) => dispatch(setSelectedStore(stores.find(store => store.id === parseInt(e.target.value))))

    const canAdd = [name, category, description].every(Boolean) && addRequestStatus === 'idle'

    const handleSubmit = async (e) => {
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
                setDescription('')
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
                    Filter By Store:
                    <select
                        form='addItem'
                        type='select'
                        name='store'
                        value={selectedStore ? selectedStore.id : ''}
                        onChange={handleStoreChange}
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
                Item Name:
                <input
                    type='text'
                    name='name'
                    value={name}
                    onChange={handleNameChange}
                />
                Category:
                <select
                    form='addItem'
                    type='select'
                    name='category'
                    value={category}
                    onChange={handleCategoryChange}
                >
                    {categories
                        .map((category) => (
                            <option
                                key={category.name}
                                value={category.name}
                            >
                                {category.name}
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
        </div >
    )
};

export default ListsForm
