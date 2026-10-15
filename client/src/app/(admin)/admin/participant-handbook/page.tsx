"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { SummeryApi } from 'app/common/SummeryApi';
import Axios from 'utils/Axios';
import AxiosToastError from 'utils/AxiosToastError';
import HandbookMarkdown from 'utils/HandbookMarkdown';

interface HandbookSectionRow {
    id: string;
    part: string;
    title: string;
    content: string;
    order: number;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy?: { id: string; firstName: string; lastName: string | null } | null;
}

const EMPTY_FORM = {
    id: '',
    part: '',
    title: '',
    content: '',
    order: 0,
    isPublished: true,
};

const FORMATTING_HELP: [string, string][] = [
    ['Blank line', 'New paragraph'],
    ['### Heading', 'Sub-heading'],
    ['- item', 'Bullet list (indent 2 spaces to nest)'],
    ['1. item', 'Numbered list'],
    ['**text**', 'Bold'],
    ['[text](https://…)', 'Link'],
    ['| a | b |', 'Table row (add |---|---| as row 2 for a header)'],
];

const inputClass = 'border border-gray-300 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500';

const AdminParticipantHandbookPage = () => {
    const [sections, setSections] = useState<HandbookSectionRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [partFilter, setPartFilter] = useState('');
    const [search, setSearch] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(true);
    const [form, setForm] = useState(EMPTY_FORM);

    const fetchSections = async () => {
        try {
            setLoading(true);
            const response = await Axios({ ...SummeryApi.getHandbookSections });
            if (response.data?.success) setSections(response.data.data || []);
            else toast.error(response.data?.message || 'Failed to fetch handbook sections');
        } catch (error) { AxiosToastError(error); } finally { setLoading(false); }
    };

    useEffect(() => {
        fetchSections();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Parts in handbook order (the order of each part's first section).
    const parts = useMemo(() => {
        const names: string[] = [];
        for (const s of sections) if (!names.includes(s.part)) names.push(s.part);
        return names;
    }, [sections]);

    const visible = useMemo(() => {
        const q = search.trim().toLowerCase();
        return sections.filter(s =>
            (!partFilter || s.part === partFilter) &&
            (!q || s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q))
        );
    }, [sections, partFilter, search]);

    const openCreate = () => {
        const part = partFilter || parts[parts.length - 1] || '';
        // Default to just after the last section of the chosen part.
        const inPart = sections.filter(s => s.part === part);
        const lastOrder = (inPart.length ? inPart : sections).reduce((max, s) => Math.max(max, s.order), 0);
        setForm({ ...EMPTY_FORM, part, order: lastOrder + 10 });
        setModalOpen(true);
    };

    const openEdit = (row: HandbookSectionRow) => {
        setForm({
            id: row.id,
            part: row.part,
            title: row.title,
            content: row.content,
            order: row.order,
            isPublished: row.isPublished,
        });
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (!form.part.trim() || !form.title.trim()) {
            toast.error('Part and title are required');
            return;
        }
        try {
            setSaving(true);
            const isEdit = Boolean(form.id);
            const response = await Axios({
                ...(isEdit ? SummeryApi.updateHandbookSection : SummeryApi.createHandbookSection),
                data: form,
            });
            if (response.data?.success) {
                toast.success(isEdit ? 'Handbook section updated' : 'Handbook section created');
                setModalOpen(false);
                fetchSections();
            } else toast.error(response.data?.message || 'Save failed');
        } catch (error) { AxiosToastError(error); } finally { setSaving(false); }
    };

    const handleTogglePublished = async (row: HandbookSectionRow) => {
        try {
            setActionLoading(row.id);
            const response = await Axios({
                ...SummeryApi.updateHandbookSection,
                data: { id: row.id, isPublished: !row.isPublished },
            });
            if (response.data?.success) {
                setSections(prev => prev.map(s => s.id === row.id ? { ...s, isPublished: !s.isPublished } : s));
            } else toast.error(response.data?.message || 'Update failed');
        } catch (error) { AxiosToastError(error); } finally { setActionLoading(null); }
    };

    const handleDelete = async (row: HandbookSectionRow) => {
        if (!window.confirm(`Delete "${row.title}"? This cannot be undone.\n\nTip: use "Hidden" instead to take it off the public page without losing the text.`)) return;
        try {
            setActionLoading(row.id);
            const response = await Axios({ ...SummeryApi.deleteHandbookSection, data: { id: row.id } });
            if (response.data?.success) {
                toast.success('Handbook section deleted');
                setSections(prev => prev.filter(s => s.id !== row.id));
            } else toast.error(response.data?.message || 'Delete failed');
        } catch (error) { AxiosToastError(error); } finally { setActionLoading(null); }
    };

    return (
        <div className="container mx-auto p-4 py-12">
            <div className="flex flex-wrap justify-between items-center gap-3 my-6">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">Participant Handbook</h1>
                    <span className="text-sm text-gray-500">{sections.length} section{sections.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/participant-handbook" target="_blank" className="text-sm text-blue-600 hover:underline">View public page ↗</Link>
                    <button
                        onClick={openCreate}
                        className="text-sm font-semibold text-white bg-primary hover:bg-secondary transition-colors duration-300 rounded-full px-5 py-2.5"
                    >
                        + Add Section
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
                <select
                    value={partFilter}
                    onChange={e => setPartFilter(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All parts</option>
                    {parts.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <input
                    type="search"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search titles and content"
                    className="border border-gray-300 rounded px-3 py-2 text-sm w-64 max-w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {loading ? <div className="text-center py-12 text-gray-500">Loading handbook sections...</div> : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50"><tr>
                            {['Title', 'Part', 'Order', 'Published', 'Updated', 'Actions'].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr></thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {visible.length === 0 ? (
                                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No handbook sections found.</td></tr>
                            ) : visible.map(row => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <button onClick={() => openEdit(row)} className="font-medium text-gray-900 text-sm hover:text-blue-600 hover:underline text-left">
                                            {row.title}
                                        </button>
                                        {row.content && <p className="text-xs text-gray-500 mt-0.5 max-w-sm truncate">{row.content.replace(/[#*|]/g, '').slice(0, 140)}</p>}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600 max-w-[16rem]">{row.part}</td>
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
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(row.updatedAt).toLocaleDateString('en-AU')}
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
                    <div className="bg-white rounded-lg w-full max-w-6xl max-h-[92vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex items-start justify-between p-6 pb-4 border-b">
                            <h2 className="text-xl font-bold text-gray-900">{form.id ? 'Edit Section' : 'Add Section'}</h2>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">×</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Part (pick one or type a new part)</label>
                                    <input type="text" list="handbook-parts" value={form.part}
                                        onChange={e => setForm(f => ({ ...f, part: e.target.value }))}
                                        placeholder="e.g. Section 2: Working with You" className={inputClass} />
                                    <datalist id="handbook-parts">
                                        {parts.map(p => <option key={p} value={p} />)}
                                    </datalist>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                                    <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputClass} />
                                </div>
                            </div>

                            <div className="flex flex-wrap items-end gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Order (lower shows first)</label>
                                    <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) || 0 }))}
                                        className={`${inputClass} !w-28`} />
                                </div>
                                <label className="flex items-center gap-2 text-sm text-gray-700 pb-2.5">
                                    <input type="checkbox" checked={form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} />
                                    Published
                                </label>
                                <label className="flex items-center gap-2 text-sm text-gray-700 pb-2.5 ml-auto">
                                    <input type="checkbox" checked={showPreview} onChange={e => setShowPreview(e.target.checked)} />
                                    Show preview
                                </label>
                            </div>

                            <div className={`grid gap-4 ${showPreview ? 'lg:grid-cols-2' : ''}`}>
                                <div className="flex flex-col">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Content</label>
                                    <textarea rows={18} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                                        className={`${inputClass} font-mono text-[13px] leading-relaxed flex-1`} />
                                </div>
                                {showPreview && (
                                    <div className="flex flex-col">
                                        <span className="block text-xs font-medium text-gray-500 mb-1">Preview</span>
                                        <div className="border border-gray-200 rounded p-4 overflow-y-auto max-h-[28rem] lg:max-h-none flex-1 bg-gray-50/50">
                                            <h3 className="text-xl font-semibold text-gray-800 mb-3">{form.title || 'Untitled section'}</h3>
                                            <HandbookMarkdown content={form.content} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <details className="text-xs text-gray-600">
                                <summary className="cursor-pointer font-medium text-gray-500">Formatting help</summary>
                                <table className="mt-2">
                                    <tbody>
                                        {FORMATTING_HELP.map(([syntax, meaning]) => (
                                            <tr key={syntax}>
                                                <td className="pr-4 py-0.5 font-mono text-gray-800">{syntax}</td>
                                                <td className="py-0.5">{meaning}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </details>
                        </div>

                        <div className="flex justify-end gap-3 p-6 pt-4 border-t">
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

export default AdminParticipantHandbookPage;
