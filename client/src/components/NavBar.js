import React from "react";
import { NavLink } from "react-router-dom";

function NavBar() {
    return (
        <div className="navbar">
            <NavLink to='/items' exact activeClassName="active">Items</NavLink>
            <NavLink to='/stores' exact activeClassName="active">Stores</NavLink>
            <NavLink to='/lists' exact activeClassName="active">Lists</NavLink>
        </div>
    );
}

export default NavBar;