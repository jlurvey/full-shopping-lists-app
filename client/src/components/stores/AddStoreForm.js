//src/features/stores/addStoreForm.js

import React from "react";
import { useDispatch } from "react-redux"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addStore } from "../../features/stores/storesSlice";

function AddStoreForm({ stores }) {

    const dispatch = useDispatch();

    const initialValues = {
        name: "",
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required("Name is required")
            .test('is-string', 'Name must be a string', (value) => typeof value === 'string')
            .test('name-format', 'Store name must be a non-empty string', (value) => value && value.trim().length > 0)
            .test('name-exists', 'Store Name already exists', (value) => {
                return !stores.some(store => store.name.trim().toUpperCase() === value.trim().toUpperCase());
            }),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            await dispatch(addStore({ name: values.name })).unwrap();
            resetForm();
        } catch (error) {
            console.error("Failed to add store");
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
                                <label htmlFor="name">Store Name:</label>
                                <Field type="text" name="name" />
                                <ErrorMessage name="name" component="div" className="error" />
                            </div>
                            <button className="add" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Adding..." : "Add Store"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddStoreForm
