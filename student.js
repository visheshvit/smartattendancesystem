// Function to mark attendance
function markAttendance() {
    const name = document.getElementById('studentName').value;
    const rollNumber = document.getElementById('studentRollNumber').value;
    const branch = document.getElementById('studentBranch').value;
    const division = document.getElementById('studentDivision').value;

    const attendanceRecord = {
        date: new Date().toLocaleDateString(),
        timestamp: new Date().toLocaleTimeString(),
        name: name,
        rollNumber: rollNumber,
        branch: branch,
        division: division,
        status: 'Present'
    };

    // Retrieve existing attendance records
    const existingRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    existingRecords.push(attendanceRecord); // Add the new record

    // Save updated records back to localStorage
    localStorage.setItem('attendanceRecords', JSON.stringify(existingRecords));

    // Show notification
    document.getElementById('notification').style.display = 'block';

    // Hide notification after 3 seconds
    setTimeout(() => {
        document.getElementById('notification').style.display = 'none';
    }, 3000);

    // Reset the form fields after marking attendance
    document.getElementById('attendanceForm').reset();
    loadAttendanceHistory(); // Load attendance history after marking
}

// Function to load attendance history for the student
function loadAttendanceHistory() {
    const storedRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    const attendanceBody = document.getElementById('attendanceBody');
    attendanceBody.innerHTML = ''; // Clear the existing records

    storedRecords.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.date}</td>
            <td>${record.timestamp}</td>
            <td>${record.status}</td>
        `;
        attendanceBody.appendChild(row);
    });
}

// Attach event listener to the form
document.getElementById('attendanceForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    markAttendance(); // Call the function to mark attendance
});

// Attach event listener to the logout button
document.getElementById('logoutButton').addEventListener('click', function() {
    // Clear session-related data (if any)
    // Example: localStorage.removeItem('sessionToken'); 
    // You can add any specific keys you want to remove.

    // Optionally, show a logout alert
    alert('You have been logged out.');

    // Redirect to login page (replace 'index.html' with the actual login page URL)
    window.location.href = 'index.html';
});

// Load attendance history on page load
loadAttendanceHistory();
