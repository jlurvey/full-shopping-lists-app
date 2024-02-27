//src/features/stores/StoresList.js

//src/features/items/itemsList.js

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"
import { selectAllStores, fetchStores } from "./storesSlice";
import Store from "./Store"
import AddStoreForm from "./AddStoreForm";

function StoresList() {
    const dispatch = useDispatch()
    const stores = useSelector(selectAllStores)
    const storeStatus = useSelector((state) => state.stores.status)
    const error = useSelector((state) => state.stores.error)

    useEffect(() => {
        if (storeStatus === 'idle') {
            dispatch(fetchStores())
        }
    }, [storeStatus, dispatch])

    let content

    if (storeStatus === 'succeeded') {
        const sortedStores = [...stores]
            .sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()))
            .sort((a, b) => b.need - a.need)
        content = sortedStores.map((store) => (
            <Store
                key={store.id}
                store={store}
            />
        ))
    } else if (storeStatus === 'failed') {
        content = <div>{error}</div>
    }

    return (
        <div>
            {/* <AddStoreForm /> */}
            {content}
        </div>
    );
}

export default StoresList