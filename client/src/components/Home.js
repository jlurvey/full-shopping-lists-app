import React from "react";
import { NavLink } from "react-router-dom"

function Home() {
    return (
        <div className="Home">
            <p>Click a link to get started!</p>
            <br />
            <p><NavLink to='/items' exact activeClassName="active" className="NavLink">Items:</NavLink> Click here to manage your list of items. You can update the need status of items, delete items, and add new items to your list, along with adding items to stores.</p>
            <br />
            <p><NavLink to='/stores' exact activeClassName="active" className="NavLink">Stores:</NavLink> Navigate here to view and manage your list of stores. You can delete existing stores and add new ones.</p>
            <br />
            <p><NavLink to='/lists' exact activeClassName="active" className="NavLink">Lists:</NavLink> Access this page to view your lists filtered by stores. You can manage items within each store, update their need status, and delete items. Additionally, you can add new items directly to a specific store.</p>
        </div>
    )
}

export default Home