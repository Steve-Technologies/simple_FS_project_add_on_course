import { useEffect, useState } from 'react';
import axios from 'axios';

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [salary, setSalary] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // 📌 Fetch Employees
    const fetchEmployees = async () => {
        const response = await axios.get('http://localhost:5000/getEmployees');
        setEmployees(response.data);
    };

    // 📌 Add Employee
    const addEmployee = async () => {
        await axios.post('http://localhost:5000/addEmployee', { name, position, salary });
        fetchEmployees();
        clearInputFields();
    };

    // 📌 Update Employee
    const updateEmployee = async () => {
        await axios.put(`http://localhost:5000/updateEmployee/${editId}`, { name, position, salary });
        fetchEmployees();
        clearInputFields();
        setIsEditing(false); // Turn off edit mode
    };

    // 📌 Delete Employee
    const deleteEmployee = async (id) => {
        await axios.delete(`http://localhost:5000/deleteEmployee/${id}`);
        fetchEmployees();
    };

    // 📌 Handle Edit Button Click
    const handleEdit = (employee) => {
        setIsEditing(true);
        setEditId(employee.id);
        setName(employee.name);
        setPosition(employee.position);
        setSalary(employee.salary);
    };

    // 📌 Clear Input Fields
    const clearInputFields = () => {
        setName('');
        setPosition('');
        setSalary('');
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    return (
        <div>
            <h2>Employee Management System</h2>

            {/* Input fields */}
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
            />
            <input
                type="number"
                placeholder="Salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
            />

            {/* Add or Update Button based on edit mode */}
            {isEditing ? (
                <button onClick={updateEmployee}>Update Employee</button>
            ) : (
                <button onClick={addEmployee}>Add Employee</button>
            )}

            <ul>
                {employees.map((emp) => (
                    <li key={emp.id}>
                        {emp.name} - {emp.position} - ₹{emp.salary}
                        <button onClick={() => handleEdit(emp)}>Edit</button>
                        <button onClick={() => deleteEmployee(emp.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default EmployeeList;
