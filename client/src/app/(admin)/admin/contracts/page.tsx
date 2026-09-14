"use client";
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { SummeryApi } from 'app/common/SummeryApi';
import Axios from 'utils/Axios';
import AxiosToastError from 'utils/AxiosToastError';

interface ContractRow {
    id: string;
    status: string;
    contractType: string;
    employeeName: string;
    employeeEmail: string;
    position: string;
    startDate: string;
    createdAt: string;
    updatedAt: string;
    createdBy?: { id: string; firstName: string; lastName: string | null } | null;
}

interface ContractDetail extends ContractRow {
    documentHtml: string;
}

const TYPE_LABEL: Record<string, string> = {
    casual: 'Casual',
    parttime: 'Part-time',
    fulltime: 'Full-time',
    fixedterm: 'Fixed-term',
    contractor: 'Contractor',
};

// Mirrors the `.doc` typographic styles from the Contract Generator tool
// (client/public/contract-generator.html) so the stored documentHtml — the
// tool's own rendered output — looks right here too, scoped under
// `.hu-contract-doc` so it can't leak into the rest of the admin panel.
const docStyles = `
.hu-contract-doc{--brand:#0d6b63;--brand-ink:#095049;--accent:#b4531f;--font:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Roboto,Helvetica,Arial,sans-serif}
.hu-contract-doc .doc{font-family:Georgia,"Times New Roman",Times,serif;font-size:11pt;line-height:1.52;color:#1a1a1a}
.hu-contract-doc .doc .lh{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;border-bottom:2px solid var(--brand);padding-bottom:12px;margin-bottom:24px}
.hu-contract-doc .doc .lh.haslogo{border-bottom:1.5px solid #FE0000}
.hu-contract-doc .doc .lh-l{font-family:inherit;text-align:left}
.hu-contract-doc .doc .lh.haslogo .lh-l{text-align:right}
.hu-contract-doc .doc .lh-l b{display:block;font-size:15pt;font-weight:640;color:var(--brand-ink);letter-spacing:-.01em}
.hu-contract-doc .doc .lh.haslogo .lh-l b{font-size:1em;font-weight:600;color:#5b6172;letter-spacing:0}
.hu-contract-doc .doc .lh-l span{display:block;font-size:8.5pt;color:#5b6172;margin-top:3px;letter-spacing:.02em}
.hu-contract-doc .doc .lh img{max-height:58px;max-width:230px;object-fit:contain;flex:0 0 auto}
.hu-contract-doc .doc p{margin:0 0 11px}
.hu-contract-doc .doc .date{margin-bottom:16px}
.hu-contract-doc .doc .conf{font-weight:700;letter-spacing:.04em;font-size:9.5pt;text-transform:uppercase;margin-bottom:14px;color:#444}
.hu-contract-doc .doc .addr{margin-bottom:18px;line-height:1.4}
.hu-contract-doc .doc .addr div{margin:0}
.hu-contract-doc .doc h2.subj{font-size:12pt;font-weight:700;margin:16px 0 12px;text-decoration:underline}
.hu-contract-doc .doc table.det{width:100%;border-collapse:collapse;margin:14px 0 18px;font-size:10pt}
.hu-contract-doc .doc table.det th,.hu-contract-doc .doc table.det td{border:1px solid #b9bec9;padding:7px 9px;vertical-align:top;text-align:left}
.hu-contract-doc .doc table.det th{width:31%;background:#f2f6f6;font-weight:650}
.hu-contract-doc .doc table.det td p{margin:0 0 6px}
.hu-contract-doc .doc table.det td p:last-child{margin:0}
.hu-contract-doc .doc h3.tc{font-size:11.5pt;font-weight:700;text-align:center;margin:26px 0 14px;text-transform:uppercase;letter-spacing:.04em}
.hu-contract-doc .doc ol.cl{padding-left:0;margin:0;counter-reset:cl;list-style:none}
.hu-contract-doc .doc ol.cl>li{counter-increment:cl;margin:0 0 13px;padding-left:26px;position:relative}
.hu-contract-doc .doc ol.cl>li::before{content:counter(cl) ".";position:absolute;left:0;top:0;font-weight:700}
.hu-contract-doc .doc ol.cl>li>b.ct{display:block;font-weight:700;margin-bottom:4px}
.hu-contract-doc .doc ul.sub{margin:7px 0 0;padding-left:19px}
.hu-contract-doc .doc ul.sub li{margin-bottom:5px}
.hu-contract-doc .doc ol.sub{margin:7px 0 0;padding-left:22px}
.hu-contract-doc .doc ol.sub li{margin-bottom:5px}
.hu-contract-doc .doc .sig{margin-top:26px;border-top:1px solid #c6cbd4;padding-top:16px}
.hu-contract-doc .doc .sig h4{font-size:11pt;font-weight:700;margin-bottom:10px}
.hu-contract-doc .doc .sigline{margin:16px 0 0;display:flex;gap:10px;align-items:flex-end}
.hu-contract-doc .doc .sigline span{font-weight:600;min-width:96px}
.hu-contract-doc .doc .sigline i{flex:1;border-bottom:1px solid #6b7280;height:15px;display:block}
.hu-contract-doc .doc .fill{border-bottom:1px solid #6b7280;display:inline-block;min-width:190px}
.hu-contract-doc .doc .ftr{margin-top:28px;padding-top:9px;border-top:1px solid #d7dbe2;font-family:var(--font);font-size:8pt;color:#7a8090;display:flex;justify-content:space-between}
.hu-contract-doc .doc .ph{background:#fdf1e8;border-bottom:1px dashed var(--accent);color:var(--accent);padding:0 2px;border-radius:2px;font-style:italic}
`;

