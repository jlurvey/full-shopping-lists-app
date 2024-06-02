//src/features/items/itemsSlice.js

import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import axios from 'axios'

const itemsAdapter = createEntityAdapter({
    selectId: item => item.id
});

export const initialState = itemsAdapter.getInitialState({
    status: 'idle',
    error: null,
});

const API_URL = 'http://localhost:5555'

export const fetchItems = createAsyncThunk('items/fetchItems', async () => {
    const resp = await axios.get(`${API_URL}/items`)
    return resp.data
});

export const addItem = createAsyncThunk('items/addItem', async (initialItem, { rejectWithValue }) => {
    try {
        const resp = await axios.post(`${API_URL}/items`, initialItem)
        return resp.data
    } catch (error) {
        console.error(error.response.data);
        return rejectWithValue(error.response.data)
    }
});

export const updateItem = createAsyncThunk('items/updateItem', async ({ itemId, updatedItem }) => {
    try {
        const resp = await axios.patch(`${API_URL}/items/${itemId}`, updatedItem);
        return resp.data;
    } catch (error) {
        console.error(error.response.data);
        throw error.response.data;
    }
});

export const deleteItem = createAsyncThunk('items/deleteItem', async (itemId) => {
    await axios.delete(`${API_URL}/items/${itemId}`);
    return itemId
});

const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchItems.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.status = 'succeeded';
                itemsAdapter.upsertMany(state, action.payload);
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addItem.fulfilled, itemsAdapter.addOne)
            .addCase(addItem.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.error
            })
            .addCase(updateItem.fulfilled, itemsAdapter.upsertOne)
            .addCase(deleteItem.fulfilled, itemsAdapter.removeOne)
    },
});

export default itemsSlice.reducer

export const { selectAll: selectAllItems, selectById: selectItemById } = itemsAdapter.getSelectors(state => state.items);