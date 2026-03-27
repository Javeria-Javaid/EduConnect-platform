// Static base filters (dynamic filters for subjects and classes will be appended at runtime)
export const teacherFilters = [
    {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: [
            { label: 'Active', value: 'Active' },
            { label: 'On Leave', value: 'On Leave' },
            { label: 'Inactive', value: 'Inactive' },
            { label: 'Suspended', value: 'Suspended' }
        ]
    },
    {
        key: 'employmentType',
        label: 'Employment Type',
        type: 'select',
        options: [
            { label: 'Full-time', value: 'Full-time' },
            { label: 'Part-time', value: 'Part-time' },
            { label: 'Contract', value: 'Contract' }
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
