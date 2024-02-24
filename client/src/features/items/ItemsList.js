//src/features/items/itemsList.js

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"
import { selectAllItems, fetchItems } from "./itemsSlice";
import Item from "./Item"

function ItemsList() {
    const dispatch = useDispatch()
    const items = useSelector(selectAllItems)
    const itemStatus = useSelector((state) => state.items.status)
    const error = useSelector((state) => state.items.error)

    useEffect(() => {
        if (itemStatus === 'idle') {
            dispatch(fetchItems())
        }
    }, [itemStatus, dispatch])

    let content
    console.log(itemStatus)

    if (itemStatus === 'succeeded') {
        console.log(items)
        const sortedItems = [...items]
            .sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()))
            .sort((a, b) => b.need - a.need)
        content = sortedItems.map((item) => (
            <Item
                key={item.id}
                item={item}
            />
        ))
    } else if (itemStatus === 'failed') {
        content = <div>{error}</div>
    }

    return (
        <div>
            {content}
        </div>
    );
}

export default ItemsList