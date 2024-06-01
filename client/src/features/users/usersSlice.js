//src/features/users/usersSlice.js

import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import axios from 'axios'

const usersAdapter = createEntityAdapter({
    selectId: user => user.id
})

const initialState = usersAdapter.getInitialState({
    status: 'idle',
    error: null,
    currentUser: null
})

const API_URL = 'http://localhost:5555'

export const signup = createAsyncThunk('users/signup', async (initialUser) => {
    try {
        const resp = await axios.post(`${API_URL}/signup`, initialUser)
        return resp.data
    } catch (error) {
        console.error(error.response.data);
        throw error.response.data;
    }
});
