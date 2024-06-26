import React, { useState } from "react";
import AddToStoreForm from "./AddToStoreForm";
import { deleteItem, updateItem } from "../../features/items/itemsSlice";
import { useDispatch } from "react-redux";

function Item({ item, stores, categories }) {

    const dispatch = useDispatch();

    const [showForm, setShowForm] = useState(false);

    const handleDelete = async () => {
        await dispatch(deleteItem(item.id))
    };

    const handleNeedChange = async () => {
        const updatedItem = { need: !item.need }
        await dispatch(updateItem({ itemId: item.id, updatedItem }))
    };

    const handleAddToStore = () => {
        setShowForm(true);
    };

    return (
        <li className={item.need ? 'need' : 'doNotNeed'}>
            <span className='info'>{item.name}</span>
            <span className='info'>{item.category.name}</span>
            <span className='info'>
                <ul>
                    {item.notes
                        .map((note) => note.store.name)
                        .sort((a, b) => a.toUpperCase().localeCompare(b.toUpperCase()))
                        .map((storeName) => (
                            <li
                                className={item.need ? 'store' : 'storeDoNotNeed'}
                                key={storeName}
                            >
                                {storeName}
                            </li>
                        ))}
                </ul>
            </span>
            <span className='actions'>
                <button
                    className={item.need ? 'addToStore' : 'doNotNeed'}
                    onClick={handleAddToStore}
                >
                    Add to Store
                </button>
                <button className={item.need ? 'need' : 'doNotNeed'} onClick={handleNeedChange}>
                    {item.need ? <i className="fa fa-minus" ></i> : <i className="fa fa-plus"></i>}
                </button>
                <button className='delete' onClick={handleDelete}><i className="fa fa-trash"></i></button>
            </span>

            {showForm && (
                <div className='popup-overlay'>
                    <AddToStoreForm
                        item={item}
                        categories={categories}
                        stores={stores}
                        onClose={() => setShowForm(false)}
                    />
                </div>
            )}
        </li>
    );
}
export default Item;