import { createSlice, createAsyncThunk} from '@reduxjs/toolkit'
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

const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers : {},
    extraReducers(builder) {
        builder
        .addCase(fetchItems.pending, (state, action) => {
            state.status = 'loading'
        })
        .addCase(fetchItems.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.items = state.items.concat(action.payload)
        })
        .addCase(fetchItems.fulfilled, (state, action) => {
            state.status = 'failed'
            state.items = action.error.message
        })
        .addCase(addItem.fulfilled, (state, action) => {
            state.items.push(action.payload)
        })
        .addCase(updateItem.fulfilled, (state, action) => {
            const updatedItem = action.payload;
            state.items = state.items.map(item => (item.id === updatedItem.id ? updatedItem : item));
        })
        .addCase(deleteItem.fulfilled, (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        });
    },
});

export default itemsSlice.reducer

export const selectAllItems = (state) => state.items.items
export const selectItemById = (state, itemId) => state.items.items.find((item) => item.id ===itemId)
