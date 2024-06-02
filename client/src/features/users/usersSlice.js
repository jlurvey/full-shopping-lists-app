//src/features/users/usersSlice.js

import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import axios from 'axios'

const usersAdapter = createEntityAdapter({
    selectId: user => user.id
})

export const initialState = usersAdapter.getInitialState({
    status: 'idle',
    error: null,
    currentUser: null
})

const API_URL = 'http://localhost:5555/api'

axios.defaults.withCredentials = true;

export const signup = createAsyncThunk('users/signup', async (userData, { rejectWithValue }) => {
    try {
        const resp = await axios.post(`${API_URL}/signup`, userData);
        return resp.data;
    } catch (error) {
        console.error(error.response.data);
        return rejectWithValue(error.response.data.error);
    }
});

export const login = createAsyncThunk('users/login', async (userData, { rejectWithValue }) => {
    try {
        const resp = await axios.post(`${API_URL}/login`, userData);
        return resp.data;
    } catch (error) {
        console.error(error.response.data);
        return rejectWithValue(error.response.data.error);
    }
});

export const checkSession = createAsyncThunk('users/checkSession', async (_, { rejectWithValue }) => {
    try {
        const resp = await axios.get(`${API_URL}/check_session`);
        return resp.data;
    } catch (error) {
        console.error(error.response.data);
        return rejectWithValue(error.response.data.error);
    }
});

export const logout = createAsyncThunk('users/logout', async (_, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/logout`);
        return null;
    } catch (error) {
        console.error(error.response.data);
        return rejectWithValue(error.response.data.error);
    }
});

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload
        },
        resetState: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(signup.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.status = 'succeeded';
                usersAdapter.addOne(state, action.payload);
                state.currentUser = action.payload;
            })
            .addCase(signup.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            .addCase(login.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentUser = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            .addCase(checkSession.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(checkSession.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentUser = action.payload;
            })
            .addCase(checkSession.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            .addCase(logout.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(logout.fulfilled, (state) => {
                state.status = 'succeeded';
                state.currentUser = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            });
    },
});

export default usersSlice.reducer;

export const { selectAll: selectAllUsers, selectById: selectUserById } = usersAdapter.getSelectors((state) => state.users);

export const { setCurrentUser, resetState  } = usersSlice.actions
