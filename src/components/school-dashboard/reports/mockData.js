// Mock Data for School Dashboard Components

// Reports Overview Data
export const reportsOverviewData = {
    summaryCards: [
        { label: 'Total Students', value: '1,245', change: '+12', icon: 'Users' },
        { label: 'Active Teachers', value: '87', change: '+3', icon: 'UserCheck' },
        { label: 'Classes', value: '42', change: '+2', icon: 'Book' },
        { label: 'Attendance', value: '94%', change: '+2%', icon: 'Calendar' }
    ],
    recentReports: [
        { title: 'Q1 Academic Report', date: '2025-03-15', type: 'Academic' },
        { title: 'Monthly Attendance', date: '2025-03-01', type: 'Attendance' },
        { title: 'Finance Summary', date: '2025-02-28', type: 'Finance' }
    ],
    enrollmentTrend: [
        { month: 'Jan', students: 1200 },
        { month: 'Feb', students: 1220 },
        { month: 'Mar', students: 1245 }
    ],
    attendanceDistribution: [
        { category: 'Present', value: 94 },
        { category: 'Absent', value: 6 }
    ],

    // Teacher Reports
    teacherReports: [
        { name: 'Sarah Johnson', subject: 'Mathematics', workload: '24h', attendance: '98%', performance: 'Excellent', lastEvaluation: '2025-03-10' },
        { name: 'Michael Chen', subject: 'Science', workload: '22h', attendance: '96%', performance: 'Excellent', lastEvaluation: '2025-03-12' },
        { name: 'Emily Davis', subject: 'English', workload: '20h', attendance: '95%', performance: 'Good', lastEvaluation: '2025-03-08' },
        { name: 'Robert Wilson', subject: 'History', workload: '18h', attendance: '97%', performance: 'Good', lastEvaluation: '2025-03-09' },
        { name: 'Lisa Anderson', subject: 'Physics', workload: '23h', attendance: '99%', performance: 'Excellent', lastEvaluation: '2025-03-11' }
    ],

    // Student Reports
    studentReports: [
        { id: 1, name: 'John Doe', class: '10-A', grade: 'A+', attendance: 95, status: 'Excellent' },
        { id: 2, name: 'Jane Smith', class: '10-B', grade: 'A', attendance: 92, status: 'Good' },
        { id: 3, name: 'Mike Johnson', class: '10-A', grade: 'B+', attendance: 88, status: 'Average' }
    ],

    // Finance Reports
    financeReports: [
        { id: 1, category: 'Tuition Fees', amount: 125000, status: 'Collected', month: 'March' },
        { id: 2, category: 'Transport Fees', amount: 35000, status: 'Pending', month: 'March' },
        { id: 3, category: 'Lab Fees', amount: 15000, status: 'Collected', month: 'March' }
    ],

    // Attendance Reports
    attendanceReports: [
        { class: '10-A', date: '2025-03-15', present: 42, absent: 3, percentage: 93 },
        { class: '10-B', date: '2025-03-15', present: 40, absent: 5, percentage: 89 },
        { class: '9-A', date: '2025-03-15', present: 38, absent: 2, percentage: 95 }
    ],

    // Academic Reports
    academicReports: [
        { subject: 'Mathematics', avgScore: 85, passRate: 95, topScore: 98 },
        { subject: 'Science', avgScore: 82, passRate: 92, topScore: 96 },
        { subject: 'English', avgScore: 88, passRate: 98, topScore: 99 }
    ],
    gradeDistribution: [
        { grade: 'A+', count: 45 },
        { grade: 'A', count: 120 },
        { grade: 'B', count: 85 },
        { grade: 'C', count: 30 }
    ],

    // Transport Reports
    transportReports: [
        { route: 'Route A', students: 45, capacity: 50, driver: 'Ahmed Ali', status: 'Active' },
        { route: 'Route B', students: 48, capacity: 50, driver: 'Hassan Khan', status: 'Active' },
        { route: 'Route C', students: 42, capacity: 50, driver: 'Imran Shah', status: 'Active' }
    ]
};

// Timetable Data
export const timetableStats = {
    totalTimetables: 42,
    recentlyUpdated: 5,
    conflicts: 2,
    teacherFree: 12
};

export const sampleTimetable = {
    class: 'Grade 10-A',
    periods: [
        {
            day: 'Monday',
            slots: [
                { period: '1', subject: 'Mathematics', time: '08:00-09:00', teacher: 'Ms. Sarah', room: 'R-101' },
                { period: '2', subject: 'English', time: '09:00-10:00', teacher: 'Mr. David', room: 'R-102' },
                { period: '3', subject: 'Science', time: '10:30-11:30', teacher: 'Dr. Khan', room: 'LAB-1' }
            ]
        },
        {
            day: 'Tuesday',
            slots: [
                { period: '1', subject: 'History', time: '08:00-09:00', teacher: 'Ms. Wilson', room: 'R-105' },
                { period: '2', subject: 'Physics', time: '09:00-10:00', teacher: 'Dr. Ahmed', room: 'LAB-2' },
                { period: '3', subject: 'Chemistry', time: '10:30-11:30', teacher: 'Ms. Lisa', room: 'LAB-3' }
            ]
        }
    ]
};

