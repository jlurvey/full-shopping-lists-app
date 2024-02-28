import React from "react";
import { deleteItem, updateItem } from "./itemsSlice";
import { useDispatch } from "react-redux";

function Item({ item }) {

    const dispatch = useDispatch();

    const handleDelete = async () => {
        await dispatch(deleteItem(item.id))
    };

    const handleNeedChange = async () => {
        const updatedItem = { need: !item.need }
        await dispatch(updateItem({ itemId: item.id, updatedItem }))
    };


    return (
        <li className={item.need ? 'need' : 'doNotNeed'}>
            <span>{item.name}</span>
            <span>{item.category}</span>
            <span>
                <ul>
                    {item.notes
                        .map((note) => note.store.name)
                        .sort()
                        .map((storeName) =>
                            <li
                                className={item.need ? 'need' : 'doNotNeed'}
                                key={storeName}
                            >
                                {storeName}
                            </li>)
                    }
                </ul>
            </span>

            <div>
                <button>Add to Store</button>
                <button
                    className={item.need ? 'need' : 'doNotNeed'}
                    onClick={handleNeedChange}
                >
                    {item.need ? 'Need' : 'Do not need'}
                </button>
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
export default Item;