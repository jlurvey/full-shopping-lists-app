//src/features/items/addItemForm.js

import React from "react";
import { useDispatch } from "react-redux"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addItem } from "../../features/items/itemsSlice";

function AddItemForm({ items, categories }) {

    const dispatch = useDispatch();


    const initialValues = {
        name: "",
        category: categories.length > 0 ? categories[0].name : "",
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required("Name is required")
            .test('is-string', 'Name must be a string', (value) => typeof value === 'string')
            .test('name-format', 'Item name must be a non-empty string', (value) => value && value.trim().length > 0)
            .test('name-exists', 'Name already exists', (value) => {
                return !items.some(item => item.name.toUpperCase() === value.toUpperCase());
            }),
        category: Yup.string()
            .required("Category is required")
            .test('valid-category', 'Invalid category, please choose from the predefined categories', (value) => {
                const categoryNames = categories.map(category => category.name);
                return categoryNames.includes(value);
            }),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            console.log(values)
            await dispatch(addItem({ name: values.name, category: values.category, need: true })).unwrap();
            resetForm();
        } catch (error) {
            console.error("Failed to add item:", error.error);
            alert(`Failed to add item: ${error.error}. Please refresh page.`)
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
                {({ isSubmitting }) => (
                    <Form className="add">
                        <div className="form-row">
                            <div className="form-column">
                                <label htmlFor="name">Item Name:</label>
                                <Field type="text" name="name" />
                                <ErrorMessage name="name" component="div" className="error" />
                            </div>
                            <div className="form-column">
                                <label htmlFor="category">Category:</label>
                                <Field as="select" name="category" >
                                    {categories.map((category) => (
                                        <option key={category.name} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name="category" component="div" className="error" />
                            </div>
                            <button className="add" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Adding..." : "Add Item"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddItemForm
