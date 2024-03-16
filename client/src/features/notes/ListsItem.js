import React from "react";
import { deleteItem, updateItem } from "../items/itemsSlice";
import { useDispatch } from "react-redux";

function ListsItem({ note }) {

    const dispatch = useDispatch();

    const handleDelete = async () => {
        await dispatch(deleteItem(note.item.id))
    };

    const handleNeedChange = async () => {
        console.log(note.item.need)
        console.log(note.item.id)
        const updatedItem = { need: !note.item.need }
        await dispatch(updateItem({ itemId: note.item.id, updatedItem }))
    };

    return (
        <li className={note.item.need ? 'need' : 'doNotNeed'}>
            <span>{note.item.name}</span>
            <span>{note.item.category}</span>
            <span>{note.description}</span>
            <div>
                <button
                    className={note.item.need ? 'need' : 'doNotNeed'}
                    onClick={handleNeedChange}
                >
                    {note.item.need ? 'Need' : 'Do not need'}
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
export default ListsItem;