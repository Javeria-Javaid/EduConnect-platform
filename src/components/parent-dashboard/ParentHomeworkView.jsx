import React from 'react';
import { Book, Clock, CheckCircle, FileText } from 'lucide-react';
import './ParentViews.css';

const ParentHomeworkView = () => {
    const homeworkList = [
        { id: 1, subject: 'Mathematics', title: 'Chapter 5 Exercises', due: 'Dec 8, 2025', status: 'pending', description: 'Complete exercises 1-20 from Chapter 5' },
        { id: 2, subject: 'Science', title: 'Lab Report', due: 'Dec 10, 2025', status: 'pending', description: 'Write a report on the chemistry experiment' },
        { id: 3, subject: 'English', title: 'Essay Writing', due: 'Dec 7, 2025', status: 'submitted', description: 'Write a 500-word essay on climate change' },
    ];

    return (
        <div className="parent-view-container">
            <div className="view-header">
                <h1 className="view-title">Homework & Assignments</h1>
                <p className="view-subtitle">View and track your child's homework assignments</p>
            </div>

            <div className="view-content">
                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">All Assignments</h2>
                        <Book size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        <div className="homework-list-view">
                            {homeworkList.map((hw) => (
                                <div key={hw.id} className="homework-card">
                                    <div className="homework-header">
                                        <div className="homework-subject">{hw.subject}</div>
                                        {hw.status === 'submitted' ? (
                                            <span className="badge badge-success">Submitted</span>
                                        ) : (
                                            <span className="badge badge-warning">Pending</span>
                                        )}
                                    </div>
                                    <h3 className="homework-title">{hw.title}</h3>
                                    <p className="homework-description">{hw.description}</p>
                                    <div className="homework-footer">
                                        <div className="homework-due-date">
                                            <Clock size={16} />
                                            <span>Due: {hw.due}</span>
                                        </div>
                                        {hw.status === 'submitted' && (
                                            <div className="homework-feedback">
                                                <CheckCircle size={16} className="text-green-600" />
                                                <span>Submitted on Dec 6, 2025</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentHomeworkView;

