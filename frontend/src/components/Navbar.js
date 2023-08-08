import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ loggedIn }) => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-white text-2xl font-semibold">
          Student Management System
        </h1>
        {loggedIn && (
          <Link
            onClick={() => {
              localStorage.removeItem("user");
            }}
            className="text-[#0000FF]"
            to="/"
          >
            Logout
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
