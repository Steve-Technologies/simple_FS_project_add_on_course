const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'employeeDB'
});

// Connect to the Database
db.connect(err => {
  if (err) throw err;
  console.log('MySQL Database Connected');
});

// Add a new employee
app.post('/addEmployee', (req, res) => {
  const { name, position, salary } = req.body;
  const sql = 'INSERT INTO employees (name, position, salary) VALUES (?, ?, ?)';
  db.query(sql, [name, position, salary], (err, result) => {
    if (err) throw err;
    res.send('Employee added successfully');
  });
});

// Get all employees
app.get('/getEmployees', (req, res) => {
  const sql = 'SELECT * FROM employees';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Update an employee's details
app.put('/updateEmployee/:id', (req, res) => {
  const { name, position, salary } = req.body;
  const sql = 'UPDATE employees SET name = ?, position = ?, salary = ? WHERE id = ?';
  db.query(sql, [name, position, salary, req.params.id], (err, result) => {
    if (err) throw err;
    res.send('Employee updated successfully');
  });
});

// Delete an employee
app.delete('/deleteEmployee/:id', (req, res) => {
  const sql = 'DELETE FROM employees WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send('Employee deleted successfully');
  });
});

// Server Port
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
