//src/store.js

import { configureStore } from '@reduxjs/toolkit'
import itemsReducer from './features/items/itemsSlice'

const store = configureStore({
    reducer: {
        items: itemsReducer
    }
});

export default store;