//src/features/items/ListsForm.js

import React from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addItem, } from "../../features/items/itemsSlice";
import { addNote, } from "../../features/notes/notesSlice";
import { setSelectedStore } from "../../features/stores/storesSlice";

function ListsForm({ stores, selectedStore, categories, items }) {

    const dispatch = useDispatch();

    const initialValues = {
        name: "",
        category_id: categories.length > 0 ? categories[0].id : "",
        description: "",
        store: selectedStore ? selectedStore.id : "",
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required("Name is required")
            .test('is-string', 'Name must be a string', (value) => typeof value === 'string')
            .test('name-format', 'Item name must be a non-empty string', (value) => value && value.trim().length > 0)
            .test('name-exists', 'Name already exists', (value) => {
                return !items.some(item => item.name.trim().toUpperCase() === value.trim().toUpperCase());
            }),
        category_id: Yup.number().integer()
            .required("Category is required")
            .test('valid-category', 'Invalid category, please choose from the predefined categories', (value) => {
                const categoryIds = categories.map(category => category.id);
                return categoryIds.includes(value);
            }),
        description: Yup.string()
            .required("Description is required")
            .test('is-string', 'description must be a string', (value) => typeof value === 'string')
            .test('description-format', 'description must be a non-empty string', (value) => value && value.trim().length > 0),
        store: Yup.string().required("Store is required"),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        let item = { name: values.name, category_id: parseInt(values.category_id), need: true }
        try {
            const addedItem = await dispatch(addItem(item)).unwrap();
            await dispatch(
                addNote({
                    description: values.description,
                    store_id: parseInt(values.store),
                    item_id: addedItem.id,
                })
            ).unwrap();
            resetForm();
        } catch (error) {
            console.error("Item not added to store:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, setFieldValue }) => (
                    <Form className="add">
                        <div className="form-row">
                            <div className="form-column">
                                <label>
                                    Filter By Store:</label>
                                    <Field as="select" name="store" onChange={(e) => {
                                        setFieldValue("store", e.target.value);
                                        dispatch(setSelectedStore(stores.find((store) => store.id === parseInt(e.target.value))));
                                    }}>
                                        <option value="">Select a store</option>
                                        {stores.map((store) => (
                                            <option key={store.id} value={store.id}>
                                                {store.name}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="store" component="div" className="error" />
                                
                            </div>
                            <div className="form-column">
                                <label>
                                    Item Name:</label>
                                    <Field type="text" name="name" />
                                    <ErrorMessage name="name" component="div" className="error" />
                                
                            </div>
                            <div className="form-column">
                                <label htmlFor="category_id">Category:</label>
                                <Field as="select" name="category_id" >
                                    {categories.map((category) => (
                                        <option key={category.name} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name="category_id" component="div" className="error" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-column">
                                <label>
                                    Note:</label>
                                    <Field type="text" name="description" />
                                    <ErrorMessage name="description" component="div" className="error" />
                                
                            </div>
                            <button className="add" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Adding..." : "Add New Item to Store"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ListsForm