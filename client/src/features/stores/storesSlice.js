//src/features/stores/storesSlice.js

import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import axios from 'axios'
import { fetchItems } from "../items/itemsSlice";

const storesAdapter = createEntityAdapter({
    selectId: store => store.id,
});

export const initialState = storesAdapter.getInitialState({
    status: 'idle',
    error: null,
    selectedStore: null,
});

const API_URL = '/api'
// const API_URL = 'http://localhost:5555/api'

export const fetchStores = createAsyncThunk('stores/fetchStores', async () => {
    const resp = await axios.get(`${API_URL}/stores`);
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
        const resp = await axios.patch(`${API_URL}/stores/${storeId}`, updatedStore);
        return resp.data;
    } catch (error) {
        console.error(error.response.data);
        throw error.response.data;
    }
});

export const deleteStore = createAsyncThunk('stores/deleteStore', async (storeId, { dispatch, getState }) => {
    try {
        await axios.delete(`${API_URL}/stores/${storeId}`);
        await dispatch(fetchItems());
        return storeId
    } catch (error) {
        console.error(error.response.data);
        throw error.response.data;
    }
});

const storesSlice = createSlice({
    name: 'stores',
    initialState,
    reducers: {
        setSelectedStore: (state, action) => {
            state.selectedStore = action.payload;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchStores.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchStores.fulfilled, (state, action) => {
                state.status = 'succeeded'
                storesAdapter.upsertMany(state, action.payload);
            })
            .addCase(fetchStores.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addStore.fulfilled, storesAdapter.addOne)
            .addCase(addStore.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateStore.fulfilled, storesAdapter.upsertOne)
            .addCase(deleteStore.fulfilled, storesAdapter.removeOne);
    },
});

export default storesSlice.reducer

export const { selectAll: selectAllStores, selectById: selectStoreById } = storesAdapter.getSelectors(state => state.stores);

export const { setSelectedStore } = storesSlice.actions