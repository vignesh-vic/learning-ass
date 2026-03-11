import { BrowserRouter as Router , Routes, Route, Navigate } from 'react-router-dom';


function App() {
const isAuthenticated = true; 
const loading = false;

if (loading) {
  return <div>Loading...</div>;
}

return (
   <Router>
      <Routes>
        <Route path="/" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login"  replace/>} />
        <Route path="/home" element={<h1>Home Page</h1>} />
        <Route path="/dashboard" element={isAuthenticated ? <h1>Dashboard</h1> : <Navigate to="/login" />} />
        <Route path="/login" element={<h1>Login Page</h1>} />
      </Routes>
    </Router>
  )
}

export default App
