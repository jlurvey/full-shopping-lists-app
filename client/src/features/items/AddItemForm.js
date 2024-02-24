//src/features/items/addItemForm.js

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux"

import { addItem } from "./itemsSlice";

function AddItemForm() {

    const [name, setName] = useState('');
    const [category, setCategory] = useState('')
    const [addRequestStatus, setAddRequestStatus] = useState('idle')

    const dispatch = useDispatch()
    const handleNameChange = (e) => setName(e.target.value)
    const handleCategoryChange = (e) => setCategory(e.target.value)

    const canAdd = [name, category].every(Boolean) && addRequestStatus === 'idle'



    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(addRequestStatus)
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
            <form className='add' 
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
                <button className='add' type='submit'>Add Item</button>
            </form>
        </div>
    )
};

export default AddItemForm
