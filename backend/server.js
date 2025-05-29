const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const app = express();
const JWT_SECRET = 'your_jwt_secret_key'; // use env vars in production

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'employeeDB'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Database Connected');
});

// 🔐 Hash Password with scrypt
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ':' + derivedKey.toString('hex'));
    });
  });
}

// 🔍 Compare Password with hash
function verifyPassword(password, hash) {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString('hex'));
    });
  });
}

// 👤 Signup
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  const checkUserSql = 'SELECT * FROM users WHERE email = ?';
  db.query(checkUserSql, [email], async (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      return res.status(400).send('User already exists');
    }

    const hashedPassword = await hashPassword(password);

    const insertSql = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(insertSql, [email, hashedPassword], (err, result) => {
      if (err) throw err;
      res.send('User registered successfully');
    });
  });
});

// 🔐 Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, result) => {
    if (err) throw err;
    if (result.length === 0) return res.status(401).send('Invalid credentials');

    const isMatch = await verifyPassword(password, result[0].password);
    if (!isMatch) return res.status(401).send('Invalid credentials');

    const token = jwt.sign({ userId: result[0].id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

// ✅ Auth Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(403).send('Access denied');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).send('Invalid token');
  }
};

// 👨‍💼 Protected Employee Routes
app.post('/addEmployee', verifyToken, (req, res) => {
  const { name, position, salary } = req.body;
  const sql = 'INSERT INTO employees (name, position, salary) VALUES (?, ?, ?)';
  db.query(sql, [name, position, salary], (err, result) => {
    if (err) throw err;
    res.send('Employee added successfully');
  });
});

app.get('/getEmployees', verifyToken, (req, res) => {
  db.query('SELECT * FROM employees', (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.put('/updateEmployee/:id', verifyToken, (req, res) => {
  const { name, position, salary } = req.body;
  const sql = 'UPDATE employees SET name = ?, position = ?, salary = ? WHERE id = ?';
  db.query(sql, [name, position, salary, req.params.id], (err, result) => {
    if (err) throw err;
    res.send('Employee updated successfully');
  });
});

app.delete('/deleteEmployee/:id', verifyToken, (req, res) => {
  const sql = 'DELETE FROM employees WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send('Employee deleted successfully');
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));