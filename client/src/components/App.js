//src/components/App.js

import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import ItemsList from "../features/items/ItemsList";

function App() {
    return (
        <div>
            <h1>Project Client</h1>
            <ItemsList />
        </div>
    )
}

export default App;
