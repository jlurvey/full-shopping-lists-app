import React from "react";
import { NavLink } from "react-router-dom";

function NavBar() {
    return (
        <div className="navbar">
            <NavLink to='/' exact activeClassName="active" className="NavLink">Home</NavLink>
            <NavLink to='/categories' exact activeClassName="active" className="NavLink">Categories</NavLink>
            <NavLink to='/items' exact activeClassName="active" className="NavLink">Items</NavLink>
            <NavLink to='/stores' exact activeClassName="active" className="NavLink">Stores</NavLink>
            <NavLink to='/lists' exact activeClassName="active" className="NavLink">Lists</NavLink>
        </div>
    );
}

export default NavBar;