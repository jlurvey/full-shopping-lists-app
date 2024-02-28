//src/features/notes/notesSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    notes: [],
    status: 'idle',
    error: null,
}

const API_URL = 'http://localhost:5555'

export const fetchNotes = createAsyncThunk('notes/fetchNotes', async () => {
    const resp = await axios.get(`${API_URL}/notes`)
    return resp.data
});

export const addNote = createAsyncThunk('notes/addNote', async (initialNote) => {
    try {
        const resp = await axios.post(`${API_URL}/notes`, initialNote)
        return resp.data
    } catch (error) {
        console.error(error.response.data);
        throw error.response.data;
    }
});

export const updateNote = createAsyncThunk('notes/updateNote', async ({ noteId, updatedNote }) => {
    try {
        console.log(updatedNote)
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
                state.notes = state.notes.concat(action.payload)
            })
            .addCase(fetchNotes.rejected, (state, action) => {
                state.status = 'failed'
                state.notes = action.error.message
            })
            .addCase(addNote.fulfilled, (state, action) => {
                state.notes.push(action.payload)
            })
            .addCase(addNote.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateNote.fulfilled, (state, action) => {
                const updatedNote = action.payload;
                state.notes = state.notes.map(note => (note.id === updatedNote.id ? updatedNote : note));
            })
            .addCase(deleteNote.fulfilled, (state, action) => {
                state.notes = state.notes.filter(note => note.id !== action.payload);
            });
    },
});

export default notesSlice.reducer

export const selectAllNotes = (state) => state.notes.notes
export const selectNoteById = (state, noteId) => state.notes.notes.find((note) => note.id === noteId)
