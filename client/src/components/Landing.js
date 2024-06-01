import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { signup, login } from "../features/users/usersSlice";

function Landing() {

    const dispatch = useDispatch();
    const [isLogin, setIsLogin] = useState(true);

    const initialValues = {
        email: "",
        password: "",
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().required("Password is required"),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        const userData = {
            email: values.email,
            password: values.password,
        };
        try {
            if (isLogin) {
                await dispatch(login(userData));
            } else {
                await dispatch(signup(userData));
                await dispatch(login(userData));
            }
            // Handle successful login/signup, e.g., redirect to another page
        } catch (error) {
            console.error("Authentication failed:", error);
            // Handle authentication error
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <div className="navbar">
            <p className="landing">{isLogin ? "Login" : "Sign Up"}</p>
            </div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="add">
                        <div className="form-row">
                            <div className="form-column">
                                <label htmlFor="email">Email:</label>
                                <Field type="email" name="email" />
                                <ErrorMessage name="email" component="div" className="error" />
                            </div>
                            <div className="form-column">
                                <label htmlFor="password">Password:</label>
                                <Field type="password" name="password" />
                                <ErrorMessage name="password" component="div" className="error" />
                            </div>
                            <button className="add" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : isLogin ? "Login" : "Sign Up"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
            <div className="Home">
                <a onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Don't have an account? Sign up here." : "Already have an account? Login here."}
                </a>
            </div>
        </div>
    );
}

export default Landing