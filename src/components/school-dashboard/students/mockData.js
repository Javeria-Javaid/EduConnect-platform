// Mock Students Data

export const mockStudents = [
    {
        id: 1,
        name: 'Ahmed Ali',
        admissionNumber: 'STU-2024-001',
        class: 'Grade 10',
        section: 'A',
        rollNumber: '01',
        parentName: 'Ali Hassan',
        gender: 'Male',
        attendance: 95,
        feeStatus: 'Paid',
        performance: 5,
        photo: 'https://via.placeholder.com/50'
    },
    {
        id: 2,
        name: 'Fatima Khan',
        admissionNumber: 'STU-2024-002',
        class: 'Grade 10',
        section: 'A',
        rollNumber: '02',
        parentName: 'Khan Sahib',
        gender: 'Female',
        attendance: 92,
        feeStatus: 'Paid',
        performance: 5,
        photo: 'https://via.placeholder.com/50'
    },
    {
        id: 3,
        name: 'Hassan Raza',
        admissionNumber: 'STU-2024-003',
        class: 'Grade 10',
        section: 'B',
        rollNumber: '03',
        parentName: 'Raza Ahmed',
        gender: 'Male',
        attendance: 88,
        feeStatus: 'Pending',
        performance: 4,
        photo: 'https://via.placeholder.com/50'
    },
    {
        id: 4,
        name: 'Ayesha Malik',
        admissionNumber: 'STU-2024-004',
        class: 'Grade 9',
        section: 'A',
        rollNumber: '04',
        parentName: 'Malik Sahib',
        gender: 'Female',
        attendance: 96,
        feeStatus: 'Paid',
        performance: 5,
        photo: 'https://via.placeholder.com/50'
    },
    {
        id: 5,
        name: 'Usman Shah',
        admissionNumber: 'STU-2024-005',
        class: 'Grade 9',
        section: 'B',
        rollNumber: '05',
        parentName: 'Shah Jee',
        gender: 'Male',
        attendance: 85,
        feeStatus: 'Overdue',
        performance: 3,
        photo: 'https://via.placeholder.com/50'
    }
];

export const studentFilters = [
    {
        key: 'class',
        label: 'Class',
        type: 'multiselect',
        options: [
            { label: 'Grade 10', value: 'Grade 10' },
            { label: 'Grade 9', value: 'Grade 9' },
            { label: 'Grade 8', value: 'Grade 8' }
        ]
    },
    {
        key: 'section',
        label: 'Section',
        type: 'multiselect',
        options: [
            { label: 'A', value: 'A' },
            { label: 'B', value: 'B' },
            { label: 'C', value: 'C' }
        ]
    },
    {
        key: 'gender',
        label: 'Gender',
        type: 'select',
        options: [
            { label: 'Male', value: 'Male' },
            { label: 'Female', value: 'Female' }
        ]
    },
    {
        key: 'feeStatus',
        label: 'Fee Status',
        type: 'multiselect',
        options: [
            { label: 'Paid', value: 'Paid' },
            { label: 'Pending', value: 'Pending' },
            { label: 'Overdue', value: 'Overdue' },
            { label: 'Not Set', value: 'Not Set' }
        ]
    },
    {
        key: 'attendanceRange',
        label: 'Attendance',
        type: 'select',
        options: [
            { label: 'Below 50%', value: 'Below 50%' },
            { label: '50-75%', value: '50-75%' },
            { label: 'Above 75%', value: 'Above 75%' }
        ]
    },
    {
        key: 'performanceRange',
        label: 'Performance',
        type: 'select',
        options: [
            { label: '5 Stars', value: '5' },
            { label: '4 Stars', value: '4' },
            { label: '3 Stars', value: '3' },
            { label: '2 Stars', value: '2' },
            { label: '1 Star', value: '1' }
        ]
    }
];
