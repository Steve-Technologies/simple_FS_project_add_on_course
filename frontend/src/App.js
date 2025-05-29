import { useState } from 'react';
import EmployeeList from './EmployeeList';
import Login from './Login';
import Signup from './Signup';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [showSignup, setShowSignup] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div>
        {showSignup ? (
          <>
            <Signup onSuccess={() => setShowSignup(false)} />
            <p>Already have an account? <button onClick={() => setShowSignup(false)}>Login</button></p>
          </>
        ) : (
          <>
            <Login onLogin={() => setIsLoggedIn(true)} />
            <p>No account? <button onClick={() => setShowSignup(true)}>Signup</button></p>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1>Employee Management System</h1>
      <button onClick={logout}>Logout</button>
      <EmployeeList />
    </div>
  );
}

export default App;
