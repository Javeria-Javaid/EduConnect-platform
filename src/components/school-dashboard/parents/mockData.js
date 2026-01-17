// Mock Parents Data

export const parentsStats = {
    totalParents: 1850,
    newParents: {
        week: 15,
        month: 42
    },
    linkedParents: 1780,
    unlinkedParents: 70,
    activeToday: 324,
    communication: {
        messagesSent: 1256,
        unreadMessages: 87,
        announcementsViewed: 1420,
        announcementsTotal: 1850
    },
    alerts: [
        { label: 'Unlinked Accounts', count: 70, severity: 'warning' },
        { label: 'Pending Verification', count: 23, severity: 'info' }
    ],
    recentActivity: [
        { id: 1, parent: 'Ali Hassan', action: 'Viewed report card', time: '2 min ago' },
        { id: 2, parent: 'Khan Sahib', action: 'Paid tuition fees', time: '15 min ago' },
        { id: 3, parent: 'Raza Ahmed', action: 'Sent message to teacher', time: '1 hr ago' },
        { id: 4, parent: 'Malik Sahib', action: 'Downloaded attendance report', time: '2 hrs ago' }
    ]
};
