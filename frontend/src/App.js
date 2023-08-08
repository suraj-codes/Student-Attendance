import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import StudentDashboard from "./components/StudentDashboard";
import { login, register } from "./api";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [userRole, setUserRole] = useState(""); // Add this state for user role

  const handleLogin = async (username, password, cb) => {
    // Perform authentication and set the logged-in user and role
    // setLoggedIn(true);
    // setCurrentUser(username);
    // setUserRole(role);
    try {
      const response = await login(username, password);
      cb();
      setLoggedIn(true);
      setCurrentUser(response.user);
      setUserRole(response.user.role);
    } catch (e) {
      if (e === "Invalid credentials" || e === "User Not Found") {
        alert(e);
      } else {
        alert("Some Error Occured");
      }
      console.log(e);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;
    if (user) {
      setLoggedIn(true);
      setCurrentUser(user);
      setUserRole(user.role);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  return (
    <Router>
      <div>
        <Navbar loggedIn={loggedIn} userRole={userRole} />
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />}></Route>
          {loggedIn && userRole === "admin" ? (
            <Route
              path="/dashboard"
              element={<AdminDashboard loggedIn={loggedIn} />}
            ></Route>
          ) : (
            <Route
              path="/dashboard"
              element={
                <StudentDashboard
                  loggedIn={loggedIn}
                  currentUser={currentUser}
                />
              }
            ></Route>
          )}
          {/* <Route path="/" element={<Login onLogin={handleLogin} />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
