
# Simple Employee Management System (CRUD App)

A **Beginner-Friendly Full Stack CRUD Project** using **Node.js, Express.js, MySQL & React.js** 🚀  

---

## Tech Stack
- Node.js (Backend)
- Express.js (REST API Framework)
- MySQL (Database)
- React.js (Frontend)
- Axios (HTTP Requests)

---

## Project Structure

```
Employee-Management-System/
│
├── server/
│   ├── server.js
│   └── db.sql
│
├── client/
│   ├── src/
│   │   ├── EmployeeList.js
│   │   └── App.js
│   └── package.json
│
└── README.md
```

---

## Features
Add Employee  
View Employee List  
Update Employee Details  
Delete Employee  

---

## API Endpoints

| Action              | Endpoint              | Method |
|----------------|-----------------|---------|
| Add Employee     | `/addEmployee` | POST |
| Get Employees   | `/getEmployees` | GET |
| Update Employee | `/updateEmployee/:id` | PUT |
| Delete Employee | `/deleteEmployee/:id` | DELETE |

---

## Setup Guide

### Step 1: Install Backend
```bash
cd server
npm install
```

### Step 2: Install Frontend
```bash
cd ../client
npm install
```

---

## Run the Project

### Start the Backend
```bash
cd server
node server.js
```

### Start the Frontend
```bash
cd ../client
npm start
```

---

## MySQL Database Schema (`db.sql`)

```sql
CREATE DATABASE employeeDB;

USE employeeDB;

CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50),
  position VARCHAR(50),
  salary INT
);
```

---

## Frontend UI Flow

| Action               | API Call            |
|----------------|-------------------|
| Add Employee | Add to MySQL Database |
| Edit Employee | Update MySQL Record |
| Delete Employee | Remove from MySQL |
| Fetch Employees | Get All Employees |

---

##  Output
```
Employee Management System
--------------------------------
John Doe - Software Engineer - ₹50000
[Edit] [Delete]
```

