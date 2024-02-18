import React from "react";
import { NavLink } from "react-router-dom";

function NavBar() {
    return (
        <div className="navbar">
            <NavLink to='/lists' activeClassName="active">Lists</NavLink>
            <NavLink to='/items' exact activeClassName="active">Items</NavLink>
            <NavLink to='/stores' exact activeClassName="active">Stores</NavLink>
        </div>
    );
}

export default NavBar;