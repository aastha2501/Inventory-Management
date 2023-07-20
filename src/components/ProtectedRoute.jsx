import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const ProtectedRoute = ({ roles, children }) => {
  const token = localStorage.getItem('token'); 
  //debugger;
  if (!token) {
   
    return <Navigate to="/login" />;
  }

  try {
    const decodedToken = jwtDecode(token);

    const userRoles = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (roles.some(role => userRoles.includes(role))) {
    return children;
    } else if(userRoles == "User") {
      return <Navigate to="/dashboard"/>
    } else if(userRoles == "Admin") {
      return <Navigate to="/admin"/>
    }
     else {
      return <Navigate to="/" />;
    }
  } catch (error) {
    console.error('Error verifying JWT token:', error);
    localStorage.removeItem('token');
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;


 {/* <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/admin"
          element={<ProtectedRoute roles={['Admin']} element={<AdminHome />} />}
        />
        <Route
          path="/dashboard/:userId"
          element={<ProtectedRoute roles={['User', 'Admin']} element={<UserHome />} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/invoice/:userId"
          element={<ProtectedRoute roles={['User', 'Admin']} element={<Invoice />} />}
        />
        <Route
          path="/invoices/:userId"
          element={<ProtectedRoute roles={['User']} element={<Invoices />} />}
        />
      </Routes>
    </BrowserRouter> */}