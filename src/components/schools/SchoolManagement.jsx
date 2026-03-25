import React, { useState, useEffect } from 'react';
import PageHeader from '../ui/PageHeader';
import DataTable from '../ui/DataTable';
import Modal from '../ui/Modal';
import { School, MapPin, Users, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import './SchoolManagement.css';

const SchoolManagement = () => {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSchool, setCurrentSchool] = useState(null);
    const [modalMode, setModalMode] = useState('add');

    const fetchSchools = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/schools`);
            const data = await res.json();
            if (res.ok) {
                setSchools(data);
            } else {
                toast.error('Failed to fetch schools');
            }
        } catch (error) {
            toast.error('Network error fetching schools');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchools();
    }, []);

    const columns = [
        {
            header: 'School Name',
            accessor: 'name',
            render: (item) => (
                <div className="school-name-cell">
                    <div className="school-icon-bg">
                        <School size={16} />
                    </div>
                    <div>
                        <span className="school-name-text">{item.name}</span>
                        <span className="school-location-text">{item.location}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Type',
            accessor: 'type',
            render: (item) => <span className="type-badge">{item.type}</span>
        },
        {
            header: 'Contact',
            accessor: 'contactEmail',
            render: (item) => <span>{item.contactEmail}</span>
        }
    ];

    const handleDelete = async (school) => {
        if (window.confirm(`Delete ${school.name}?`)) {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/schools/${school._id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                if (res.ok) {
                    toast.success('School deleted');
                    fetchSchools();
                } else {
                    toast.error('Delete failed');
                }
            } catch (error) {
                toast.error('Network error');
            }
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = {
            name: e.target.name.value,
            location: e.target.location.value,
            type: e.target.type.value,
            description: e.target.description.value,
            contactEmail: e.target.contactEmail.value,
        };

        try {
            const url = modalMode === 'edit'
                ? `${import.meta.env.VITE_API_URL}/api/schools/${currentSchool._id}`
                : `${import.meta.env.VITE_API_URL}/api/schools`;
            
            const res = await fetch(url, {
                method: modalMode === 'edit' ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success(modalMode === 'edit' ? 'School updated' : 'School added');
                setIsModalOpen(false);
                fetchSchools();
            } else {
                toast.error('Failed to save school');
            }
        } catch (error) {
            toast.error('Network error saving school');
        }
    };

    return (
        <div className="school-management-page">
            <PageHeader
                title="Institution Registry"
                subtitle="Verify new schools, manage school profiles, and track accreditation."
                actionLabel="Register New School"
                onAction={() => {
                    setCurrentSchool(null);
                    setModalMode('add');
                    setIsModalOpen(true);
                }}
            />

            {loading ? (
                <div>Loading schools...</div>
            ) : (
                <DataTable
                    columns={columns}
                    data={schools}
                    onEdit={(school) => {
                        setCurrentSchool(school);
                        setModalMode('edit');
                        setIsModalOpen(true);
                    }}
                    onDelete={handleDelete}
                    onView={(school) => {
                        setCurrentSchool(school);
                        setModalMode('view');
                        setIsModalOpen(true);
                    }}
                    searchPlaceholder="Search institutions..."
                />
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'add' ? 'Register school' : modalMode === 'edit' ? 'Edit School' : 'School Details'}
            >
                 {modalMode === 'view' && currentSchool ? (
                    <div className="school-details-view">
                         <h3>{currentSchool.name}</h3>
                         <p><strong>Location:</strong> {currentSchool.location}</p>
                         <p><strong>Type:</strong> {currentSchool.type}</p>
                         <p><strong>Contact:</strong> {currentSchool.contactEmail}</p>
                         <p><strong>Description:</strong> {currentSchool.description || 'No description.'}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="school-form">
                        <div className="form-group">
                            <label>School Name</label>
                            <input type="text" name="name" defaultValue={currentSchool?.name} required />
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <input type="text" name="location" defaultValue={currentSchool?.location} required />
                        </div>
                        <div className="form-group">
                            <label>Contact Email</label>
                            <input type="email" name="contactEmail" defaultValue={currentSchool?.contactEmail} required />
                        </div>
                        <div className="form-group">
                            <label>School Type</label>
                            <select name="type" defaultValue={currentSchool?.type || 'Private'}>
                                <option value="Private">Private</option>
                                <option value="Public">Public</option>
                                <option value="International">International</option>
                                <option value="Specialized">Specialized</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea name="description" rows="3" defaultValue={currentSchool?.description} className="form-textarea"></textarea>
                        </div>
                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button type="submit" className="save-btn">{modalMode === 'edit' ? 'Save Changes' : 'Register'}</button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default SchoolManagement;
