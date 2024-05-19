//src/features/categories/CategoriesList.js

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"
import { fetchCategories, selectAllCategories } from "../../features/categories/categoriesSlice.js";
import Category from "./Category"
import AddCategoryForm from "./AddCategoryForm.js";

function CategoriesList() {
    const dispatch = useDispatch()
    const categories = useSelector(selectAllCategories)
    const categoryStatus = useSelector((state) => state.categories.status)
    const categoryError = useSelector((state) => state.categories.error)

    useEffect(() => {
        if (categoryStatus === 'idle') {
            dispatch(fetchCategories())
        }
    }, [categoryStatus, dispatch])

    const renderCategories = () => {

        if (categoryStatus === 'failed') {
            return <div>{categoryError}</div>
        }

        if (categoryStatus === 'succeeded') {
            const sortedCategories = categories.slice()
                .sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()))
            return (
                <>
                    <AddCategoryForm categories={sortedCategories}/>
                    <li className='topRow'>
                        <span>Category Name</span>
                        <span className='actions'>Actions</span>
                    </li>
                    {sortedCategories.map((category) => (
                        <Category
                            key={category.id}
                            category={category}
                        />
                    ))}
                </>
            );
        }
        return null;
    };

    return <div>{renderCategories()}</div>
}

export default CategoriesList