const AdminContractsPage = () => {
    const [contracts, setContracts] = useState<ContractRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [selected, setSelected] = useState<ContractDetail | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [sending, setSending] = useState(false);
    const [sendToEmail, setSendToEmail] = useState('');
    const docRef = useRef<HTMLDivElement>(null);

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

    // Renders the visible `.hu-contract-doc` content (the modal below) into a
    // multi-page PDF — the same html2canvas-pro + jsPDF approach used by the
    // Service Agreement Tool, and for the same reason: the site's Tailwind v4
    // palette resolves to oklch() colors that plain html2canvas can't parse.
    const buildPdf = async () => {
        if (!docRef.current) return null;
        const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
            import('html2canvas-pro'),
            import('jspdf'),
        ]);
        const canvas = await html2canvas(docRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        return pdf;
    };

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
                            {['Name', 'Type', 'Position', 'Start Date', 'Email', 'Created', 'Actions'].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr></thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {contracts.length === 0 ? (
                                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No contracts found.</td></tr>
                            ) : contracts.map(c => (
                                <tr key={c.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <button onClick={() => viewContract(c.id)} className="font-medium text-gray-900 text-sm hover:text-blue-600 hover:underline text-left">
                                            {c.employeeName || 'Unnamed'}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{TYPE_LABEL[c.contractType] ?? c.contractType ?? '—'}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{c.position || '—'}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(c.startDate)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{c.employeeEmail || '—'}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(c.createdAt)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => viewContract(c.id)} className="text-blue-600 hover:text-blue-900 text-sm">View</button>
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
                    <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
                        {detailLoading || !selected ? (
                            <div className="text-center py-12 text-gray-500">Loading...</div>
                        ) : (
                            <>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{selected.employeeName || 'Unnamed'}</h2>
                                        <span className="inline-block mt-1 text-xs font-semibold rounded border px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
                                            {TYPE_LABEL[selected.contractType] ?? selected.contractType}
                                        </span>
                                    </div>
                                    <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">×</button>
                                </div>

                                <div className="flex flex-wrap items-end gap-3 mb-6 bg-gray-50 border border-gray-200 rounded p-3">
                                    <button
                                        type="button"
                                        disabled={downloading}
                                        onClick={handleDownloadPdf}
                                        className="text-white cursor-pointer text-sm font-semibold px-4 py-2 rounded-full bg-primary hover:bg-secondary transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {downloading ? 'Preparing…' : 'Download PDF'}
                                    </button>
                                    <div className="flex items-end gap-2">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Send to</label>
                                            <input
                                                type="email"
                                                value={sendToEmail}
                                                onChange={e => setSendToEmail(e.target.value)}
                                                placeholder="participant@email.com"
                                                className="border border-gray-300 rounded px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            disabled={sending}
                                            onClick={handleSendEmail}
                                            className="text-white cursor-pointer text-sm font-semibold px-4 py-2 rounded-full bg-secondary hover:bg-primary transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {sending ? 'Sending…' : 'Send Email'}
                                        </button>
                                    </div>
                                </div>

                                <style jsx global>{docStyles}</style>
                                <div className="hu-contract-doc">
                                    <div ref={docRef} className="bg-white border border-gray-200 rounded p-8">
                                        <div className="doc" dangerouslySetInnerHTML={{ __html: selected.documentHtml }} />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminContractsPage;
