import React from 'react';
import { BookOpen, TrendingUp, Award, FileText } from 'lucide-react';
import './ParentViews.css';

const ParentAcademicView = () => {
    const subjects = [
        { name: 'Mathematics', grade: 'A', percentage: 92, teacher: 'Mr. Johnson' },
        { name: 'Science', grade: 'A-', percentage: 88, teacher: 'Ms. Smith' },
        { name: 'English', grade: 'B+', percentage: 85, teacher: 'Mrs. Williams' },
        { name: 'History', grade: 'A', percentage: 90, teacher: 'Mr. Brown' },
    ];

    const examHistory = [
        { exam: 'Mid-Term Exam', date: 'Nov 15, 2025', score: '92%', grade: 'A' },
        { exam: 'Quarterly Test', date: 'Oct 10, 2025', score: '88%', grade: 'A-' },
        { exam: 'Unit Test', date: 'Sep 20, 2025', score: '85%', grade: 'B+' },
    ];

    return (
        <div className="parent-view-container">
            <div className="view-header">
                <h1 className="view-title">Academic Profile</h1>
                <p className="view-subtitle">View your child's academic performance and progress</p>
            </div>

            <div className="view-content">
                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Subject Performance</h2>
                        <TrendingUp size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        <div className="subjects-grid">
                            {subjects.map((subject, index) => (
                                <div key={index} className="subject-card">
                                    <div className="subject-header">
                                        <BookOpen size={24} className="text-blue-600" />
                                        <h3>{subject.name}</h3>
                                    </div>
                                    <div className="subject-stats">
                                        <div className="stat">
                                            <span className="stat-label">Grade</span>
                                            <span className="stat-value grade">{subject.grade}</span>
                                        </div>
                                        <div className="stat">
                                            <span className="stat-label">Percentage</span>
                                            <span className="stat-value">{subject.percentage}%</span>
                                        </div>
                                    </div>
                                    <p className="subject-teacher">Teacher: {subject.teacher}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Exam History</h2>
                        <FileText size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        <div className="exam-history-list">
                            {examHistory.map((exam, index) => (
                                <div key={index} className="exam-history-item">
                                    <div className="exam-info">
                                        <h4>{exam.exam}</h4>
                                        <p>{exam.date}</p>
                                    </div>
                                    <div className="exam-results">
                                        <span className="exam-score">{exam.score}</span>
                                        <span className="exam-grade">{exam.grade}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Progress Chart</h2>
                        <Award size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        <div className="chart-placeholder">
                            <p>Performance trend chart will be displayed here</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentAcademicView;

