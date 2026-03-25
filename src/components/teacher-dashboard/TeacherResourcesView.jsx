import React, { useRef, useState, useEffect } from 'react';
import { FileText, Upload, Download, Folder, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import './TeacherDashboardOverview.css';

const TeacherResourcesView = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const fetchResources = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/teacher/materials/me`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (res.ok) {
                setResources(data);
            }
        } catch (error) {
            toast.error('Error fetching resources');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 25 * 1024 * 1024) {
                toast.error('File size must be less than 25MB');
                return;
            }
            handleUploadSubmit(file);
        }
    };

    const handleUploadSubmit = async (file) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name);
        formData.append('class', 'General');
        formData.append('subject', 'General');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/teacher/upload-material`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: formData
            });

            if (response.ok) {
                toast.success('Material uploaded successfully!');
                fetchResources();
            } else {
                toast.error('Upload failed');
            }
        } catch (error) {
            toast.error('Network error');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDownload = (resource) => {
        const url = `${import.meta.env.VITE_API_URL}/api/teacher/download-material/${resource._id}`;
        const a = document.createElement('a');
        a.href = url;
        // Since we are using an auth protected endpoint, a simple <a> tag won't work easily with token headers.
        // But for local testing, if the server supports it, we might need a fetch-and-blob approach.
        // Let's use the fetch approach to be safe with JWT.
        
        toast.info('Starting download...');
        fetch(url, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => res.blob())
        .then(blob => {
            const bUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = bUrl;
            link.setAttribute('download', resource.title || resource.fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        })
        .catch(() => toast.error('Download failed'));
    };

    return (
        <div className="teacher-dashboard-overview">
            <div className="overview-header">
                <div>
                    <h1 className="page-title">Teaching Resources</h1>
                    <p className="page-subtitle">Upload and manage your teaching materials</p>
                </div>
                <button className="btn-primary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                    <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload Resource'}
                </button>
            </div>

            <input ref={fileInputRef} type="file" onChange={handleFileSelect} style={{ display: 'none' }} />

            <div className="dashboard-card">
                <div className="card-header"><h2 className="card-title">My Resources</h2></div>
                <div className="card-body">
                    {loading ? (
                        <p>Loading resources...</p>
                    ) : (
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {resources.map((resource) => (
                                <div key={resource._id} className="resource-item" style={{
                                    padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px',
                                    display: 'flex', alignItems: 'center', gap: '16px'
                                }}>
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '8px',
                                        backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <FileText size={24} color="#3b82f6" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: '14px', fontWeight: '600' }}>{resource.title}</h4>
                                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                            <span>{resource.class}</span> • <span>{(resource.fileSize / 1024 / 1024).toFixed(2)} MB</span> • <span>{resource.downloads} downloads</span>
                                        </div>
                                    </div>
                                    <button className="btn-secondary" onClick={() => handleDownload(resource)}>
                                        <Download size={14} /> Download
                                    </button>
                                </div>
                            ))}
                            {resources.length === 0 && <p>No resources uploaded yet.</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherResourcesView;
