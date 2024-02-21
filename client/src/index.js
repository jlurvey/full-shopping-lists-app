//source/index.js

import React from "react";
import App from "./components/App";
import { Provider } from 'react-redux'
import store from './store.js'
import "./index.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from 'react-router-dom'


const container = document.getElementById("root");
const root = createRoot(container);
root.render(
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>,
);
