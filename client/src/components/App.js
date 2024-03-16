//src/components/App.js

import React, { useEffect, useState } from "react";
import "../App.css"
import { Route, Switch } from "react-router-dom";
import NavBar from "./NavBar";
import ItemsList from "../features/items/ItemsList";
import StoresList from "../features/stores/StoresList";
import Lists from "../features/notes/Lists";


function App() {
    return (
        <div className="App">
            <header>Shopping Lists</header>
            <NavBar/>
            <Switch>
                <Route path='/items'>
                    <ItemsList />
                </Route>
                <Route path ='/stores'>
                    <StoresList />
                </Route>
                <Route path ='/lists'>
                    <Lists />
                </Route>
            </Switch>
            
        </div>
    )
}

export default App;
