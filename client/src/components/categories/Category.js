import React from "react";
import { deleteCategory } from "../../features/categories/categoriesSlice";
import { useDispatch } from "react-redux";

function Category({ category }) {
    
    const dispatch = useDispatch();

    const handleDelete = async () => {
        await dispatch(deleteCategory(category.id))
    };

        return (
            <li >
                <span>{category.name}</span>
                <span className='actions'>
                <button className='delete' onClick={handleDelete}><i className="fa fa-trash"></i></button>
                </span>
            </li>
        );
    }
    export default Category;