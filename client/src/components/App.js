//src/components/App.js

import React, { useEffect, useState } from "react";
import "../App.css"
import { Switch, Route } from "react-router-dom";
import ItemsList from "../features/items/ItemsList";

function App() {
    return (
        <div className="App">
            <h1>Project Client</h1>
            <ItemsList />
        </div>
    )
}

export default App;
