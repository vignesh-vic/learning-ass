import { BrowserRouter as Router , Routes, Route, Navigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { login , userdata} from './slices/authSlice';
import { use, useEffect } from 'react';
import LoginPage from './pages/Auth/LoginPage';

function App() {
const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
const loading = useSelector((state) => state.auth.loading);

const dispatch = useDispatch();

if (loading) {
  return <div>Loading...</div>;
}


const checkAuthStatus = async () => {

try {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (token && user) {
    dispatch(userdata(JSON.parse(user)));
  }
} catch (error) {
  console.log('Error checking authentication status:', error);
}

}


useEffect(() => {
  checkAuthStatus();
}, []);

return (
   <Router>
      <Routes>
        <Route path="/" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login"  replace/>} />
        <Route path="/home" element={<h1>Home Page</h1>} />
        <Route path="/dashboard" element={isAuthenticated ? <h1>Dashboard</h1> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  )
}

export default App
