//src/features/stores/storesSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    stores: [],
    status: 'idle',
    error: null,
}

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

const storesSlice = createSlice({
    name: 'stores',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchStores.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchStores.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.stores = state.stores.concat(action.payload)
            })
            .addCase(fetchStores.rejected, (state, action) => {
                state.status = 'failed'
                state.stores = action.error.message
            })
            .addCase(addStore.fulfilled, (state, action) => {
                state.stores.push(action.payload)
            })
            .addCase(addStore.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateStore.fulfilled, (state, action) => {
                const updatedStore = action.payload;
                state.stores = state.stores.map(store => (store.id === updatedStore.id ? updatedStore : store));
            })
            .addCase(deleteStore.fulfilled, (state, action) => {
                state.stores = state.stores.filter(store => store.id !== action.payload);
            });
    },
});