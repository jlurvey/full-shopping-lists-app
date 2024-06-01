//src/components/App.js

import "../App.css"
import React, {useEffect} from "react";
import { Route, Switch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { checkSession } from "../features/users/usersSlice";
import NavBar from "./NavBar";
import ItemsList from "./items/ItemsList";
import StoresList from "./stores/StoresList";
import Lists from "./lists/Lists";
import CategoriesList from "./categories/CategoriesList";
import Home from "./Home";
import Landing from "./Landing";
import LogoutButton from "./LogoutButton";

function App() {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.users.currentUser)

    // Check session on component mount
    useEffect(() => {
        dispatch(checkSession());
    }, [dispatch]);

    return (
        <div className="App">
            <header>
                <div className="header-title">Shopping Lists</div>
                {currentUser && <LogoutButton />} {/* Render LogoutButton if currentUser is available */}
            </header>
            {currentUser ? (
                <>
            <NavBar/>
            <Switch>
                <Route path='/items'>
                    <ItemsList />
                </Route>
                <Route path ='/categories'>
                    <CategoriesList />
                </Route>
                <Route path ='/stores'>
                    <StoresList />
                </Route>
                <Route path ='/lists'>
                    <Lists />
                </Route>
                <Route exact path ='/'>
                    <Home/>
                </Route>
            </Switch>
            </>
            ) : (
                <Landing/>
            )}
        </div>
    );
}

export default App;
