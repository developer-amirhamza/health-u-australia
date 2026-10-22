"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { SummeryApi } from 'app/common/SummeryApi';
import Axios from 'utils/Axios';
import AxiosToastError from 'utils/AxiosToastError';
import { ContractPages, buildContractPdf } from 'app/common/contractPages';

interface ContractRow {
    id: string;
    status: string;
    contractType: string;
    employeeName: string;
    employeeEmail: string;
    position: string;
    startDate: string;
    signingTokenExpiresAt?: string | null;
    createdAt: string;
    updatedAt: string;
    createdBy?: { id: string; firstName: string; lastName: string | null } | null;
}

interface ContractDetail extends ContractRow {
    documentHtml: string;
    employeeSignatureName: string;
    employeeSignedDate: string;
    data?: { data?: { employeeSignature?: string } };
}

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
    SUBMITTED: { label: 'Submitted', cls: 'bg-gray-50 text-gray-700 border-gray-200' },
    AWAITING_SIGNATURE: { label: 'Awaiting Signature', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
    SIGNED: { label: 'Signed', cls: 'bg-green-50 text-green-700 border-green-200' },
};
const StatusBadge = ({ status }: { status: string }) => {
    const b = STATUS_BADGE[status] ?? STATUS_BADGE.SUBMITTED;
    return <span className={`inline-block text-xs font-semibold rounded border px-2 py-0.5 ${b.cls}`}>{b.label}</span>;
};

const TYPE_LABEL: Record<string, string> = {
    casual: 'Casual',
    parttime: 'Part-time',
    fulltime: 'Full-time',
    fixedterm: 'Office Employee',
    contractor: 'Contractor',
};


