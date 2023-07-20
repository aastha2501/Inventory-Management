import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/Navbar/Navbar';
import Home from "./components/Home/Home";
import UserHome from "./components/Home/UserHome";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Account/Login';
import Signup from './components/Account/Signup';
import CartItems from './components/CartItems';
import Invoices from './components/Salesman/Invoices';
import AdminHome from './components/Home/AdminHome';
import AllOrders from './components/Admin/AllOrders';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      {/* <BrowserRouter>
      <NavBar/>
      <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/admin" element={<AdminHome/>}/>
          <Route path="/dashboard" element={<UserHome/>}/>  
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/invoice/:userId" element={<CartItems/>}/>
          <Route path="/invoices/:userId" element={<Invoices/>}/>
          <Route path="/allOrders" element={<AllOrders/>}/>
          <Route path="*" element={<div>Page not found</div>}/>
      </Routes>
    </BrowserRouter> */}
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/admin"
            element={<ProtectedRoute roles={['Admin']} >
              <AdminHome />
            </ProtectedRoute>}
          />
          <Route
            path="/dashboard"
            element={<ProtectedRoute roles={['User', 'Admin']}>
              <UserHome />
            </ProtectedRoute>}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/invoice/:userId"
            element={<ProtectedRoute roles={['User', 'Admin']}>
              <CartItems />
            </ProtectedRoute>}
          />
          <Route
            path="/invoices/:userId"
            element={<ProtectedRoute roles={['User']}>
              <Invoices />
            </ProtectedRoute>}
          />
          <Route
            path="/allOrders"
            element={<ProtectedRoute roles={['Admin']}>
              <AllOrders />
            </ProtectedRoute>}
          />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
