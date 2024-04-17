//src/features/items/AddToStoreForm.js

import React from "react";
import { useDispatch } from "react-redux"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addNote } from "../../features/notes/notesSlice";

function AddToStoreForm({ item, stores, onClose }) {

    const dispatch = useDispatch();

    const validationSchema = Yup.object().shape({
        description: Yup.string()
            .required("Description is required")
            .test('is-string', 'description must be a string', (value) => typeof value === 'string')
            .test('description-format', 'description must be a non-empty string', (value) => value && value.trim().length > 0),
        store: Yup.string().required("Store is required")
            .test('combo-exists', 'note for this combination of item and store already exists', (value) => {
                return !item.notes.some(note => note.store_id === parseInt(value) && note.item_id === item.id);
            }),
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
                            <ErrorMessage name="store" component="div" className="error" />
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
