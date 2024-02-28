//src/store.js

import { configureStore } from '@reduxjs/toolkit'
import itemsReducer from './features/items/itemsSlice'
import storesReducer from './features/stores/storesSlice'
import notesReducer from './features/notes/notesSlice'

const store = configureStore({
    reducer: {
        items: itemsReducer,
        stores: storesReducer,
        notes: notesReducer,
    }
});

export default store;