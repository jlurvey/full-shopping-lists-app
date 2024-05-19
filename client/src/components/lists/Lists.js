import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"
import { selectAllItems, fetchItems } from "../../features/items/itemsSlice";
import { selectAllStores, fetchStores, setSelectedStore } from "../../features/stores/storesSlice";
import { fetchCategories, selectAllCategories } from "../../features/categories/categoriesSlice"
import ListsItem from "./ListsItem";
import ListsForm from "./ListsForm";

function Lists() {
    const dispatch = useDispatch()
    const items = useSelector(selectAllItems)
    const itemStatus = useSelector((state) => state.items.status)
    const itemError = useSelector((state) => state.items.error)
    const stores = useSelector(selectAllStores)
    const storeStatus = useSelector((state) => state.stores.status)
    const storeError = useSelector((state) => state.stores.error)
    const selectedStore = useSelector((state) => state.stores.selectedStore)
    const categories = useSelector(selectAllCategories)
    const categoryStatus = useSelector((state) => state.categories.status)
    const categoryError = useSelector((state) => state.categories.error)

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
    }, [itemStatus, storeStatus, categoryStatus, dispatch]);

    useEffect(() => {
        if (!selectedStore && stores.length > 0) {
            const sortedStores = [...stores].sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()))
            dispatch(setSelectedStore(sortedStores[0]));
        }
    }, [selectedStore, stores, dispatch]);

    const renderLists = () => {
        if (itemStatus === 'succeeded' && storeStatus === 'succeeded' && selectedStore) {
            const allItems = items.slice()
            const filteredItems = items.slice()
                .filter(item => item.notes.some(note => note.store.id === selectedStore.id))
                .sort((a, b) => b.need - a.need || a.name.toUpperCase().localeCompare(b.name.toUpperCase()))
            const sortedStores = stores.slice()
                .sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()))
            const sortedCats = categories.slice()
                .sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()))

            return (
                <>
                    <ListsForm
                        stores={sortedStores}
                        selectedStore={selectedStore}
                        categories={sortedCats}
                        items={allItems} />
                    <li className='topRow'>
                        <span>Item Name</span>
                        <span>Category</span>
                        <span>Note</span>
                        <span className='actions'>Actions</span>
                    </li>
                    {filteredItems.map((item) => (
                        <ListsItem
                            key={item.id}
                            item={item}
                            description={item.notes.find(note => note.store_id === selectedStore.id).description}
                        />
                    ))}
                </>
            );
        }
        return null;
    };

    return <div>{renderLists()}</div>
}

export default Lists
