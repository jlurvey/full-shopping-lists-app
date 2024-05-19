//src/features/categories/addCategoryForm.js

import React from "react";
import { useDispatch } from "react-redux"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addCategory } from "../../features/categories/categoriesSlice";

function AddCategoryForm({ categories }) {

    const dispatch = useDispatch();

    const initialValues = {
        name: "",
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required("Name is required")
            .test('is-string', 'Name must be a string', (value) => typeof value === 'string')
            .test('name-format', 'Category name must be a non-empty string', (value) => value && value.trim().length > 0)
            .test('name-exists', 'Category Name already exists', (value) => {
                return !categories.some(category => category.name.trim().toUpperCase() === value.trim().toUpperCase());
            }),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            await dispatch(addCategory({ name: values.name })).unwrap();
            resetForm();
        } catch (error) {
            console.error("Failed to add category");
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
                                <label htmlFor="name">Category Name:</label>
                                <Field type="text" name="name" />
                                <ErrorMessage name="name" component="div" className="error" />
                            </div>
                            <button className="add" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Adding..." : "Add Category"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddCategoryForm
