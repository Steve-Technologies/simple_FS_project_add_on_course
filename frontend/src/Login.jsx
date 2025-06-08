import { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
        try {
            const res = await axios.post('http://localhost:5000/login', { email, password });
            localStorage.setItem('token', res.data.token);
            onLogin();
        } catch {
            alert('Login failed');
        }
    };

    return (

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
            <h2 style={{ textAlign: 'center' }}>Login</h2>
            <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            <button onClick={login}>Login</button>
        </div>

    );
}

export default Login;
