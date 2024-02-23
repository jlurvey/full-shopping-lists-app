import { createSlice, createAsyncThunk, applyMiddleware } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    items: [],
    status: 'idle',
    error: null,
}

const API_URL = 'http://localhost:5555'

export const fetchItems = createAsyncThunk('items/fetchItems', async () => {
    const resp = await axios.get(`${API_URL}/items`)
    return resp.data
});

export const addItem = createAsyncThunk('items/addItem', async (initialItem) => {
    const resp = await axios.post(`${API_URL}/items`, initialItem)
    return resp.data
});

export const updateItem = createAsyncThunk('items/updateItem', async ({itemId, updatedItem}) => {
    const resp = await axios.patch(`${API_URL}/items/${itemId}`, updatedItem);
    return resp.data;
});

export const deleteItem = createAsyncThunk('items/deleteItem', async (itemId) => {
    await axios.delete(`${API_URL}/items/${itemId}`);
    return itemId
});