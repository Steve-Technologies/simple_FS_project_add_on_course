import { useEffect, useState } from 'react';
import axios from 'axios';

function EmployeeList() {
    const numRecords = 5; // Number of records per page
    const [employees, setEmployees] = useState([]);
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [salary, setSalary] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [search, setSearch] = useState('');
    const [filterPosition, setFilterPosition] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [salaryBounds, setSalaryBounds] = useState({ minSalary: 0, maxSalary: 100000 });
    const [minSalary, setMinSalary] = useState(0);
    const [maxSalary, setMaxSalary] = useState(100000);



    const config = {
        headers: { Authorization: localStorage.getItem('token') }
    };

    // 📌 Fetch Salary Bounds
    const fetchSalaryBounds = async () => {
        const response = await axios.get('http://localhost:5000/salaryBounds', config);
        const { minSalary, maxSalary } = response.data;
        setSalaryBounds({ minSalary, maxSalary });
        setMinSalary(minSalary);
        setMaxSalary(maxSalary);
    };


    // 📌 Fetch Employees
    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getEmployees', {
                headers: { Authorization: localStorage.getItem('token') },
                params: {
                    page,
                    search,
                    position: filterPosition,
                    minSalary,
                    maxSalary
                }
            });
            setEmployees(response.data.data);
            setTotal(response.data.total);
        }
        catch (error) {
            console.error("Error fetching employees:", error);
            alert("Failed to fetch employees. Please try again later.");
            localStorage.removeItem('token'); // Clear token on error
            window.location.href = '/login'; // Redirect to login
        };
    }

    // 📌 Add Employee
    const addEmployee = async () => {
        try {
            await axios.post('http://localhost:5000/addEmployee', { name, position, salary }, config);
            fetchEmployees();
            clearInputFields();
        } catch (error) {
            console.error("Error adding employee:", error);
            alert("Failed to add employee. Please try again later.");
            localStorage.removeItem('token'); // Clear token on error
            window.location.href = '/login'; // Redirect to login
        }
    };

    // 📌 Update Employee
    const updateEmployee = async () => {
        try {
            await axios.put(`http://localhost:5000/updateEmployee/${editId}`, { name, position, salary }, config);
            fetchEmployees();
            clearInputFields();
            setIsEditing(false); // Turn off edit mode
        } catch (error) {
            console.error("Error updating employee:", error);
            alert("Failed to update employee. Please try again later.");
            localStorage.removeItem('token'); // Clear token on error
            window.location.href = '/login'; // Redirect to login

        }
    };

    // 📌 Delete Employee
    const deleteEmployee = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/deleteEmployee/${id}`, config);
            fetchEmployees();
        } catch (error) {
            console.error("Error deleting employee:", error);
            alert("Failed to delete employee. Please try again later.");
            localStorage.removeItem('token'); // Clear token on error
            window.location.href = '/login'; // Redirect to login
        }
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
        fetchSalaryBounds();
        fetchEmployees();
    }, []);

    useEffect(() => {
        fetchEmployees();
    }, [page]);


    return (
        <div>
            <h2>Employee Management System</h2>

            {/* Input fields */}
            <div style={{ display: 'flex', gap: '1rem' }}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <select value={position} onChange={(e) => setPosition(e.target.value)}>
                    <option value="" disabled selected hidden>Select Position</option>
                    <option value="Manager">Manager</option>
                    <option value="Developer">Developer</option>
                    <option value="HR">HR</option>
                    {/* Add based on your actual positions */}
                </select>
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
            </div>
            <br />
            {/* filters */}
            <div style={{ display: 'flex', gap: '1rem' }}>
                <input
                    type="text"
                    placeholder="Search by name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select value={filterPosition} onChange={(e) => setFilterPosition(e.target.value)}>
                    <option value="">All Positions</option>
                    <option value="Manager">Manager</option>
                    <option value="Developer">Developer</option>
                    <option value="HR">HR</option>
                    {/* Add based on your actual positions */}
                </select>
                <div>
                    <label>Salary Range: ₹{minSalary} - ₹{maxSalary}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <input
                            type="range"
                            min={salaryBounds.minSalary}
                            max={salaryBounds.maxSalary}
                            value={minSalary}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                setMinSalary(value > maxSalary ? maxSalary : value);
                            }}
                        />
                        <input
                            type="range"
                            min={salaryBounds.minSalary}
                            max={salaryBounds.maxSalary}
                            value={maxSalary}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                setMaxSalary(value < minSalary ? minSalary : value);
                            }}
                        />
                    </div>
                </div>
                <button onClick={() => { setPage(1); fetchEmployees(); }}>Apply Filters</button>
            </div>

            <ul>
                {employees.map((emp) => (
                    <li key={emp.id}>
                        {emp.name} - {emp.position} - ₹{emp.salary}
                        <button onClick={() => handleEdit(emp)}>Edit</button>
                        <button onClick={() => deleteEmployee(emp.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <div style={{ marginTop: '20px' }}>
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
                <span> Page {page} of {Math.ceil(total / numRecords)} </span>
                <button disabled={page * numRecords >= total} onClick={() => setPage(page + 1)}>Next</button>
            </div>

        </div>
    );
}

export default EmployeeList;