const AdminContractsPage = () => {
    const [contracts, setContracts] = useState<ContractRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [selected, setSelected] = useState<ContractDetail | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [sending, setSending] = useState(false);
    const [requestingSignature, setRequestingSignature] = useState(false);
    const [sendToEmail, setSendToEmail] = useState('');
    // The A4 pages shown in the preview; the PDF is built from exactly these.
    const [pages, setPages] = useState<string[] | null>(null);

    const fetchContracts = async () => {
        try {
            setLoading(true);
            const params: Record<string, string> = {};
            if (search.trim()) params.search = search.trim();
            const response = await Axios({ ...SummeryApi.getContracts, params });
            if (response.data?.success) setContracts(response.data.data || []);
            else toast.error(response.data?.message || 'Failed to fetch contracts');
        } catch (error) { AxiosToastError(error); } finally { setLoading(false); }
    };

    useEffect(() => {
        const t = setTimeout(fetchContracts, search ? 350 : 0);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const viewContract = async (id: string) => {
        try {
            setDetailLoading(true);
            const response = await Axios({ ...SummeryApi.getContractById, params: { id } });
            if (response.data?.success) {
                setPages(null);
                setSelected(response.data.data);
                setSendToEmail(response.data.data?.employeeEmail || '');
            } else toast.error(response.data?.message || 'Failed to load contract');
        } catch (error) { AxiosToastError(error); } finally { setDetailLoading(false); }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Delete the contract for "${name}"? This cannot be undone.`)) return;
        try {
            setActionLoading(id);
            const response = await Axios({ ...SummeryApi.deleteContract, data: { id } });
            if (response.data?.success) {
                toast.success('Contract deleted');
                setContracts(prev => prev.filter(c => c.id !== id));
                if (selected?.id === id) setSelected(null);
            } else toast.error(response.data?.message || 'Delete failed');
        } catch (error) { AxiosToastError(error); } finally { setActionLoading(null); }
    };

    const buildPdf = async () => (pages ? buildContractPdf(pages) : null);

    const handleDownloadPdf = async () => {
        if (!selected) return;
        try {
            setDownloading(true);
            const pdf = await buildPdf();
            if (!pdf) return;
            const safeName = (selected.employeeName || 'Contract').trim().replace(/[^a-z0-9]+/gi, '-');
            pdf.save(`Contract-${safeName}.pdf`);
        } catch (error) {
            console.error(error);
            toast.error('Could not generate the PDF');
        } finally { setDownloading(false); }
    };

    const handleSendEmail = async () => {
        if (!selected) return;
        const toEmail = sendToEmail.trim();
        if (!toEmail) { toast.error('Enter a recipient email'); return; }
        try {
            setSending(true);
            const pdf = await buildPdf();
            if (!pdf) return;
            const pdfBase64 = pdf.output('datauristring').split(',')[1];
            const response = await Axios({
                ...SummeryApi.sendContractPdf,
                data: { toEmail, employeeName: selected.employeeName, pdfBase64 },
            });
            if (response.data?.success) toast.success(`Sent to ${toEmail}`);
            else toast.error(response.data?.message || 'Could not send the PDF');
        } catch (error) {
            AxiosToastError(error);
        } finally { setSending(false); }
    };

    // Emails the employee a link to review the contract and sign it themselves
    // (see /contract/sign) — the same flow as Service Agreements.
    const handleSendSignatureRequest = async () => {
        if (!selected) return;
        const toEmail = sendToEmail.trim();
        if (!toEmail) { toast.error('Enter the employee email'); return; }
        try {
            setRequestingSignature(true);
            const response = await Axios({ ...SummeryApi.sendContractSignatureRequest, data: { id: selected.id, toEmail } });
            if (response.data?.success) {
                toast.success(response.data.message || 'Signature request sent');
                const patch = { status: 'AWAITING_SIGNATURE', employeeEmail: toEmail };
                setSelected(prev => prev ? { ...prev, ...patch } : prev);
                setContracts(prev => prev.map(c => c.id === selected.id ? { ...c, ...patch } : c));
            } else toast.error(response.data?.message || 'Could not send the signature request');
        } catch (error) {
            AxiosToastError(error);
        } finally { setRequestingSignature(false); }
    };

    const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return '—';
        try { return format(new Date(dateStr), 'dd MMM yyyy'); } catch { return dateStr; }
    };

    return (
        <div className="container mx-auto p-4 py-12">
            <div className="flex justify-between items-center my-6">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">Contracts</h1>
                    <span className="text-sm text-gray-500">{contracts.length} contract{contracts.length !== 1 ? 's' : ''}</span>
                </div>
                <Link
                    href="/admin/contract-generator"
                    className="text-sm font-semibold text-white bg-primary hover:bg-secondary transition-colors duration-300 rounded-full px-5 py-2.5"
                >
                    + New Contract
                </Link>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
                <input type="text" placeholder="Search by name, email or position..." value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {loading ? <div className="text-center py-12 text-gray-500">Loading contracts...</div> : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50"><tr>
                            {['Name', 'Type', 'Status', 'Position', 'Start Date', 'Email', 'Created', 'Actions'].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr></thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {contracts.length === 0 ? (
                                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">No contracts found.</td></tr>
                            ) : contracts.map(c => (
                                <tr key={c.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <button onClick={() => viewContract(c.id)} className="font-medium text-gray-900 text-sm hover:text-blue-600 hover:underline text-left">
                                            {c.employeeName || 'Unnamed'}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{TYPE_LABEL[c.contractType] ?? c.contractType ?? '—'}</td>
                                    <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={c.status} /></td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{c.position || '—'}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(c.startDate)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{c.employeeEmail || '—'}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(c.createdAt)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => viewContract(c.id)} className="text-blue-600 hover:text-blue-900 text-sm">View</button>
                                            {c.status !== 'SIGNED' && (
                                                <Link href={`/admin/contract-generator?edit=${c.id}`} className="text-blue-600 hover:text-blue-900 text-sm">Edit</Link>
                                            )}
                                            <button disabled={actionLoading === c.id} onClick={() => handleDelete(c.id, c.employeeName)}
                                                className="text-red-600 hover:text-red-900 text-sm disabled:opacity-50">
                                                {actionLoading === c.id ? '...' : 'Delete'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Detail modal */}
            {(selected || detailLoading) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
                    <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
                        {detailLoading || !selected ? (
                            <div className="text-center py-12 text-gray-500">Loading...</div>
                        ) : (
                            <>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{selected.employeeName || 'Unnamed'}</h2>
                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                            <span className="inline-block text-xs font-semibold rounded border px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
                                                {TYPE_LABEL[selected.contractType] ?? selected.contractType}
                                            </span>
                                            <StatusBadge status={selected.status} />
                                            {selected.status === 'SIGNED' && selected.employeeSignatureName && (
                                                <span className="text-xs text-gray-500">
                                                    Signed by {selected.employeeSignatureName}{selected.employeeSignedDate ? ` on ${selected.employeeSignedDate}` : ''}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">×</button>
                                </div>

                                <div className="flex flex-wrap items-end gap-3 mb-6 bg-gray-50 border border-gray-200 rounded p-3">
                                    <button
                                        type="button"
                                        disabled={downloading || !pages}
                                        onClick={handleDownloadPdf}
                                        className="text-white cursor-pointer text-sm font-semibold px-4 py-2 rounded-full bg-primary hover:bg-secondary transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {downloading ? 'Preparing…' : 'Download PDF'}
                                    </button>
                                    {selected.status !== 'SIGNED' && (
                                        <Link
                                            href={`/admin/contract-generator?edit=${selected.id}`}
                                            className="text-sm font-semibold px-4 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300"
                                        >
                                            Edit Contract
                                        </Link>
                                    )}
                                    <div className="flex items-end gap-2">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Send to</label>
                                            <input
                                                type="email"
                                                value={sendToEmail}
                                                onChange={e => setSendToEmail(e.target.value)}
                                                placeholder="employee@email.com"
                                                className="border border-gray-300 rounded px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            disabled={sending || !pages}
                                            onClick={handleSendEmail}
                                            className="text-white cursor-pointer text-sm font-semibold px-4 py-2 rounded-full bg-secondary hover:bg-primary transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {sending ? 'Sending…' : 'Send Email'}
                                        </button>
                                        {selected.status !== 'SIGNED' && !selected.data?.data?.employeeSignature && (
                                            <button
                                                type="button"
                                                disabled={requestingSignature}
                                                onClick={handleSendSignatureRequest}
                                                title="Email the employee a link to review and sign this contract"
                                                className="text-white cursor-pointer text-sm font-semibold px-4 py-2 rounded-full bg-primary hover:bg-secondary transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {requestingSignature ? 'Sending…' : selected.status === 'AWAITING_SIGNATURE' ? 'Resend Signature Request' : 'Send for Signature'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <ContractPages html={selected.documentHtml} onPages={setPages} height="70vh" />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminContractsPage;
