//src/features/items/itemsList.js

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"

import { selectAllItems, fetchItems } from "./itemsSlice";

export const ItemsList = () => {
    const dispatch = useDispatch()
    const items = useSelector(selectAllItems)
    const itemStatus = useSelector((state) => state.items.status)
    const error = useSelector((state) => state.items.error)

    useEffect(() => {
        if (itemStatus === 'idle') {
            dispatch(fetchItems())
        }
    }, [itemStatus, dispatch])

    let content = items
    console.log(content)

    return (
        <div>
        </div>
    );
}

export default ItemsList