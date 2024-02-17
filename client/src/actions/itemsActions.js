import axios from 'axios'
import {
    FETCH_ITEMS_REQUEST,
    FETCH_ITEMS_SUCCESS,
    FETCH_ITEMS_FAILURE,
    ADD_ITEM_REQUEST,
    ADD_ITEM_SUCCESS,
    ADD_ITEM_FAILURE,
    UPDATE_ITEM_REQUEST,
    UPDATE_ITEM_SUCCESS,
    UPDATE_ITEM_FAILURE,
    DELETE_ITEM_REQUEST,
    DELETE_ITEM_SUCCESS,
    DELETE_ITEM_FAILURE,
  } from './actionTypes';

export const fetchItemsRequest = () => ({
    type: FETCH_ITEMS_REQUEST,
});

export const fetchItemsSuccess = (items) => ({
    type: FETCH_ITEMS_SUCCESS,
    payload: items,
});

export const fetchItemsFailure = (error) => ({
    type: FETCH_ITEMS_FAILURE,
    payload: error,
});

export const addItemRequest = (item) => ({
    type: ADD_ITEM_REQUEST,
    payload: item,
});

export const addItemSuccess = (item) => ({
    type: ADD_ITEM_SUCCESS,
    payload: item,
});

export const addItemFailure = (error) => ({
    type: ADD_ITEM_FAILURE,
    payload: error, 
});

export const updateItemRequest = (item) => ({
    type: UPDATE_ITEM_REQUEST,
    payload: item,
});

export const updateItemSuccess = (item) => ({
    type: UPDATE_ITEM_SUCCESS,
    payload: item,
});

export const updateItemFailure = (error) => ({
    type: UPDATE_ITEM_FAILURE,
    payload: error, 
});

export const deleteItemRequest = (itemId) => ({
    type: DELETE_ITEM_REQUEST,
    payload: itemId,
});

export const deleteItemSuccess = (itemId) => ({
    type: DELETE_ITEM_SUCCESS,
    payload: itemId,
});

export const deleteItemFailure = (error) => ({
    type: DELETE_ITEM_FAILURE,
    payload: error, 
});

const BASE_URL = 'http://localhost:5555';

export const fetchItems = () => {
    return async (dispatch) => {
        dispatch(fetchItemsRequest());
        try {
            const resp = await axios.get(`${BASE_URL}/items`);
            dispatch(fetchItemsSuccess(resp.data));
        } catch (error) {
            dispatch(fetchItemsFailure(error.message));
        }
    };
};

export const addItem = (item) => {
    return async (dispatch) => {
        dispatch(addItemRequest());
        try {
            const resp = await axios.get(`${BASE_URL}/items`, item);
            dispatch(addItemSuccess(resp.data));
        } catch (error) {
            dispatch(addItemFailure(error.message));
        }
    };
};

export const updateItem = (itemId, updatedItem) => {
    return async (dispatch) => {
        dispatch(updateItemRequest());
        try {
            const resp = await axios.get(`${BASE_URL}/items/${itemId}`, updatedItem);
            dispatch(updateItemSuccess(resp.data));
        } catch (error) {
            dispatch(updateItemFailure(error.message));
        }
    };
};





