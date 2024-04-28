document.addEventListener("DOMContentLoaded", function() {
    const addEmployeeButton = document.getElementById('addProductButton');
    const deleteEmployeeButton = document.getElementById('deleteProductButton');
    const employeeForm = document.getElementById('employeeForm');
    const employeeList = document.getElementById('employeeList');
    const trackAttendanceButton = document.getElementById('trackAttendanceButton');
    let employeeData = JSON.parse(localStorage.getItem('employeeData')) || [];
    let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || {};

    addEmployeeButton.addEventListener('click', function() {
        employeeForm.style.display = 'block';
    });

    employeeForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const employeeName = document.getElementById('employeeName').value;
        const department = document.getElementById('department').value;
        const age = document.getElementById('age').value;
        const position = document.getElementById('position').value;
        const salary = document.getElementById('salary').value;
        const workingYears = document.getElementById('workingYears').value;

        const employee = {
            name: employeeName,
            department: department,
            age: age,
            position: position,
            salary: salary,
            workingYears: workingYears
        };

        employeeData.push(employee);
        localStorage.setItem('employeeData', JSON.stringify(employeeData));
        attendanceData[employeeName] = [];
        localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
        displayEmployees();
        employeeForm.reset();
        employeeForm.style.display = 'none';
    });

    function displayEmployees() {
        let html = '<h2>Employee List</h2>';

        if (employeeData.length === 0) {
            html += '<p>No employees added yet.</p>';
        } else {
            const departments = {};
            employeeData.forEach(function(employee) {
                if (!departments[employee.department]) {
                    departments[employee.department] = [];
                }
                departments[employee.department].push(employee);
            });

            for (const department in departments) {
                if (departments.hasOwnProperty(department)) {
                    html += `<h3>${department}</h3>`;
                    html += '<div class="table-container">';
                    html += '<table>';
                    html += '<tr><th>Name</th><th>Age</th><th>Position</th><th>Salary</th><th>Working Years</th><th>Action</th></tr>';
                    departments[department].forEach(function(employee, index) {
                        html += `<tr><td>${employee.name}</td><td>${employee.age}</td><td>${employee.position}</td><td>${employee.salary}</td><td>${employee.workingYears}</td><td><button class="deleteEmployeeButton" data-index="${employeeData.indexOf(employee)}">Delete</button></td></tr>`;
                    });
                    html += '</table>';
                    html += '</div>';
                }
            }
        }

        employeeList.innerHTML = html;

        // Attach event listener to delete buttons
        const deleteButtons = document.querySelectorAll('.deleteEmployeeButton');
        deleteButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                const index = parseInt(button.getAttribute('data-index'));
                const employeeName = employeeData[index].name;
                employeeData.splice(index, 1);
                delete attendanceData[employeeName];
                localStorage.setItem('employeeData', JSON.stringify(employeeData));
                localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
                displayEmployees();
            });
        });
    }

    deleteEmployeeButton.addEventListener('click', function() {
        const deleteIndex = prompt('Enter the index of the employee to delete:');
        if (deleteIndex !== null) {
            const index = parseInt(deleteIndex);
            if (!isNaN(index) && index >= 1 && index <= employeeData.length) {
                const employeeName = employeeData[index - 1].name;
                employeeData.splice(index - 1, 1);
                delete attendanceData[employeeName];
                localStorage.setItem('employeeData', JSON.stringify(employeeData));
                localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
                displayEmployees();
            } else {
                alert('Invalid index. Please enter a valid index.');
            }
        }
    });

    trackAttendanceButton.addEventListener('click', function() {
        const attendanceDate = prompt('Enter the attendance date (YYYY-MM-DD):');
        if (attendanceDate !== null) {
            const formattedDate = new Date(attendanceDate).toISOString().split('T')[0];
            if (formattedDate) {
                for (const employeeName in attendanceData) {
                    if (attendanceData.hasOwnProperty(employeeName)) {
                        const status = confirm(`Is ${employeeName} present on ${formattedDate}?`);
                        attendanceData[employeeName].push({ date: formattedDate, present: status });
                    }
                }
                localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
            } else {
                alert('Invalid date format. Please enter the date in YYYY-MM-DD format.');
            }
        }
    });

    displayEmployees(); 
});
