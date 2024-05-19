import React from "react";
import { deleteItem, updateItem } from "../../features/items/itemsSlice";
import { useDispatch } from "react-redux";

function ListsItem({ item, description }) {

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
            <span>{item.category.name}</span>
            <span>{description}</span>
            <span className='actions'>
                <button className={item.need ? 'need' : 'doNotNeed'} onClick={handleNeedChange}>
                    {item.need ? <i className="fa fa-minus"></i> : <i className="fa fa-plus"></i>}
                </button>
                <button className='delete' onClick={handleDelete}><i className="fa fa-trash"></i></button>
            </span>
        </li>
    );
}
export default ListsItem;