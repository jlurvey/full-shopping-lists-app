import React from "react";
import { deleteItem, updateItem } from "./itemsSlice";
import { useDispatch } from "react-redux";

function Item({ item }) {

    console.log(item)    

    const dispatch = useDispatch();

    const handleDelete = async () => {
        await dispatch(deleteItem(item.id))
    };

    const handleNeedChange = async () => {
        const updatedItem = {need: !item.need}
        console.log(updatedItem)
        await dispatch(updateItem({itemId:item.id,updatedItem}))
    };


        return (
            <li className={item.need ? 'need' : 'doNotNeed'}>
                <span>{item.name}</span>
                <span>{item.store}</span>
                <span>{item.category}</span>
                <div>
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