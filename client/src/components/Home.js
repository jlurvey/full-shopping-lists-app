import React from "react";
import { NavLink } from "react-router-dom"

function Home() {
    return (
        <div className="Home">
            <p style={{ color: "red", fontWeight: "bold" }}>PLEASE NOTE: AT LEAST ONE CATEGORY IS REQUIRED TO ADD AN ITEM. ONE ITEM AND ONE STORE ARE REQUIRED TO ADD NOTES AND VIEW LISTS!</p>
            <br />
            <p>Click a link to get started!</p>
            <br />
            <p><NavLink to='/Categories' exact activeClassName="active" className="NavLink">Categories:</NavLink> Navigate here to view and manage your list of categories. Create and delete categories!</p>
            <br />
            <p><NavLink to='/items' exact activeClassName="active" className="NavLink">Items:</NavLink> Navigate here to view and manage your list of items. Create, edit, and delete items!</p>
            <br />
            <p><NavLink to='/stores' exact activeClassName="active" className="NavLink">Stores:</NavLink> Navigate here to view and manage your list of stores. Create and delete stores!</p>
            <br />
            <p><NavLink to='/lists' exact activeClassName="active" className="NavLink">Lists:</NavLink> Items filtered by Store! Navigate here to view your lists. Create, edit, and delete items!</p>
        </div>
    )
}

export default Home