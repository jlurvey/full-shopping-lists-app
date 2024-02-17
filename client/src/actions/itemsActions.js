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

export const addItemsRequest = (item) => ({
    type: ADD_ITEM_REQUEST,
    payload: item,
});

export const addItemsSuccess = (item) => ({
    type: ADD_ITEM_SUCCESS,
    payload: item,
});

export const addItemsFailure = (error) => ({
    type: ADD_ITEM_FAILURE,
    payload: error, 
});

export const updateItemsRequest = (item) => ({
    type: UPDATE_ITEM_REQUEST,
    payload: item,
});

export const updateItemsSuccess = (item) => ({
    type: UPDATE_ITEM_SUCCESS,
    payload: item,
});

export const updateItemsFailure = (error) => ({
    type: UPDATE_ITEM_FAILURE,
    payload: error, 
});

export const deleteItemsRequest = (itemId) => ({
    type: DELETE_ITEM_REQUEST,
    payload: itemId,
});

export const deleteItemsSuccess = (itemId) => ({
    type: DELETE_ITEM_SUCCESS,
    payload: itemId,
});

export const deleteItemsFailure = (error) => ({
    type: DELETE_ITEM_FAILURE,
    payload: error, 
});




