// Comprehensive Mock Data for Teacher Dashboard

// Teacher Info
export const teacherInfo = {
    id: 'TCH001',
    name: 'Demo Teacher',
    email: 'teacher@educonnect.edu',
    subjects: ['Mathematics', 'Physics'],
    employeeId: 'EMP-2024-142',
    joinDate: '2020-08-15',
    qualification: 'M.Sc. Mathematics, B.Ed.',
    phone: '+92-300-1234567'
};

// Classes assigned to teacher
export const teacherClasses = [
    {
        id: 'CLS001',
        name: 'Mathematics',
        grade: '10-A',
        section: 'A',
        subject: 'Mathematics',
        students: 32,
        schedule: 'Mon, Wed, Fri - 9:00 AM',
        room: 'Room 101',
        academicYear: '2024-2025'
    },
    {
        id: 'CLS002',
        name: 'Physics',
        grade: '11-B',
        section: 'B',
        subject: 'Physics',
        students: 28,
        schedule: 'Tue, Thu - 10:30 AM',
        room: 'Lab 2',
        academicYear: '2024-2025'
    },
    {
        id: 'CLS003',
        name: 'Mathematics',
        grade: '10-B',
        section: 'B',
        subject: 'Mathematics',
        students: 30,
        schedule: 'Mon, Wed, Fri - 11:30 AM',
        room: 'Room 102',
        academicYear: '2024-2025'
    },
    {
        id: 'CLS004',
        name: 'Physics',
        grade: '11-A',
        section: 'A',
        subject: 'Physics',
        students: 26,
        schedule: 'Tue, Thu - 2:00 PM',
        room: 'Lab 1',
        academicYear: '2024-2025'
    }
];

// Students across all classes
export const students = [
    // Class 10-A Students (Mathematics)
    { id: 'STU001', name: 'Ahmed Ali', class: '10-A', rollNo: 1, attendance: 95, avgScore: 88 },
    { id: 'STU002', name: 'Sara Khan', class: '10-A', rollNo: 2, attendance: 98, avgScore: 92 },
    { id: 'STU003', name: 'Ali Hassan', class: '10-A', rollNo: 3, attendance: 87, avgScore: 78 },
    { id: 'STU004', name: 'Fatima Noor', class: '10-A', rollNo: 4, attendance: 96, avgScore: 85 },
    { id: 'STU005', name: 'Usman Malik', class: '10-A', rollNo: 5, attendance: 92, avgScore: 82 },

    // Class 11-B Students (Physics)
    { id: 'STU021', name: 'Zainab Ahmed', class: '11-B', rollNo: 1, attendance: 94, avgScore: 86 },
    { id: 'STU022', name: 'Hassan Raza', class: '11-B', rollNo: 2, attendance: 91, avgScore: 79 },
    { id: 'STU023', name: 'Aisha Tariq', class: '11-B', rollNo: 3, attendance: 97, avgScore: 90 },

    // Class 10-B Students (Mathematics)
    { id: 'STU041', name: 'Bilal Hussain', class: '10-B', rollNo: 1, attendance: 89, avgScore: 75 },
    { id: 'STU042', name: 'Maryam Siddiqui', class: '10-B', rollNo: 2, attendance: 96, avgScore: 88 },
];

// Attendance data
export const attendanceData = {
    today: {
        date: '2025-12-12',
        classes: [
            {
                classId: 'CLS001',
                className: '10-A Mathematics',
                totalStudents: 32,
                present: 30,
                absent: 2,
                late: 0,
                marked: true
            },
            {
                classId: 'CLS002',
                className: '11-B Physics',
                totalStudents: 28,
                present: 0,
                absent: 0,
                late: 0,
                marked: false
            }
        ]
    },
    monthly: {
        totalClasses: 76,
        present: 2234,
        absent: 98,
        late: 42,
        averageAttendance: 95.8
    }
};

// Homework assignments
export const homeworkAssignments = [
    {
        id: 'HW001',
        title: 'Quadratic Equations Practice',
        class: '10-A',
        subject: 'Mathematics',
        assignedDate: '2025-12-08',
        dueDate: '2025-12-15',
        totalStudents: 32,
        submitted: 28,
        graded: 20,
        pending: 4,
        description: 'Solve problems 1-15 from Chapter 4',
        maxMarks: 20
    },
    {
        id: 'HW002',
        title: 'Newton\'s Laws Lab Report',
        class: '11-B',
        subject: 'Physics',
        assignedDate: '2025-12-10',
        dueDate: '2025-12-17',
        totalStudents: 28,
        submitted: 15,
        graded: 0,
        pending: 13,
        description: 'Complete lab report on Newton\'s Laws experiment',
        maxMarks: 25
    },
    {
        id: 'HW003',
        title: 'Trigonometry Worksheet',
        class: '10-B',
        subject: 'Mathematics',
        assignedDate: '2025-12-11',
        dueDate: '2025-12-18',
        totalStudents: 30,
        submitted: 22,
        graded: 15,
        pending: 8,
        description: 'Complete worksheet on trigonometric identities',
        maxMarks: 15
    }
];

