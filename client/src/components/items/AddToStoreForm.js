//src/features/items/AddToStoreForm.js

import React from "react";
import { useDispatch } from "react-redux"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addNote } from "../../features/notes/notesSlice";

function AddToStoreForm({ item, stores, onClose }) {

    const dispatch = useDispatch();

    const validationSchema = Yup.object().shape({
        description: Yup.string().required("Note is required"),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            await dispatch(
                addNote({
                    description: values.description,
                    store_id: parseInt(values.store),
                    item_id: item.id,
                })
            ).unwrap();
            resetForm();
            onClose();
        } catch (error) {
            console.error("Item not added to store:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <Formik
                initialValues={{
                    store: stores.length > 0 ? stores[0].id : "",
                    description: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="add">
                        <div className="form-group">
                            <span>Item: {item.name}</span>
                            <span>Category: {item.category}</span>
                            Store:
                            <Field as="select" name="store">
                                {stores.map((store) => (
                                    <option key={store.id} value={store.id}>
                                        {store.name}
                                    </option>
                                ))}
                            </Field>
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
            <button className="close" onClick={onClose}>
                Close
            </button>
        </div>
    );
};

export default AddToStoreForm
