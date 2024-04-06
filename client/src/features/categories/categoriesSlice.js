//src/features/items/itemsSlice.js

import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import axios from 'axios'

const categoriesAdapter = createEntityAdapter({
    selectId: category => {
        console.log("Category:", category);
        return category.name
    }
});

const initialState = categoriesAdapter.getInitialState({
    status: 'idle',
    error: null,
});

const API_URL = 'http://localhost:5555'

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
    const resp = await axios.get(`${API_URL}/categories`)
    return resp.data
});

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchCategories.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                categoriesAdapter.upsertMany(state, action.payload);
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    },
});

export default categoriesSlice.reducer

export const { selectAll: selectAllCategories} = categoriesAdapter.getSelectors(state => state.categories);