import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"

import { selectAllItems, fetchItems } from "./itemsSlice";

function Item({ item }) {
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
                >
                    X
                </button>
            </div>
        </li>
    );
}
export default Item;