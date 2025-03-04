import { useEffect, useState } from "react";

export default function EmployeeTable() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const [res1, res2] = await Promise.all([
          fetch("https://api.example.com/employeeDetails").then((res) =>
            res.json()
          ),
          fetch("https://api.example.com/employeeStatus").then((res) =>
            res.json()
          ),
        ]);

        // Convert status array to a map for quick lookup
        const statusMap = res2.reduce((acc, item) => {
          acc[item.employeeId] = item.employeeStatus;
          return acc;
        }, {});

        // Merge both responses based on employeeId
        const mergedData = res1.map((emp) => ({
          id: emp.employeeId,
          name: emp.employeeName,
          designation: emp.employeeDesignation,
          salary: emp.Salary,
          status: statusMap[emp.employeeId] || "Unknown",
        }));

        setEmployees(mergedData);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Designation</th>
          <th>Salary</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((emp) => (
          <tr key={emp.id}>
            <td>{emp.id}</td>
            <td>{emp.name}</td>
            <td>{emp.designation}</td>
            <td>{emp.salary}</td>
            <td>{emp.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
