//src/features/items/itemsList.js

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"
import { selectAllItems, fetchItems, } from "../../features/items/itemsSlice";
import { fetchStores, selectAllStores } from "../../features/stores/storesSlice";
import { fetchCategories, selectAllCategories } from "../../features/categories/categoriesSlice"
import Item from "./Item"
import AddItemForm from "./AddItemForm";

function ItemsList() {
    const dispatch = useDispatch()
    const items = useSelector(selectAllItems)
    const itemStatus = useSelector((state) => state.items.status)
    //const itemError = useSelector((state) => state.items.error)
    const stores = useSelector(selectAllStores)
    const storeStatus = useSelector((state) => state.stores.status)
    //const storeError = useSelector((state) => state.stores.error)
    const categories = useSelector(selectAllCategories)
    const categoryStatus = useSelector((state) => state.categories.status)
    //const categoryError = useSelector((state) => state.categories.error)

    useEffect(() => {
        if (itemStatus === 'idle') {
            dispatch(fetchItems())
        }
        if (storeStatus === 'idle') {
            dispatch(fetchStores())
        }
        if (categoryStatus === 'idle') {
            dispatch(fetchCategories())
        }
    }, [itemStatus, storeStatus, categoryStatus, dispatch])

    const renderItems = () => {
        if (itemStatus === 'succeeded' && categoryStatus === 'succeeded' && storeStatus === 'succeeded') {
            const sortedItems = items
                .slice()
                .sort((a, b) => b.need - a.need || a.name.toUpperCase().localeCompare(b.name.toUpperCase()))
            console.log(categories)

            
            const sortedCats = categories
                .slice()
                console.log(stores)
            const sortedStores = stores
            .slice()
            .sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()))

            return (
                <>
                    <AddItemForm categories={sortedCats} items={sortedItems}/>
                    <li className='topRow'>
                        <span>Item Name</span>
                        <span>Category</span>
                        <span>Store Name</span>
                        <span className='actions'>Actions</span>
                    </li>
                    {sortedItems.map((item) => (
                        <Item
                            key={item.id}
                            item={item}
                            stores={sortedStores}
                            categories={sortedCats}
                        />
                    ))}
                </>
            );
        }

        return null;
    };

    return <div>{renderItems()}</div>
}

export default ItemsList