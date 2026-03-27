import React, { useEffect, useState } from 'react';
import { Book, Clock, CheckCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';
import './ParentViews.css';

const ParentHomeworkView = () => {
    const [homeworkList, setHomeworkList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/parent/dashboard-data`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (!res.ok) throw new Error();

                const exams = data?.activeChildData?.examResults || [];
                const upcoming = exams
                    .filter(r => r?.exam?.startDate && new Date(r.exam.startDate) >= new Date())
                    .sort((a, b) => new Date(a.exam.startDate) - new Date(b.exam.startDate))
                    .slice(0, 8)
                    .map((r, idx) => ({
                        id: r._id || idx,
                        subject: 'Exam Preparation',
                        title: r.exam?.name || 'Upcoming Exam',
                        due: new Date(r.exam.startDate).toLocaleDateString(),
                        status: 'pending',
                        description: 'Prepare for this scheduled exam.'
                    }));

                setHomeworkList(upcoming);
            } catch {
                toast.error('Failed to load assignments');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

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
                            {loading ? (
                                <p>Loading assignments...</p>
                            ) : homeworkList.length === 0 ? (
                                <p>No pending assignments at the moment.</p>
                            ) : homeworkList.map((hw) => (
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

