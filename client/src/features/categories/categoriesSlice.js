//src/features/items/itemsSlice.js

import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import axios from 'axios'
import { fetchItems } from "../items/itemsSlice";

const categoriesAdapter = createEntityAdapter({
    selectId: category => category.id
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

export const addCategory = createAsyncThunk('categories/addCategory', async (initialCategory) => {
    try {
        const resp = await axios.post(`${API_URL}/categories`, initialCategory)
        return resp.data
    } catch (error) {
        console.error(error.response.data);
        throw error.response.data;
    }
});

export const updateCategory = createAsyncThunk('categories/updateCategory', async ({ categoryId, updatedCategory }) => {
    try {
        const resp = await axios.patch(`${API_URL}/categories/${categoryId}`, updatedCategory);
        return resp.data;
    } catch (error) {
        console.error(error.response.data);
        throw error.response.data;
    }
});

export const deleteCategory = createAsyncThunk('categories/deleteCategory', async (categoryId, { dispatch, getState }) => {
    try {
        await axios.delete(`${API_URL}/categories/${categoryId}`);
        await dispatch(fetchItems());
        return categoryId
    } catch (error) {
        console.error(error.response.data);
        throw error.response.data;
    }
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
                categoriesAdapter
                    .upsertMany(state, action.payload.sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase())));
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addCategory.fulfilled, categoriesAdapter.addOne)
            .addCase(addCategory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateCategory.fulfilled, categoriesAdapter.upsertOne)
            .addCase(deleteCategory.fulfilled, categoriesAdapter.removeOne);
    },
});

export default categoriesSlice.reducer

export const { selectAll: selectAllCategories, selectById: selectCategoryById } = categoriesAdapter.getSelectors(state => state.categories);