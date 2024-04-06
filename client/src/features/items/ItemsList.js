//src/features/items/itemsList.js

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"
import { selectAllItems, fetchItems, } from "./itemsSlice";
import { fetchStores, selectAllStores } from "../stores/storesSlice";
import {fetchCategories, selectAllCategories} from "../categories/categoriesSlice"
import Item from "./Item"
import AddItemForm from "./AddItemForm";

function ItemsList() {
    const dispatch = useDispatch()
    const items = useSelector(selectAllItems)
    const itemStatus = useSelector((state) => state.items.status)
    const itemError = useSelector((state) => state.items.error)
    const stores = useSelector(selectAllStores)
    const storeStatus = useSelector((state) => state.stores.status)
    const storeError = useSelector((state) => state.stores.error)
    const categories = useSelector(selectAllCategories)

    useEffect(() => {
        if (itemStatus === 'idle') {
            dispatch(fetchItems())
        }
        if (storeStatus === 'idle') {
            dispatch(fetchStores())
        }
        dispatch(fetchCategories());
    }, [itemStatus, storeStatus, dispatch])

    console.log(categories)
    console.log(items)
    
    let content

    if (itemStatus === 'succeeded') {
        const sortedItems = [...items]
            .sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()))
            .sort((a, b) => b.need - a.need)
        content = sortedItems.map((item) => (
            <Item
                key={item.id}
                item={item}
                stores={stores}
            />
        ))
    } else if (itemStatus === 'failed') {
        content = <div>{itemError}</div>
    }

    return (
        <div>
            <AddItemForm />
            {content}
        </div>
    );
}

export default ItemsList