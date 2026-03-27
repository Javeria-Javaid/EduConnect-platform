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
    const upcomingExams = examResults
        .filter(r => r?.exam?.startDate && new Date(r.exam.startDate) >= new Date())
        .sort((a, b) => new Date(a.exam.startDate) - new Date(b.exam.startDate))
        .map((r, idx) => ({
            id: r._id || idx,
            title: r.exam?.name || 'Upcoming Exam',
            date: new Date(r.exam.startDate),
        }));

    const downloadResult = (result) => {
        try {
            const lines = [
                ['Exam', result.exam?.name || 'Unknown Exam'],
                ['Date', result.exam?.startDate ? new Date(result.exam.startDate).toLocaleDateString() : 'N/A'],
                ['Percentage', `${Math.round(result.percentage || 0)}%`],
                ['Grade', result.percentage >= 90 ? 'A+' : result.percentage >= 80 ? 'A' : result.percentage >= 70 ? 'B' : result.percentage >= 60 ? 'C' : 'F'],
                [''],
                ['Subject', 'Obtained', 'Total']
            ];

            (result.marks || []).forEach((m) => {
                lines.push([m.subject || '', m.obtained ?? '', m.total ?? '']);
            });

            const csv = lines.map(row => row.join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Exam_Result_${(result.exam?.name || 'result').replace(/\s+/g, '_')}.csv`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            toast.success('Result downloaded');
        } catch {
            toast.error('Failed to download result');
        }
    };

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
                                            <span className="exam-day">{exam.date.toLocaleDateString('en-US', { day: '2-digit' })}</span>
                                            <span className="exam-month">{exam.date.toLocaleDateString('en-US', { month: 'short' })}</span>
                                        </div>
                                        <div className="exam-details">
                                            <h3>{exam.title}</h3>
                                            <div className="exam-info">
                                                <span><Calendar size={14} /> {exam.date.toLocaleDateString()}</span>
                                                <span><Clock size={14} /> Scheduled</span>
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
                                        <button className="btn-download" onClick={() => downloadResult(result)}>
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

