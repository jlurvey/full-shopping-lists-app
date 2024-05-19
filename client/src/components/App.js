//src/components/App.js

import "../App.css"
import { Route, Switch } from "react-router-dom";
import NavBar from "./NavBar";
import ItemsList from "./items/ItemsList";
import StoresList from "./stores/StoresList";
import Lists from "./lists/Lists";
import CategoriesList from "./categories/CategoriesList";
import Home from "./Home";

function App() {
    return (
        <div className="App">
            <header>Shopping Lists</header>
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
            
        </div>
        
    )
}

export default App;