// Exams Data
export const examsData = {
    upcoming: [
        { id: 1, name: 'Mid-Term Exams', start: '2025-04-01', end: '2025-04-10', classes: '10', subjects: 8 },
        { id: 2, name: 'Monthly Test', start: '2025-03-25', end: '2025-03-27', classes: '9', subjects: 5 }
    ],
    active: [
        { id: 1, name: 'Unit Test', start: '2025-03-15', end: '2025-03-16', classes: '8', subjects: 3, status: 'In Progress' }
    ],
    completed: [
        { id: 1, name: 'Final Exams', start: '2025-02-01', end: '2025-02-15', classes: '12', subjects: 10 }
    ],
    stats: {
        upcomingCount: 2,
        activeCount: 1,
        pendingResults: 3,
        completedCount: 1,
        topClass: 'Grade 10-A (92%)',
        lowClass: 'Grade 8-C (65%)'
    }
};

export const examTimetable = [
    { subject: 'Mathematics', date: '2025-04-01', time: '09:00 AM', room: 'Hall-A', invigilator: 'Ms. Sarah' },
    { subject: 'English', date: '2025-04-02', time: '09:00 AM', room: 'Hall-A', invigilator: 'Mr. David' },
    { subject: 'Science', date: '2025-04-03', time: '09:00 AM', room: 'Hall-B', invigilator: 'Dr. Khan' },
    { subject: 'History', date: '2025-04-04', time: '09:00 AM', room: 'Hall-A', invigilator: 'Ms. Wilson' },
    { subject: 'Physics', date: '2025-04-05', time: '09:00 AM', room: 'Hall-B', invigilator: 'Dr. Ahmed' }
];

// Classes Data
export const classesStats = {
    totalClasses: 42,
    totalSections: 84,
    avgStudents: 38,
    teacherAssignment: 95,
    recentlyAdded: 3,
    issues: [
        { type: 'Overcrowded', count: 5 },
        { type: 'No Teacher', count: 2 },
        { type: 'Low Attendance', count: 3 }
    ]
};

export const classesData = [
    { id: 1, name: 'Grade 10', section: 'A', teacher: 'Ms. Sarah Johnson', students: 42, room: 'R-101', attendance: 92 },
    { id: 2, name: 'Grade 10', section: 'B', teacher: 'Mr. Michael Chen', students: 40, room: 'R-102', attendance: 89 },
    { id: 3, name: 'Grade 9', section: 'A', teacher: 'Ms. Emily Davis', students: 38, room: 'R-201', attendance: 95 },
    { id: 4, name: 'Grade 9', section: 'B', teacher: 'Mr. Robert Wilson', students: 35, room: 'R-202', attendance: 91 },
    { id: 5, name: 'Grade 8', section: 'A', teacher: 'Dr. Lisa Anderson', students: 40, room: 'R-301', attendance: 88 }
];

// Finance Data (for SchoolFinanceView)
export const financeStats = {
    totalRevenue: '₨2,450,000',
    totalExpenses: '₨1,850,000',
    pendingFees: '₨320,000',
    netBalance: '₨600,000'
};

export const recentTransactions = [
    { id: 1, date: '2025-03-15', description: 'Tuition Fees - Grade 10', amount: 125000, type: 'income' },
    { id: 2, date: '2025-03-14', description: 'Teacher Salaries', amount: -450000, type: 'expense' },
    { id: 3, date: '2025-03-13', description: 'Lab Equipment', amount: -85000, type: 'expense' },
    { id: 4, date: '2025-03-12', description: 'Transport Fees', amount: 35000, type: 'income' },
    { id: 5, date: '2025-03-11', description: 'Utility Bills', amount: -25000, type: 'expense' }
];

export const expenseCategories = [
    { category: 'Salaries', amount: 450000, percentage: 60 },
    { category: 'Utilities', amount: 100000, percentage: 13 },
    { category: 'Maintenance', amount: 80000, percentage: 11 },
    { category: 'Supplies', amount: 120000, percentage: 16 }
];

// Transport Data (for SchoolTransportView)
export const transportStats = {
    totalVehicles: 12,
    activeRoutes: 8,
    studentsTransported: 450,
    maintenanceDue: 2
};

