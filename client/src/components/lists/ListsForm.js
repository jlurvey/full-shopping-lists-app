//src/features/items/ListsForm.js

import React from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addItem, } from "../../features/items/itemsSlice";
import { addNote, } from "../../features/notes/notesSlice";
import { setSelectedStore } from "../../features/stores/storesSlice";

function ListsForm({ stores, selectedStore, categories }) {

    const dispatch = useDispatch();

    const initialValues = {
        name: "",
        category: categories.length > 0 ? categories[0].name : "",
        description: "",
        store: selectedStore ? selectedStore.id : "",
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Item Name is required"),
        category: Yup.string().required("Category is required"),
        description: Yup.string().required("Note is required"),
        store: Yup.string().required("Store is required"),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const addedItem = await dispatch(
                addItem({ name: values.name, category: values.category, need: true })
            ).unwrap();
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
                        <div className="form-group">
                            <label>
                                Filter By Store:
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
                            </label>
                            <label>
                                Item Name:
                                <Field type="text" name="name" />
                                <ErrorMessage name="name" component="div" className="error" />
                            </label>
                            <label>
                                Category:
                                <Field as="select" name="category">
                                    {categories.map((category) => (
                                        <option key={category.name} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name="category" component="div" className="error" />
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                Note:
                                <Field type="text" name="description" />
                                <ErrorMessage name="description" component="div" className="error" />
                            </label>
                            <button className="add" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Adding..." : "Add Item to Store"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ListsForm