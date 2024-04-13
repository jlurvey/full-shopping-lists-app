import React from "react";
import { deleteStore } from "../../features/stores/storesSlice";
import { useDispatch } from "react-redux";

function Store({ store }) {
    
    const dispatch = useDispatch();

    const handleDelete = async () => {
        await dispatch(deleteStore(store.id))
    };

        return (
            <li >
                <span>{store.name}</span>
                <span className='actions'>
                    <button
                        className='delete'
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </span>
            </li>
        );
    }
    export default Store;