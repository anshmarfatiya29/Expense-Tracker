import React from "react";


import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import  Login  from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import  Home  from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import UserProvider from "./context/userContext";
import Suggestions from "./pages/Dashboard/Suggestions"; 
import { Toaster } from "react-hot-toast";


const App = () => {
  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signUp" exact element={<SignUp />} />
          <Route path="/dashboard" exact element={<Home />} />
          <Route path="/income" exact element={<Income />} />
          <Route path="/expense" exact element={<Expense />} />
          <Route path="/suggestions" exact element={<Suggestions />} />
        </Routes>
      </Router>
    </div>

    <Toaster 
        toastOption={{
          className: "",
          style: {
            fontSize:'13px'
          },
        }}
        />
    </UserProvider>
  );
};
  
export default App

const Root = () => {
  //check if token  exists in localstrage
  const isAuthenticated = !!localStorage.getItem("token");
  
  //Redirect to dahsboard if authenticated, otherwise  to login
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />  
  );
};
