import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/users/usersSlice";

function LogoutButton() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <button className="logout" onClick={handleLogout}>
      Logout
    </button>
  );
}

export default LogoutButton;