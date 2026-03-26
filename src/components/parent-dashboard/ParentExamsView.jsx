import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Calendar, Award, Download, Clock } from 'lucide-react';
import { toast } from 'sonner';
import './ParentViews.css';

const ParentExamsView = () => {
    const [data, setData] = useState({ activeChildData: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExamData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/parent/dashboard-data`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setData(await res.json());
            } catch (error) { toast.error('Error fetching exam data'); }
            finally { setLoading(false); }
        };
        fetchExamData();
    }, []);

    const examResults = data.activeChildData?.examResults || [];
    const upcomingExams = []; // We can fetch pending exams from Exam collection if needed, using placeholders for now if empty.

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
                        {loading ? <p>Loading exams...</p> : upcomingExams.length === 0 ? <p>No upcoming exams scheduled.</p> : (
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
                        )}
                    </div>
                </div>

                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Exam Results</h2>
                        <Award size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        {loading ? <p>Loading results...</p> : examResults.length === 0 ? <p>No exam results found.</p> : (
                            <div className="results-list">
                                {examResults.map((result) => (
                                    <div key={result._id} className="result-item">
                                        <div className="result-info">
                                            <h4>{result.exam?.name || 'Unknown Exam'}</h4>
                                            <p>{result.exam ? new Date(result.exam.startDate).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                        <div className="result-scores">
                                            <span className="result-score">{Math.round(result.percentage)}%</span>
                                            <span className="result-grade">{result.percentage >= 90 ? 'A+' : result.percentage >= 80 ? 'A' : result.percentage >= 70 ? 'B' : result.percentage >= 60 ? 'C' : 'F'}</span>
                                        </div>
                                        <button className="btn-download">
                                            <Download size={16} />
                                            Download
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentExamsView;

