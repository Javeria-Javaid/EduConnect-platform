// Mock Teachers Data

export const mockTeachers = [
    {
        id: 1,
        name: 'Ms. Sarah Johnson',
        email: 'sarah.johnson@educonnect.pk',
        phone: '+92-300-1234567',
        designation: 'Senior Teacher',
        subjects: ['Mathematics', 'Physics'],
        classCount: 5,
        weeklyLoad: 24,
        attendance: 98,
        employmentType: 'Full-time',
        status: 'Active',
        photo: 'https://via.placeholder.com/50'
    },
    {
        id: 2,
        name: 'Mr. Michael Chen',
        email: 'michael.chen@educonnect.pk',
        phone: '+92-300-2345678',
        designation: 'Head of Science',
        subjects: ['Chemistry', 'Biology'],
        classCount: 4,
        weeklyLoad: 22,
        attendance: 96,
        employmentType: 'Full-time',
        status: 'Active',
        photo: 'https://via.placeholder.com/50'
    },
    {
        id: 3,
        name: 'Ms. Emily Davis',
        email: 'emily.davis@educonnect.pk',
        phone: '+92-300-3456789',
        designation: 'Teacher',
        subjects: ['English', 'Literature'],
        classCount: 6,
        weeklyLoad: 20,
        attendance: 95,
        employmentType: 'Part-time',
        status: 'Active',
        photo: 'https://via.placeholder.com/50'
    }
];

export const teacherFilters = [
    {
        key: 'subjects',
        label: 'Subjects',
        type: 'multiselect',
        options: [
            { label: 'Mathematics', value: 'Mathematics' },
            { label: 'Physics', value: 'Physics' },
            { label: 'Chemistry', value: 'Chemistry' }
        ]
    },
    {
        key: 'employmentType',
        label: 'Employment Type',
        type: 'multiselect',
        options: [
            { label: 'Full-time', value: 'Full-time' },
            { label: 'Part-time', value: 'Part-time' }
        ]
    }
];
