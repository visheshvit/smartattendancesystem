// Function to convert a date string in 'MM/DD/YYYY' format to a Date object
function parseDate(dateString) {
    const parts = dateString.split("/");
    return new Date(parts[2], parts[0] - 1, parts[1]); // month is 0-indexed
}

// Load attendance data from local storage
function loadAttendanceData() {
    const storedRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    return storedRecords;
}

// Function to display attendance records in the table
function displayAttendance(branchFilter, divisionFilter, startDate, endDate) {
    const storedRecords = loadAttendanceData();
    const attendanceBody = document.getElementById('attendanceBody');
    attendanceBody.innerHTML = ''; // Clear existing records

    // Filter records by branch, division, and date range
    const filteredRecords = filterAttendanceRecords(storedRecords, branchFilter, divisionFilter, startDate, endDate);

    filteredRecords.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.date}</td>
            <td>${record.timestamp}</td>
            <td>${record.name}</td>
            <td>${record.rollNumber}</td>
            <td>${record.branch}</td>
            <td>${record.division}</td>
            <td>${record.status}</td>
        `;
        attendanceBody.appendChild(row);
    });

    return filteredRecords; // Return filtered records for CSV download
}

// Function to filter attendance records based on selected criteria
function filterAttendanceRecords(records, branchFilter, divisionFilter, startDate, endDate) {
    return records.filter(record => {
        const recordDate = parseDate(record.date); // Convert record.date to a Date object

        // Convert startDate and endDate strings to Date objects (if they exist)
        const start = startDate ? parseDate(startDate) : null;
        const end = endDate ? parseDate(endDate) : null;

        // Check if the record date falls within the selected date range
        const isWithinDateRange = (!start || recordDate >= start) && (!end || recordDate <= end);

        // Handle the case where both start and end dates are the same (e.g., today's date)
        if (start && end && start.getTime() === end.getTime()) {
            return recordDate.getTime() === start.getTime(); // Match only if the record date is exactly the same as the selected date
        }

        return (branchFilter === 'All' || record.branch === branchFilter) &&
               (divisionFilter === 'All' || record.division === divisionFilter) &&
               isWithinDateRange;
    });
}

// Function to download attendance data as CSV
function downloadCSV(records) {
    if (records.length === 0) {
        alert("No records to download.");
        return; // Prevent download if no records
    }
    
    let csvContent = "data:text/csv;charset=utf-8," 
                    + "Date,Timestamp,Name,Roll Number,Branch,Division,Status\n"; // Headers

    records.forEach(record => {
        const row = `${record.date},${record.timestamp},${record.name},${record.rollNumber},${record.branch},${record.division},${record.status}`;
        csvContent += row + "\n";
    });

    // Create a hidden download link and trigger the download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendance_records.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link); // Clean up
}

// Function to handle filters change
function handleFiltersChange() {
    const branchSelect = document.getElementById('branchSelect');
    const divisionSelect = document.getElementById('divisionSelect');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    const updateDisplay = () => {
        const selectedBranch = branchSelect.value;
        const selectedDivision = divisionSelect.value;
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        const filteredRecords = displayAttendance(selectedBranch, selectedDivision, startDate, endDate); // Refresh attendance display

        // Enable CSV download with the currently displayed records
        document.getElementById('downloadCSV').onclick = function() {
            downloadCSV(filteredRecords); // Download the filtered records
        };
    };

    branchSelect.addEventListener('change', updateDisplay);
    divisionSelect.addEventListener('change', updateDisplay);
    startDateInput.addEventListener('change', updateDisplay);
    endDateInput.addEventListener('change', updateDisplay);
}

// Initial load of attendance data (unfiltered)
const allRecords = displayAttendance('All', 'All', '', ''); // Load all attendance records by default

// Setup filter change listeners
handleFiltersChange();

// Set up CSV download for all records (unfiltered) on page load
document.getElementById('downloadCSV').onclick = function() {
    downloadCSV(allRecords); // Download all attendance records by default
};

// Logout functionality
document.getElementById('logoutButton').addEventListener('click', function() {
    window.location.href = 'index.html'; // Redirect to login page
});
