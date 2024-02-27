//src/store.js

import { configureStore } from '@reduxjs/toolkit'
import itemsReducer from './features/items/itemsSlice'
import storesReducer from './features/stores/storesSlice'

const store = configureStore({
    reducer: {
        items: itemsReducer,
        stores: storesReducer
    }
});

export default store;