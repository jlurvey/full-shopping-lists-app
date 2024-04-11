//src/features/stores/addStoreForm.js

import React, { useState } from "react";
import { useDispatch } from "react-redux"

import { addStore } from "../../features/stores/storesSlice";

function AddStoreForm() {

    const [name, setName] = useState('');
    const [addRequestStatus, setAddRequestStatus] = useState('idle')

    const dispatch = useDispatch()
    const handleNameChange = (e) => setName(e.target.value)

    const canAdd = [name].every(Boolean) && addRequestStatus === 'idle'



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (canAdd) {
            try {
                setAddRequestStatus('pending')
                await dispatch(addStore({ name })).unwrap()
                setName('')
            } catch (error) {
                console.error('Failed to add store')
            } finally {
                setAddRequestStatus('idle')
            }
        }
    }

    return (
        <div>
            <form className='add' 
            onSubmit={handleSubmit}>
                Store Name:
                <input
                    type='text'
                    name='name'
                    value={name}
                    onChange={handleNameChange}
                />
                <button className='add' type='submit'>Add Store</button>
            </form>
        </div>
    )
};

export default AddStoreForm
