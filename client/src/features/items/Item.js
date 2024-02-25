import React from "react";
import { deleteItem } from "./itemsSlice";
import { useDispatch } from "react-redux";

function Item({ item }) {

    const dispatch = useDispatch();

    const handleDelete = async () => {
            await dispatch(deleteItem(item.id))
        };

    return (
        <li className={item.need ? 'need' : 'doNotNeed'}>
            <span>{item.name}</span>
            <span>{item.store}</span>
            <span>{item.category}</span>
            <div>
                <button className={item.need ? 'need' : 'doNotNeed'}>
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