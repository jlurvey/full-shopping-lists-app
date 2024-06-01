//src/store.js

import { configureStore } from '@reduxjs/toolkit'
import itemsReducer from './features/items/itemsSlice'
import storesReducer from './features/stores/storesSlice'
import notesReducer from './features/notes/notesSlice'
import categoriesReducer from './features/categories/categoriesSlice'
import usersReducer from './features/users/usersSlice'

const store = configureStore({
    reducer: {
        items: itemsReducer,
        stores: storesReducer,
        notes: notesReducer,
        categories: categoriesReducer,
        users: usersReducer,
    }
});

export default store;