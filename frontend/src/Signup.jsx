import { useState } from 'react';
import axios from 'axios';

function Signup({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signup = async () => {
    try {
      await axios.post('http://localhost:5000/signup', { email, password });
      alert('Signup successful');
      onSuccess();
    } catch (err) {
      alert('Signup failed');
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={signup}>Signup</button>
    </div>
  );
}

export default Signup;
