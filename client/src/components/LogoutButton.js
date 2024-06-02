import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { logout, resetState } from "../features/users/usersSlice";

function LogoutButton() {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      dispatch(resetState());
      history.push('/')
    });
  };

  return (
    <button className="logout" onClick={handleLogout}>
      Logout
    </button>
  );
}

export default LogoutButton;