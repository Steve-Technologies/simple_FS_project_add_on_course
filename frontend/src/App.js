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
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh', width: '100vw' }}>
        <div >
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
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100vw', paadding: '1rem' }}>
        <h1>Employee Management System</h1>
        <button onClick={logout}>Logout</button>
      </div>
      <EmployeeList />
    </div>
  );
}

export default App;
