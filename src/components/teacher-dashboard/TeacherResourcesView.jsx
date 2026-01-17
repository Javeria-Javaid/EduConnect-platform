import React, { useRef, useState } from 'react';
import { FileText, Upload, Download, Folder } from 'lucide-react';
import { teachingResources } from './mockData';
import './TeacherDashboardOverview.css';

const TeacherResourcesView = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (25MB)
            if (file.size > 25 * 1024 * 1024) {
                setUploadError('File size must be less than 25MB');
                return;
            }
            setSelectedFile(file);
            setUploadError('');
            handleUploadSubmit(file);
        }
    };

    const handleUploadSubmit = async (file) => {
        setUploading(true);
        setUploadError('');
        setUploadSuccess('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name);
        formData.append('class', 'General');
        formData.append('subject', 'General');

        try {
            const response = await fetch('http://localhost:5000/api/teacher/upload-material', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setUploadSuccess('Material uploaded successfully!');
                setSelectedFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                setTimeout(() => setUploadSuccess(''), 3000);
            } else {
                setUploadError(data.message || 'Upload failed');
            }
        } catch (error) {
            setUploadError('Network error. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = async (resource) => {
        try {
            // Note: Using mock download since backend endpoint requires authentication
            // In production, this would fetch from the actual API endpoint
            const mockBlob = new Blob([`Mock content for ${resource.title}`], {
                type: resource.type === 'presentation' ? 'application/vnd.ms-powerpoint' :
                    resource.type === 'document' ? 'application/pdf' :
                        'application/vnd.ms-excel'
            });

            const url = URL.createObjectURL(mockBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = resource.title;
            a.style.display = 'none';

            document.body.appendChild(a);
            a.click();

            // Cleanup
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);

            console.log('Download successful:', resource.title);

            /* 
            // Real API implementation (commented out - requires authentication):
            const response = await fetch(`http://localhost:5000/api/teacher/download-material/${resource.id}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/pdf, application/vnd.ms-powerpoint, application/msword'
                }
            });

            if (response.ok) {
                const contentType = response.headers.get('Content-Type');
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = resource.title;
                a.style.display = 'none';
                
                document.body.appendChild(a);
                a.click();
                
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 100);

                console.log('Download successful:', resource.title);
            } else {
                const error = await response.json();
                console.error('Download failed:', error);
                alert(error.message || 'Download failed');
            }
            */
        } catch (error) {
            console.error('Download error for resource:', resource.title, error);
            alert('Network error. Please try again.');
        }
    };

    return (
        <div className="teacher-dashboard-overview">
            <div className="overview-header">
                <div>
                    <h1 className="page-title">Teaching Resources</h1>
                    <p className="page-subtitle">Upload and manage your teaching materials</p>
                </div>
                <button className="btn-primary" onClick={() => fileInputRef.current?.click()}>
                    <Upload size={16} /> Upload Resource
                </button>
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />

            {/* Upload Section */}
            <div className="dashboard-card" style={{ marginBottom: '24px' }}>
                <div className="card-body">
                    <div style={{
                        border: '2px dashed #e5e7eb',
                        borderRadius: '8px',
                        padding: '48px 24px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }} onClick={() => fileInputRef.current?.click()}>
                        <Upload size={48} color="#9ca3af" style={{ margin: '0 auto 16px' }} />
                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Upload Teaching Materials</h3>
                        <p style={{ color: '#6b7280', marginBottom: '16px' }}>Click to browse or drag and drop files here</p>
                        <p style={{ fontSize: '12px', color: '#9ca3af' }}>Supported formats: PDF, PPT, DOC, XLS (Max 25MB)</p>
                        {uploading && <p style={{ marginTop: '12px', color: '#3b82f6', fontWeight: '500' }}>Uploading...</p>}
                        {uploadSuccess && <p style={{ marginTop: '12px', color: '#10b981', fontWeight: '500' }}>{uploadSuccess}</p>}
                        {uploadError && <p style={{ marginTop: '12px', color: '#ef4444', fontWeight: '500' }}>{uploadError}</p>}
                    </div>
                </div>
            </div>

            {/* Resources List */}
            <div className="dashboard-card">
                <div className="card-header">
                    <h2 className="card-title">My Resources</h2>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-secondary" style={{ fontSize: '14px' }}>
                            <Folder size={14} /> Create Folder
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div style={{ display: 'grid', gap: '12px' }}>
                        {teachingResources.map((resource) => (
                            <div
                                key={resource.id}
                                style={{
                                    padding: '16px',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '8px',
                                    backgroundColor: resource.type === 'presentation' ? '#dbeafe' : resource.type === 'document' ? '#fef3c7' : '#d1fae5',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <FileText size={24} color={resource.type === 'presentation' ? '#3b82f6' : resource.type === 'document' ? '#f59e0b' : '#10b981'} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                                        {resource.title}
                                    </h4>
                                    <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#6b7280' }}>
                                        <span>{resource.class}</span>
                                        <span>•</span>
                                        <span>{resource.size}</span>
                                        <span>•</span>
                                        <span>{resource.downloads} downloads</span>
                                        <span>•</span>
                                        <span>Uploaded {resource.uploadDate}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button className="btn-secondary" style={{ fontSize: '13px', padding: '6px 12px' }} onClick={() => handleDownload(resource)}>
                                        <Download size={14} /> Download
                                    </button>
                                    <button className="btn-secondary" style={{ fontSize: '13px', padding: '6px 12px' }}>
                                        Share
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State for folders */}
                    <div style={{ marginTop: '32px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Folders</h3>
                        <div style={{
                            padding: '32px',
                            backgroundColor: '#f9fafb',
                            borderRadius: '8px',
                            textAlign: 'center'
                        }}>
                            <Folder size={48} color="#9ca3af" style={{ margin: '0 auto 12px' }} />
                            <p style={{ color: '#6b7280' }}>No folders created yet. Organize your resources into folders.</p>
                            <button className="btn-primary" style={{ marginTop: '16px' }}>
                                <Folder size={16} /> Create Your First Folder
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherResourcesView;