export const vehicles = [
    { id: 1, number: 'VAN-001', capacity: 50, status: 'Active', driver: 'Ahmed Ali', route: 'Route A' },
    { id: 2, number: 'VAN-002', capacity: 50, status: 'Active', driver: 'Hassan Khan', route: 'Route B' },
    { id: 3, number: 'VAN-003', capacity: 45, status: 'Maintenance', driver: 'Imran Shah', route: 'Route C' },
    { id: 4, number: 'BUS-001', capacity: 60, status: 'Active', driver: 'Usman Malik', route: 'Route D' }
];

export const routes = [
    { id: 1, name: 'Route A', stops: 8, students: 45, duration: '45 min', status: 'Running' },
    { id: 2, name: 'Route B', stops: 10, students: 48, duration: '55 min', status: 'Running' },
    { id: 3, name: 'Route C', stops: 6, students: 42, duration: '35 min', status: 'Delayed' },
    { id: 4, name: 'Route D', stops: 12, students: 55, duration: '65 min', status: 'Running' }
];

export const transportAlerts = [
    { type: 'Maintenance Due', vehicle: 'VAN-003', priority: 'high' },
    { type: 'Route Delay', route: 'Route C', priority: 'medium' }
];

// Attendance Data (for SchoolAttendanceView)
export const attendanceStats = {
    todayAttendance: 93.6,
    totalPresent: 1165,
    totalAbsent: 80,
    totalLeave: 35,
    missingSubmissions: 2,
    irregularStudents: 3,
    attendanceRate: 93.6,
    weeklyAverage: 94.2
};

export const classAttendance = [
    { class: '10-A', section: 'A', present: 40, absent: 2, leave: 0, total: 42, attendance: 95, percentage: 95.2 },
    { class: '10-B', section: 'B', present: 37, absent: 3, leave: 0, total: 40, attendance: 92, percentage: 92.5 },
    { class: '9-A', section: 'A', present: 36, absent: 2, leave: 0, total: 38, attendance: 95, percentage: 94.7 },
    { class: '9-B', section: 'B', present: 33, absent: 2, leave: 0, total: 35, attendance: 94, percentage: 94.3 },
    { class: '8-A', section: 'A', present: 38, absent: 2, leave: 0, total: 40, attendance: 95, percentage: 95.0 }
];

export const missingSubmissions = [
    { teacher: 'Ms. Sarah Johnson', class: '10', section: 'A', date: '2025-03-15' },
    { teacher: 'Mr. David Lee', class: '9', section: 'C', date: '2025-03-15' }
];

export const irregularStudents = [
    { name: 'Ali Hassan', class: '10-B', daysAbsent: 8, percentage: 60 },
    { name: 'Fatima Ahmed', class: '9-A', daysAbsent: 6, percentage: 70 },
    { name: 'Zainab Khan', class: '8-C', daysAbsent: 7, percentage: 65 }
];

// Admissions Data (for SchoolAdmissionsView)
export const admissionsStats = {
    activeCycles: 2,
    applicationsToday: 12,
    inReview: 45,
    approved: 152,
    rejected: 18,
    waitlisted: 23,
    conversionRate: 75,
    missingDocs: 8
};

export const admissionCycles = [
    {
        id: 1,
        name: '2025-2026 Academic Year',
        startDate: '2025-01-01',
        endDate: '2025-03-31',
        status: 'Active',
        seatsAvailable: 120,
        applicationsReceived: 245,
        classes: ['Grade 1', 'Grade 6', 'Grade 9']
    },
    {
        id: 2,
        name: 'Mid-Year Admissions 2025',
        startDate: '2025-06-01',
        endDate: '2025-07-15',
        status: 'Upcoming',
        seatsAvailable: 30,
        applicationsReceived: 45,
        classes: ['Grade 2', 'Grade 7']
    }
];

export const applications = {
    new: [
        {
            id: 1,
            studentName: 'Ahmed Ali',
            parentName: 'Muhammad Ali',
            class: 'Grade 10',
            date: '2025-03-01',
            documents: 3,
            required: 5
        },
        {
            id: 2,
            studentName: 'Fatima Noor',
            parentName: 'Abdul Noor',
            class: 'Grade 9',
            date: '2025-03-02',
            documents: 5,
            required: 5
        }
    ],
    underReview: [
        {
            id: 3,
            studentName: 'Sara Khan',
            parentName: 'Imran Khan',
            class: 'Grade 8',
            date: '2025-02-28',
            documents: 5,
            required: 5
        },
        {
            id: 4,
            studentName: 'Hassan Raza',
            parentName: 'Ali Raza',
            class: 'Grade 10',
            date: '2025-02-27',
            documents: 4,
            required: 5
        }
    ],
    approved: [
        {
            id: 5,
            studentName: 'Ayesha Malik',
            parentName: 'Tariq Malik',
            class: 'Grade 9',
            date: '2025-02-25',
            documents: 5,
            required: 5
        }
    ]
};