// Exams
export const exams = [
    {
        id: 'EX001',
        title: 'Mid-Term Mathematics',
        class: '10-A',
        subject: 'Mathematics',
        date: '2025-12-20',
        duration: '2 hours',
        totalMarks: 100,
        studentsAppeared: 32,
        averageScore: 76.5,
        highestScore: 98,
        lowestScore: 45,
        published: true
    },
    {
        id: 'EX002',
        title: 'Physics Unit Test',
        class: '11-B',
        subject: 'Physics',
        date: '2025-12-18',
        duration: '1.5 hours',
        totalMarks: 50,
        studentsAppeared: 28,
        averageScore: 38.2,
        highestScore: 48,
        lowestScore: 22,
        published: false
    },
    {
        id: 'EX003',
        title: 'Final Term - Mathematics',
        class: '10-B',
        subject: 'Mathematics',
        date: '2026-01-15',
        duration: '3 hours',
        totalMarks: 100,
        studentsAppeared: 0,
        published: false,
        upcoming: true
    }
];

// Announcements
export const announcements = [
    {
        id: 'ANN001',
        title: 'Parent-Teacher Meeting',
        date: '2025-12-15',
        priority: 'high',
        content: 'Parent-teacher meeting scheduled for Saturday. Please prepare progress reports.',
        type: 'school'
    },
    {
        id: 'ANN002',
        title: 'Winter Break Schedule',
        date: '2025-12-20',
        priority: 'medium',
        content: 'School will be closed from Dec 24 to Jan 2 for winter break.',
        type: 'school'
    },
    {
        id: 'ANN003',
        title: 'Science Fair Participation',
        date: '2025-12-10',
        priority: 'low',
        content: 'Encourage students to participate in the annual science fair.',
        type: 'department'
    }
];

// Performance trends (for charts)
export const performanceTrends = [
    { week: 'Week 1', math10A: 75, physics11B: 72, math10B: 70 },
    { week: 'Week 2', math10A: 78, physics11B: 75, math10B: 73 },
    { week: 'Week 3', math10A: 76, physics11B: 78, math10B: 76 },
    { week: 'Week 4', math10A: 82, physics11B: 80, math10B: 78 },
    { week: 'Week 5', math10A: 85, physics11B: 82, math10B: 80 },
    { week: 'Week 6', math10A: 83, physics11B: 85, math10B: 82 }
];

// Today's schedule
export const todaysSchedule = [
    {
        id: 1,
        time: '9:00 AM - 10:00 AM',
        subject: 'Mathematics',
        class: '10-A',
        room: 'Room 101',
        topic: 'Quadratic Equations',
        status: 'completed'
    },
    {
        id: 2,
        time: '10:15 AM - 11:15 AM',
        subject: 'Physics',
        class: '11-B',
        room: 'Lab 2',
        topic: 'Newton\'s Laws',
        status: 'in-progress'
    },
    {
        id: 3,
        time: '11:30 AM - 12:30 PM',
        subject: 'Mathematics',
        class: '10-B',
        room: 'Room 102',
        topic: 'Trigonometry',
        status: 'upcoming'
    },
    {
        id: 4,
        time: '2:00 PM - 3:00 PM',
        subject: 'Physics',
        class: '11-A',
        room: 'Lab 1',
        topic: 'Optics',
        status: 'upcoming'
    }
];

// Communication/Messages
export const messages = [
    {
        id: 'MSG001',
        from: 'Mrs. Ahmed (Parent)',
        subject: 'Sara\'s Progress Inquiry',
        date: '2025-12-11',
        preview: 'I would like to discuss Sara\'s recent test performance...',
        unread: true,
        studentId: 'STU002'
    },
    {
        id: 'MSG002',
        from: 'Principal Office',
        subject: 'Meeting Reminder',
        date: '2025-12-10',
        preview: 'Reminder: Department meeting tomorrow at 3 PM...',
        unread: false,
        type: 'official'
    },
    {
        id: 'MSG003',
        from: 'Mr. Hassan (Parent)',
        subject: 'Absence Notification',
        date: '2025-12-09',
        preview: 'Ali will be absent tomorrow due to medical appointment...',
        unread: false,
        studentId: 'STU003'
    }
];

// Resources/Materials
export const teachingResources = [
    {
        id: 'RES001',
        title: 'Chapter 4 - Quadratic Equations PPT',
        type: 'presentation',
        class: '10-A',
        uploadDate: '2025-12-01',
        size: '2.5 MB',
        downloads: 28
    },
    {
        id: 'RES002',
        title: 'Physics Lab Manual - Newton\'s Laws',
        type: 'document',
        class: '11-B',
        uploadDate: '2025-12-05',
        size: '1.8 MB',
        downloads: 24
    },
    {
        id: 'RES003',
        title: 'Trigonometry Practice Questions',
        type: 'worksheet',
        class: '10-B',
        uploadDate: '2025-12-08',
        size: '500 KB',
        downloads: 30
    }
];

// Analytics summary
export const analyticsSummary = {
    totalClasses: 4,
    totalStudents: 116,
    attendanceRate: 95.8,
    homeworkSubmissionRate: 87.5,
    averageClassScore: 78.4,
    pendingGrading: 12,
    upcomingExams: 2
};
