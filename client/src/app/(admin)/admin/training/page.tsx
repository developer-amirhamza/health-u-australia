"use client";
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { SummeryApi } from 'app/common/SummeryApi';
import Axios from 'utils/Axios';
import AxiosToastError from 'utils/AxiosToastError';

interface TrainingResourceRow {
    id: string;
    category: string;
    title: string;
    description: string;
    link: string;
    order: number;
    isPublished: boolean;
    createdAt: string;
    createdBy?: { id: string; firstName: string; lastName: string | null } | null;
}

const CATEGORIES = [
    { value: 'REQUIRED_TRAINING', label: 'Required NDIS Training' },
    { value: 'COMMISSION_RESOURCE', label: 'Important NDIS Commission Resources' },
    { value: 'KNOWLEDGE_RESPONSIBILITY', label: 'NDIS Knowledge and Responsibilities' },
];

const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(CATEGORIES.map(c => [c.value, c.label]));

const EMPTY_FORM = {
    id: '',
    category: CATEGORIES[0].value,
    title: '',
    description: '',
    link: '',
    order: 0,
    isPublished: true,
};

const AdminTrainingPage = () => {
    const [resources, setResources] = useState<TrainingResourceRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);

    const fetchResources = async () => {
        try {
            setLoading(true);
            const params: Record<string, string> = {};
            if (categoryFilter) params.category = categoryFilter;
            const response = await Axios({ ...SummeryApi.getTrainingResources, params });
            if (response.data?.success) setResources(response.data.data || []);
            else toast.error(response.data?.message || 'Failed to fetch training resources');
        } catch (error) { AxiosToastError(error); } finally { setLoading(false); }
    };

    useEffect(() => {
        fetchResources();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryFilter]);

    const openCreate = () => {
        setForm({ ...EMPTY_FORM, category: categoryFilter || CATEGORIES[0].value });
        setModalOpen(true);
    };

    const openEdit = (row: TrainingResourceRow) => {
        setForm({
            id: row.id,
            category: row.category,
            title: row.title,
            description: row.description,
            link: row.link,
            order: row.order,
            isPublished: row.isPublished,
        });
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (!form.title.trim() || !form.link.trim()) {
            toast.error('Title and link are required');
            return;
        }
        try {
            setSaving(true);
            const isEdit = Boolean(form.id);
            const response = await Axios({
                ...(isEdit ? SummeryApi.updateTrainingResource : SummeryApi.createTrainingResource),
                data: form,
            });
            if (response.data?.success) {
                toast.success(isEdit ? 'Training resource updated' : 'Training resource created');
                setModalOpen(false);
                fetchResources();
            } else toast.error(response.data?.message || 'Save failed');
        } catch (error) { AxiosToastError(error); } finally { setSaving(false); }
    };

    const handleTogglePublished = async (row: TrainingResourceRow) => {
        try {
            setActionLoading(row.id);
            const response = await Axios({
                ...SummeryApi.updateTrainingResource,
                data: { id: row.id, isPublished: !row.isPublished },
            });
            if (response.data?.success) {
                setResources(prev => prev.map(r => r.id === row.id ? { ...r, isPublished: !r.isPublished } : r));
            } else toast.error(response.data?.message || 'Update failed');
        } catch (error) { AxiosToastError(error); } finally { setActionLoading(null); }
    };

    const handleDelete = async (row: TrainingResourceRow) => {
        if (!window.confirm(`Delete "${row.title}"? This cannot be undone.`)) return;
        try {
            setActionLoading(row.id);
            const response = await Axios({ ...SummeryApi.deleteTrainingResource, data: { id: row.id } });
            if (response.data?.success) {
                toast.success('Training resource deleted');
                setResources(prev => prev.filter(r => r.id !== row.id));
            } else toast.error(response.data?.message || 'Delete failed');
        } catch (error) { AxiosToastError(error); } finally { setActionLoading(null); }
    };

    return (
        <div className="container mx-auto p-4 py-12">
            <div className="flex flex-wrap justify-between items-center gap-3 my-6">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">Training</h1>
                    <span className="text-sm text-gray-500">{resources.length} resource{resources.length !== 1 ? 's' : ''}</span>
                </div>
                <button
                    onClick={openCreate}
                    className="text-sm font-semibold text-white bg-primary hover:bg-secondary transition-colors duration-300 rounded-full px-5 py-2.5"
                >
                    + Add Resource
                </button>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
                <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All sections</option>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
            </div>

            {loading ? <div className="text-center py-12 text-gray-500">Loading training resources...</div> : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50"><tr>
                            {['Title', 'Section', 'Order', 'Published', 'Link', 'Actions'].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr></thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {resources.length === 0 ? (
                                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No training resources found.</td></tr>
                            ) : resources.map(row => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <button onClick={() => openEdit(row)} className="font-medium text-gray-900 text-sm hover:text-blue-600 hover:underline text-left">
                                            {row.title}
                                        </button>
                                        {row.description && <p className="text-xs text-gray-500 mt-0.5 max-w-sm truncate">{row.description}</p>}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{CATEGORY_LABEL[row.category] ?? row.category}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{row.order}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <button
                                            disabled={actionLoading === row.id}
                                            onClick={() => handleTogglePublished(row)}
                                            className={`text-xs font-semibold rounded-full px-2.5 py-1 border transition-colors duration-200 disabled:opacity-50 ${row.isPublished ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}
                                        >
                                            {row.isPublished ? 'Published' : 'Hidden'}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                                        <a href={row.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{row.link}</a>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => openEdit(row)} className="text-blue-600 hover:text-blue-900 text-sm">Edit</button>
                                            <button disabled={actionLoading === row.id} onClick={() => handleDelete(row)}
                                                className="text-red-600 hover:text-red-900 text-sm disabled:opacity-50">
                                                {actionLoading === row.id ? '...' : 'Delete'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create / edit modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setModalOpen(false)}>
                    <div className="bg-white rounded-lg max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-start justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">{form.id ? 'Edit Resource' : 'Add Resource'}</h2>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">×</button>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Section</label>
                                <select
                                    value={form.category}
                                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                    className="border border-gray-300 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    className="border border-gray-300 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Short description</label>
                                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    className="border border-gray-300 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Link (NDIS Commission page)</label>
                                <input type="url" value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
                                    placeholder="https://www.ndiscommission.gov.au/..."
                                    className="border border-gray-300 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="flex items-end gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Order</label>
                                    <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) || 0 }))}
                                        className="border border-gray-300 rounded px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <label className="flex items-center gap-2 text-sm text-gray-700 pb-2.5">
                                    <input type="checkbox" checked={form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} />
                                    Published
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setModalOpen(false)} className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2">Cancel</button>
                            <button
                                disabled={saving}
                                onClick={handleSave}
                                className="text-white text-sm font-semibold px-5 py-2.5 rounded-full bg-primary hover:bg-secondary transition-colors duration-300 disabled:opacity-60"
                            >
                                {saving ? 'Saving…' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTrainingPage;
