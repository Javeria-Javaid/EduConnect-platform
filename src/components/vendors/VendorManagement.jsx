import React, { useState, useEffect } from 'react';
import PageHeader from '../ui/PageHeader';
import DataTable from '../ui/DataTable';
import Modal from '../ui/Modal';
import { Store, Phone, Mail, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import './VendorManagement.css';

const VendorManagement = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentVendor, setCurrentVendor] = useState(null);

    const fetchVendors = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users?role=vendor`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (res.ok) {
                setVendors(data);
            } else {
                toast.error('Failed to fetch vendors');
            }
        } catch (error) {
            toast.error('Network error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const columns = [
        {
            header: 'Vendor Name',
            accessor: 'firstName',
            render: (item) => (
                <div className="user-name-cell">
                    <div className="user-avatar">
                        <Store size={16} />
                    </div>
                    <div>
                        <span className="user-name-text">{item.firstName} {item.lastName}</span>
                        <span className="user-email-text">{item.email}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Role',
            accessor: 'role',
            render: (item) => <span className="child-tag">{item.role}</span>
        },
        {
            header: 'Joined',
            accessor: 'createdAt',
            render: (item) => <span>{new Date(item.createdAt).toLocaleDateString()}</span>
        }
    ];

    const handleDelete = async (user) => {
        if (window.confirm(`Delete vendor ${user.email}?`)) {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${user._id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                if (res.ok) {
                    toast.success('Vendor removed');
                    fetchVendors();
                }
            } catch (error) {
                toast.error('Network error');
            }
        }
    };

    return (
        <div className="vendor-management-page">
            <PageHeader
                title="Service Providers"
                subtitle="Manage educational vendors, booksellers, and uniform providers."
                actionLabel="Refresh List"
                onAction={fetchVendors}
            />

            {loading ? (
                <div>Loading vendors...</div>
            ) : (
                <DataTable
                    columns={columns}
                    data={vendors}
                    onDelete={handleDelete}
                    onView={(vendor) => {
                        setCurrentVendor(vendor);
                        setIsModalOpen(true);
                    }}
                    searchPlaceholder="Search vendors..."
                />
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Vendor Profile"
            >
                {currentVendor && (
                    <div className="user-details-view">
                        <h3>{currentVendor.firstName} {currentVendor.lastName}</h3>
                        <p>{currentVendor.email}</p>
                        <p><strong>Status:</strong> Active Vendor</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default VendorManagement;
