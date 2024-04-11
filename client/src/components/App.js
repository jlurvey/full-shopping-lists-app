//src/components/App.js

import "../App.css"
import { Route, Switch } from "react-router-dom";
import NavBar from "./NavBar";
import ItemsList from "./items/ItemsList";
import StoresList from "./stores/StoresList";
import Lists from "./lists/Lists";

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
