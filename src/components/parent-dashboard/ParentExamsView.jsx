import React from 'react';
import { FileSpreadsheet, Calendar, Award, Download, Clock } from 'lucide-react';
import './ParentViews.css';

const ParentExamsView = () => {
    const upcomingExams = [
        { id: 1, subject: 'Mathematics', type: 'Mid-Term', date: 'Dec 15, 2025', time: '9:00 AM - 11:00 AM', room: 'Hall A' },
        { id: 2, subject: 'Science', type: 'Mid-Term', date: 'Dec 18, 2025', time: '9:00 AM - 11:00 AM', room: 'Hall B' },
    ];

    const examResults = [
        { id: 1, exam: 'Quarterly Test', date: 'Nov 15, 2025', score: '92%', grade: 'A', status: 'published' },
        { id: 2, exam: 'Unit Test', date: 'Oct 10, 2025', score: '88%', grade: 'A-', status: 'published' },
    ];

    return (
        <div className="parent-view-container">
            <div className="view-header">
                <h1 className="view-title">Exams & Results</h1>
                <p className="view-subtitle">View exam schedules and results</p>
            </div>

            <div className="view-content">
                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Upcoming Exams</h2>
                        <Calendar size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        <div className="exams-list-view">
                            {upcomingExams.map((exam) => (
                                <div key={exam.id} className="exam-card">
                                    <div className="exam-date-badge">
                                        <span className="exam-day">15</span>
                                        <span className="exam-month">Dec</span>
                                    </div>
                                    <div className="exam-details">
                                        <h3>{exam.subject} - {exam.type}</h3>
                                        <div className="exam-info">
                                            <span><Calendar size={14} /> {exam.date}</span>
                                            <span><Clock size={14} /> {exam.time}</span>
                                            <span>Room: {exam.room}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Exam Results</h2>
                        <Award size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        <div className="results-list">
                            {examResults.map((result) => (
                                <div key={result.id} className="result-item">
                                    <div className="result-info">
                                        <h4>{result.exam}</h4>
                                        <p>{result.date}</p>
                                    </div>
                                    <div className="result-scores">
                                        <span className="result-score">{result.score}</span>
                                        <span className="result-grade">{result.grade}</span>
                                    </div>
                                    <button className="btn-download">
                                        <Download size={16} />
                                        Download
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentExamsView;

