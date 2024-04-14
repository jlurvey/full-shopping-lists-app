//src/features/items/addItemForm.js

import React, { useState } from "react";
import { useDispatch } from "react-redux"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addItem } from "../../features/items/itemsSlice";

function AddItemForm({ categories }) {
    const dispatch = useDispatch();

  const initialValues = {
    name: "",
    category: categories.length > 0 ? categories[0].name : "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    category: Yup.string().required("Category is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await dispatch(addItem({ name: values.name, category: values.category, need: true })).unwrap();
      resetForm();
    } catch (error) {
      console.error("Failed to add item");
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
              <label htmlFor="name">Item Name:</label>
              <Field type="text" name="name" />
              <ErrorMessage name="name" component="div" className="error" />
              <label htmlFor="category">Category:</label>
              <Field as="select" name="category">
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="category" component="div" className="error" />
              <button className="add" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Item"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AddItemForm
