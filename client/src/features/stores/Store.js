import React from "react";
import { deleteStore } from "./storesSlice";
import { useDispatch } from "react-redux";

function Store({ store }) {
    
    const dispatch = useDispatch();

    const handleDelete = async () => {
        await dispatch(deleteStore(store.id))
    };

        return (
            <li >
                <span>{store.name}</span>
                <div>
                    <button
                        className='delete'
                        onClick={handleDelete}
                    >
                        X
                    </button>
                </div>
            </li>
        );
    }
    export default Store;