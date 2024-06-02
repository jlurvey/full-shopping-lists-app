//src/features/notes/notesSlice.js

import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import axios from 'axios'
import { fetchItems } from '../items/itemsSlice'

const notesAdapter = createEntityAdapter({
    selectId: note => note.id,
});

export const initialState = notesAdapter.getInitialState({
    status: 'idle',
    error: null,
});

const API_URL = 'http://localhost:5555'

export const fetchNotes = createAsyncThunk('notes/fetchNotes', async () => {
    const resp = await axios.get(`${API_URL}/notes`)
    return resp.data
});

export const addNote = createAsyncThunk('notes/addNote', async (initialNote, { dispatch }) => {
    try {
        const resp = await axios.post(`${API_URL}/notes`, initialNote);
        await dispatch(fetchItems());
        return resp.data;
    } catch (error) {
        console.error(error.response.data);
        throw error.response.data;
    }
});

export const updateNote = createAsyncThunk('notes/updateNote', async ({ noteId, updatedNote }) => {
    try {
        const resp = await axios.patch(`${API_URL}/notes/${noteId}`, updatedNote);
        return resp.data;
    } catch (error) {
        console.error(error.response.data);
        throw error.response.data;
    }
});

export const deleteNote = createAsyncThunk('notes/deleteNote', async (noteId) => {
    await axios.delete(`${API_URL}/notes/${noteId}`);
    return noteId
});

const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchNotes.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchNotes.fulfilled, (state, action) => {
                state.status = 'succeeded'
                notesAdapter.upsertMany(state, action.payload)
            })
            .addCase(fetchNotes.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addNote.fulfilled, notesAdapter.addOne)
            .addCase(addNote.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateNote.fulfilled, notesAdapter.upsertOne)
            .addCase(deleteNote.fulfilled, notesAdapter.removeOne);
    },
});

export default notesSlice.reducer

export const { selectAll: selectAllNotes, selectById: selectNoteById } = notesAdapter.getSelectors(state => state.notes);
