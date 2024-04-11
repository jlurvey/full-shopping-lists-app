//src/features/stores/StoresList.js

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"
import { selectAllStores, fetchStores } from "../../features/stores/storesSlice.js";
import Store from "./Store"
import AddStoreForm from "./AddStoreForm.js";

function StoresList() {
    const dispatch = useDispatch()
    const stores = useSelector(selectAllStores)
    const storeStatus = useSelector((state) => state.stores.status)
    const storeError = useSelector((state) => state.stores.error)

    useEffect(() => {
        if (storeStatus === 'idle') {
            dispatch(fetchStores())
        }
    }, [storeStatus, dispatch])

    const renderStores = () => {

        if (storeStatus === 'failed') {
            return <div>{storeError}</div>
        }

        if (storeStatus === 'succeeded') {
            const sortedStores = stores.slice()
                .sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()))
            return (
                <>
                    <AddStoreForm />
                    {sortedStores.map((store) => (
                        <Store
                            key={store.id}
                            store={store}
                        />
                    ))}
                </>
            );
        }
        return null;
    };

    return <div>{renderStores()}</div>
}

export default StoresList