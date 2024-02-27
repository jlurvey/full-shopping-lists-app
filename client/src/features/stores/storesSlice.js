//src/features/stores/storesSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    stores: [],
    status: 'idle',
    error: null,
}

item

const API_URL = 'http://localhost:5555'

export const fetchStores = createAsyncThunk('stores/fetchStores', async () => {
    const resp = await axios.get(`${API_URL}/stores`)
    return resp.data
});

export const addStore = createAsyncThunk('stores/addStore', async (initialStore) => {
    try {
        const resp = await axios.post(`${API_URL}/stores`, initialStore)
        return resp.data
    } catch (error) {
        console.error(error.response.data);
        throw error.response.data;
    }
});

export const updateStore = createAsyncThunk('stores/updateStore', async ({ storeId, updatedStore }) => {
    try {
        console.log(updatedStore)
        const resp = await axios.patch(`${API_URL}/stores/${storeId}`, updatedStore);
        return resp.data;
    } catch (error) {
        console.error(error.response.data);
        throw error.response.data;
    }
});

export const deleteStore = createAsyncThunk('stores/deleteStore', async (storeId) => {
    await axios.delete(`${API_URL}/stores/${storeId}`);
    return storeId
});

