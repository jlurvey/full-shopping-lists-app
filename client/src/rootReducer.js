import { combineReducers } from '@reduxjs/toolkit';
import itemsReducer, { initialState as itemsInitialState } from './features/items/itemsSlice';
import storesReducer, { initialState as storesInitialState } from './features/stores/storesSlice';
import notesReducer, { initialState as notesInitialState } from './features/notes/notesSlice';
import categoriesReducer, { initialState as categoriesInitialState } from './features/categories/categoriesSlice';
import usersReducer, { initialState as usersInitialState } from './features/users/usersSlice';

const appReducer = combineReducers({
    items: itemsReducer,
    stores: storesReducer,
    notes: notesReducer,
    categories: categoriesReducer,
    users: usersReducer,
});

const rootReducer = (state, action) => {
    if (action.type === 'users/resetState') {
        state = {
            items: itemsInitialState,
            stores: storesInitialState,
            notes: notesInitialState,
            categories: categoriesInitialState,
            users: usersInitialState,
        };
    }
    return appReducer(state, action);
};

export default rootReducer;