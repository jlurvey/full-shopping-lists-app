//src/features/items/addItemForm.js

import React, { useState } from "react";
import { useDispatch } from "react-redux"

import { addItem } from "../../features/items/itemsSlice";

function AddItemForm({ categories }) {

    const [name, setName] = useState('');
    const [category, setCategory] = useState(categories[0].name)
    const [addRequestStatus, setAddRequestStatus] = useState('idle')

    const dispatch = useDispatch()
    const handleNameChange = (e) => setName(e.target.value)
    const handleCategoryChange = (e) => setCategory(e.target.value)

    const canAdd = [name, category].every(Boolean) && addRequestStatus === 'idle'

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (canAdd) {
            try {
                setAddRequestStatus('pending')
                await dispatch(addItem({ name, category, need: true })).unwrap()
                setName('')
            } catch (error) {
                console.error('Failed to add item')
            } finally {
                setAddRequestStatus('idle')
            }
        }
    }

    return (
        <div>
            <form className='add'
                onSubmit={handleSubmit}>
                <div className="form-group">
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
                    <button className='add' type='submit'>Add Item</button>
                </div>
            </form>
        </div>
    )
};

export default AddItemForm
