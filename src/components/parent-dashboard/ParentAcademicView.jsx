import React, { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, Award, FileText } from 'lucide-react';
import { toast } from 'sonner';
import './ParentViews.css';

const ParentAcademicView = () => {
    const [data, setData] = useState({ activeChildData: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAcademicData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/parent/dashboard-data`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setData(await res.json());
            } catch (error) { toast.error('Error fetching academic data'); }
            finally { setLoading(false); }
        };
        fetchAcademicData();
    }, []);

    const examResults = data.activeChildData?.examResults || [];
    
    // Compute flattened subjects
    const subjects = [];
    examResults.forEach(r => {
        if (r.marks) {
            r.marks.forEach(m => {
                const existing = subjects.find(s => s.name === m.subject);
                if (!existing) {
                    subjects.push({ name: m.subject, obtained: m.obtained, total: m.total });
                } else {
                    existing.obtained += m.obtained;
                    existing.total += m.total;
                }
            });
        }
    });

    const getGrade = (percentage) => {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B';
        if (percentage >= 60) return 'C';
        return 'F';
    };

    const finalSubjects = subjects.map(s => {
        const percentage = s.total > 0 ? (s.obtained / s.total) * 100 : 0;
        return {
            name: s.name,
            grade: getGrade(percentage),
            percentage: Math.round(percentage),
        };
    });

    const sortedExamResults = [...examResults].sort((a, b) => new Date(b.exam?.startDate || 0) - new Date(a.exam?.startDate || 0));
    const examHistory = sortedExamResults.map(r => ({
        exam: r.exam?.name || 'Unknown Exam',
        date: r.exam ? new Date(r.exam.startDate).toLocaleDateString() : 'N/A',
        score: `${Math.round(r.percentage || 0)}%`,
        grade: getGrade(r.percentage || 0)
    }));

    const avgExamPercentage = examResults.length
        ? Math.round(examResults.reduce((sum, r) => sum + (r.percentage || 0), 0) / examResults.length)
        : null;

    return (
        <div className="parent-view-container">
            <div className="view-header">
                <h1 className="view-title">Academic Profile {data.activeChildData ? `- ${data.activeChildData.profile.user.firstName}` : ''}</h1>
                <p className="view-subtitle">View your child's academic performance and progress</p>
            </div>

            <div className="view-content">
                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Subject Performance</h2>
                        <TrendingUp size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        {loading ? <p>Loading subjects...</p> : finalSubjects.length === 0 ? <p>No subject data directly available.</p> : (
                            <div className="subjects-grid">
                                {finalSubjects.map((subject, index) => (
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
                        )}
                    </div>
                </div>

                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Exam History</h2>
                        <FileText size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        {loading ? <p>Loading history...</p> : examHistory.length === 0 ? <p>No exam history found.</p> : (
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
                        )}
                    </div>
                </div>

                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Performance Summary</h2>
                        <Award size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        {loading ? (
                            <p>Loading summary...</p>
                        ) : avgExamPercentage === null ? (
                            <p>No performance data.</p>
                        ) : (
                            <div style={{ display: 'grid', gap: 10 }}>
                                <p style={{ marginBottom: 0, color: '#475569' }}>
                                    Average across exams: <span style={{ fontWeight: 700, color: '#3b82f6' }}>{avgExamPercentage}%</span>
                                </p>
                                <div style={{ display: 'grid', gap: 8 }}>
                                    {examHistory.slice(0, 4).map((h, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff' }}>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{h.exam}</div>
                                                <div style={{ fontSize: 12, color: '#6b7280' }}>{h.date}</div>
                                            </div>
                                            <div style={{ fontWeight: 700, color: '#10b981' }}>{h.score}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentAcademicView;

