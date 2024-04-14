//src/features/stores/addStoreForm.js

import React from "react";
import { useDispatch } from "react-redux"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addStore } from "../../features/stores/storesSlice";

function AddStoreForm() {
    
    const dispatch = useDispatch();

    const initialValues = {
        name: "",
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Store Name is required"),
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
                        <div className="form-group">
                            <label htmlFor="name">Store Name:</label>
                            <Field type="text" name="name" />
                            <ErrorMessage name="name" component="div" className="error" />
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
