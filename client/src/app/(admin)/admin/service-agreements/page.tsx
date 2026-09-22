"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { SummeryApi } from 'app/common/SummeryApi';
import Axios from 'utils/Axios';
import AxiosToastError from 'utils/AxiosToastError';

interface AgreementRow {
    id: string;
    status: string;
    participantName: string;
    participantNdisNumber: string;
    agreementStartDate: string;
    agreementEndDate: string;
    quoteNumber: string;
    managementType: string;
    createdAt: string;
    updatedAt: string;
    signingToken?: string | null;
    createdBy?: { id: string; firstName: string; lastName: string | null } | null;
}

interface SupportItem {
    itemCode: string; itemName: string; unitPrice: number; frequency: string;
    dayOfWeek: string; hoursPerService: number; qtyPerPeriod: number;
    startDate: string; endDate: string; notes: string;
}

interface AgreementDetail extends AgreementRow {
    participantRepName: string;
    livesAlone: string; supportsProvided: string[];
    planManagerName: string; planManagerEmail: string;
    cancellationPolicyAcknowledged: boolean;
    consentInfoConfidential: boolean; consentChangeAnytime: boolean;
    consentMedication: string; consentMoneyManagement: string;
    consentPhotosService: string; consentPhotosMedia: string; consentPublishFeedback: string;
    contactAddress: string; contactPhone: string; contactEmail: string;
    hasAlternativeContact: string; altRelationship: string[];
    altContactName: string; altContactNumber: string; altContactEmail: string;
    orgContactName: string; orgPhone: string; orgEmail: string; orgPostalAddress: string;
    quoteDate: string; planStartDate: string; planEndDate: string;
    preparedBy: string; contactPerson: string; applyGst: boolean;
    items: SupportItem[];
    agreementExplained: boolean;
    participantSignature: string; participantSignatureName: string; participantSignedDate: string;
    providerSignature: string; providerSignatureName: string; providerSignedDate: string;
}

const STATUS_BADGE: Record<string, string> = {
    DRAFT: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    SIGNED: 'bg-green-100 text-green-800 border-green-300',
    ARCHIVED: 'bg-gray-100 text-gray-600 border-gray-300',
};

const MANAGEMENT_LABEL: Record<string, string> = {
    self: 'Self Managed',
    ndia: 'NDIA Managed',
    plan: 'Plan Managed',
};

const money = (n: number) =>
    new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(Number.isFinite(n) ? n : 0);

const AdminServiceAgreementsPage = () => {
    const [agreements, setAgreements] = useState<AgreementRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [selected, setSelected] = useState<AgreementDetail | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [exporting, setExporting] = useState(false);

    const fetchAgreements = async () => {
        try {
            setLoading(true);
            const params: Record<string, string> = {};
            if (statusFilter !== 'ALL') params.status = statusFilter;
            if (search.trim()) params.search = search.trim();
            const response = await Axios({ ...SummeryApi.getServiceAgreements, params });
            if (response.data?.success) setAgreements(response.data.data || []);
            else toast.error(response.data?.message || 'Failed to fetch service agreements');
        } catch (error) { AxiosToastError(error); } finally { setLoading(false); }
    };

    // Server-side filtering — refetch when search/status changes (debounced on search).
    useEffect(() => {
        const t = setTimeout(fetchAgreements, search ? 350 : 0);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter, search]);

    const viewAgreement = async (id: string) => {
        try {
            setDetailLoading(true);
            const response = await Axios({ ...SummeryApi.getServiceAgreementById, params: { id } });
            if (response.data?.success) setSelected(response.data.data);
            else toast.error(response.data?.message || 'Failed to load agreement');
        } catch (error) { AxiosToastError(error); } finally { setDetailLoading(false); }
    };

    const handleArchive = async (id: string) => {
        try {
            setActionLoading(id);
            const response = await Axios({ ...SummeryApi.updateServiceAgreement, data: { id, status: 'ARCHIVED' } });
            if (response.data?.success) {
                toast.success('Agreement archived');
                setAgreements(prev => prev.map(a => (a.id === id ? { ...a, status: 'ARCHIVED' } : a)));
            } else toast.error(response.data?.message || 'Archive failed');
        } catch (error) { AxiosToastError(error); } finally { setActionLoading(null); }
    };

    const handleSendSignatureRequest = async (id: string) => {
        try {
            setActionLoading(id);
            const response = await Axios({ ...SummeryApi.sendSignatureRequest, data: { id } });
            if (response.data?.success) {
                toast.success(response.data.message || 'Signature request sent');
                setAgreements(prev => prev.map(a => (a.id === id ? { ...a, signingToken: 'pending' } : a)));
                setSelected(prev => (prev && prev.id === id ? { ...prev, signingToken: 'pending' } : prev));
            } else {
                toast.error(response.data?.message || 'Could not send the signature request');
            }
        } catch (error) { AxiosToastError(error); } finally { setActionLoading(null); }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Delete the service agreement for "${name}"? This cannot be undone.`)) return;
        try {
            setActionLoading(id);
            const response = await Axios({ ...SummeryApi.deleteServiceAgreement, data: { id } });
            if (response.data?.success) {
                toast.success('Agreement deleted');
                setAgreements(prev => prev.filter(a => a.id !== id));
            } else toast.error(response.data?.message || 'Delete failed');
        } catch (error) { AxiosToastError(error); } finally { setActionLoading(null); }
    };

    const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return '—';
        try { return format(new Date(dateStr), 'dd MMM yyyy'); } catch { return dateStr; }
    };

    const yesNo = (v: boolean) => (v ? 'Yes' : 'No');

    // Export every field of every agreement currently loaded (i.e. matching the
    // active search/status filters) to a real .xlsx workbook — one sheet with
    // the full agreement record, one with every support item (linked back to
    // its agreement). The list endpoint only returns a summary, so each
    // agreement's full detail is fetched first. xlsx is imported dynamically
    // so it never weighs down the main bundle.
    const handleExportAll = async () => {
        if (agreements.length === 0) return;
        try {
            setExporting(true);
            const details = await Promise.all(
                agreements.map(async (a) => {
                    const response = await Axios({ ...SummeryApi.getServiceAgreementById, params: { id: a.id } });
                    if (!response.data?.success) throw new Error(response.data?.message || `Failed to load "${a.participantName}"`);
                    return response.data.data as AgreementDetail;
                })
            );

            const XLSX = await import('xlsx');

            const agreementRows = details.map((d) => ({
                'Participant Name': d.participantName || '',
                'NDIS Number': d.participantNdisNumber || '',
                'Representative Name': d.participantRepName || '',
                'Status': d.status,
                'Awaiting Signature': yesNo(Boolean(d.signingToken) && d.status !== 'SIGNED'),
                'Agreement Start Date': d.agreementStartDate || '',
                'Agreement End Date': d.agreementEndDate || '',
                'Lives Alone': d.livesAlone || '',
                'Supports Provided': (d.supportsProvided || []).join(', '),
                'Management Type': MANAGEMENT_LABEL[d.managementType] ?? d.managementType ?? '',
                'Plan Manager Name': d.planManagerName || '',
                'Plan Manager Email': d.planManagerEmail || '',
                'Cancellation Policy Acknowledged': yesNo(Boolean(d.cancellationPolicyAcknowledged)),
                'Consent - Info Confidential': yesNo(Boolean(d.consentInfoConfidential)),
                'Consent - Change Anytime': yesNo(Boolean(d.consentChangeAnytime)),
                'Consent - Medication': d.consentMedication || '',
                'Consent - Money Management': d.consentMoneyManagement || '',
                'Consent - Photos (Service)': d.consentPhotosService || '',
                'Consent - Photos (Media)': d.consentPhotosMedia || '',
                'Consent - Publish Feedback': d.consentPublishFeedback || '',
                'Contact Address': d.contactAddress || '',
                'Contact Phone': d.contactPhone || '',
                'Contact Email': d.contactEmail || '',
                'Has Alternative Contact': d.hasAlternativeContact || '',
                'Alt Contact Relationship': (d.altRelationship || []).join(', '),
                'Alt Contact Name': d.altContactName || '',
                'Alt Contact Number': d.altContactNumber || '',
                'Alt Contact Email': d.altContactEmail || '',
                'Org Contact Name': d.orgContactName || '',
                'Org Phone': d.orgPhone || '',
                'Org Email': d.orgEmail || '',
                'Org Postal Address': d.orgPostalAddress || '',
                'Quote Number': d.quoteNumber || '',
                'Quote Date': d.quoteDate || '',
                'Plan Start Date': d.planStartDate || '',
                'Plan End Date': d.planEndDate || '',
                'Prepared By': d.preparedBy || '',
                'Contact Person': d.contactPerson || '',
                'Apply GST': yesNo(Boolean(d.applyGst)),
                'Support Items Count': (d.items || []).length,
                'Agreement Explained': yesNo(Boolean(d.agreementExplained)),
                'Participant Signed': yesNo(Boolean(d.participantSignature)),
                'Participant Signature Name': d.participantSignatureName || '',
                'Participant Signed Date': d.participantSignedDate || '',
                'Provider Signed': yesNo(Boolean(d.providerSignature)),
                'Provider Signature Name': d.providerSignatureName || '',
                'Provider Signed Date': d.providerSignedDate || '',
                'Created By': d.createdBy ? `${d.createdBy.firstName} ${d.createdBy.lastName ?? ''}`.trim() : '',
                'Created At': d.createdAt ? format(new Date(d.createdAt), 'dd MMM yyyy HH:mm') : '',
                'Updated At': d.updatedAt ? format(new Date(d.updatedAt), 'dd MMM yyyy HH:mm') : '',
                'Agreement ID': d.id,
            }));

            const itemRows = details.flatMap((d) =>
                (d.items || []).map((item) => ({
                    'Participant Name': d.participantName || '',
                    'Quote Number': d.quoteNumber || '',
                    'Item Code': item.itemCode || '',
                    'Item Name': item.itemName || '',
                    'Unit Price': Number(item.unitPrice) || 0,
                    'Frequency': item.frequency || '',
                    'Day Of Week': item.dayOfWeek || '',
                    'Hours Per Service': Number(item.hoursPerService) || 0,
                    'Qty Per Period': Number(item.qtyPerPeriod) || 0,
                    'Line Total': (Number(item.unitPrice) || 0) * (Number(item.hoursPerService) || 0) * (Number(item.qtyPerPeriod) || 0),
                    'Start Date': item.startDate || '',
                    'End Date': item.endDate || '',
                    'Notes': item.notes || '',
                    'Agreement ID': d.id,
                }))
            );

            const wb = XLSX.utils.book_new();
            const agreementsWs = XLSX.utils.json_to_sheet(agreementRows);
            agreementsWs['!cols'] = Object.keys(agreementRows[0] || {}).map(() => ({ wch: 20 }));
            XLSX.utils.book_append_sheet(wb, agreementsWs, 'Agreements');

            const itemsWs = XLSX.utils.json_to_sheet(itemRows);
            itemsWs['!cols'] = Object.keys(itemRows[0] || {}).map(() => ({ wch: 18 }));
            XLSX.utils.book_append_sheet(wb, itemsWs, 'Support Items');

            XLSX.writeFile(wb, `service-agreements-export-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
            toast.success(`Exported ${agreementRows.length} agreement${agreementRows.length !== 1 ? 's' : ''}`);
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="container mx-auto p-4 py-12">
            <div className="flex justify-between items-center my-6">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">Service Agreements</h1>
                    <span className="text-sm text-gray-500">{agreements.length} agreement{agreements.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleExportAll} disabled={exporting || loading || agreements.length === 0}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2.5 rounded-full disabled:opacity-50">
                        {exporting ? 'Exporting…' : '⬇ Export to Excel'}
                    </button>
                    <Link
                        href="/admin/service-agreement-tool"
                        className="text-sm font-semibold text-white bg-primary hover:bg-secondary transition-colors duration-300 rounded-full px-5 py-2.5"
                    >
                        + New Agreement
                    </Link>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
                <input type="text" placeholder="Search by participant, NDIS number or quote #..." value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="ALL">All Status</option>
                    <option value="DRAFT">Draft</option>
                    <option value="SIGNED">Signed</option>
                    <option value="ARCHIVED">Archived</option>
                </select>
            </div>

            {loading ? <div className="text-center py-12 text-gray-500">Loading service agreements...</div> : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50"><tr>
                            {['Participant', 'NDIS Number', 'Status', 'Agreement Period', 'Management', 'Quote #', 'Created', 'Actions'].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr></thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {agreements.length === 0 ? (
                                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">No service agreements found.</td></tr>
                            ) : agreements.map(a => (
                                <tr key={a.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <button onClick={() => viewAgreement(a.id)} className="font-medium text-gray-900 text-sm hover:text-blue-600 hover:underline text-left">
                                            {a.participantName}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{a.participantNdisNumber || '—'}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className={`inline-block text-xs font-semibold rounded border px-2 py-1 ${STATUS_BADGE[a.status] ?? STATUS_BADGE.DRAFT}`}>
                                            {a.status}
                                        </span>
                                        {a.status !== 'SIGNED' && a.signingToken && (
                                            <span className="ml-1 inline-block text-xs font-semibold rounded border px-2 py-1 bg-blue-50 text-blue-700 border-blue-200">
                                                Awaiting Signature
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(a.agreementStartDate)} – {formatDate(a.agreementEndDate)}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{MANAGEMENT_LABEL[a.managementType] ?? '—'}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{a.quoteNumber || '—'}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(a.createdAt)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => viewAgreement(a.id)} className="text-blue-600 hover:text-blue-900 text-sm">View</button>
                                            {a.status !== 'ARCHIVED' && (
                                                <button disabled={actionLoading === a.id} onClick={() => handleArchive(a.id)}
                                                    className="text-amber-600 hover:text-amber-900 text-sm disabled:opacity-50">
                                                    {actionLoading === a.id ? '...' : 'Archive'}
                                                </button>
                                            )}
                                            <button disabled={actionLoading === a.id} onClick={() => handleDelete(a.id, a.participantName)}
                                                className="text-red-600 hover:text-red-900 text-sm disabled:opacity-50">
                                                {actionLoading === a.id ? '...' : 'Delete'}
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
                    <div className="bg-white rounded-lg max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
                        {detailLoading || !selected ? (
                            <div className="text-center py-12 text-gray-500">Loading...</div>
                        ) : (
                            <>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{selected.participantName}</h2>
                                        <span className={`inline-block mt-1 text-xs font-semibold rounded border px-2 py-0.5 ${STATUS_BADGE[selected.status] ?? STATUS_BADGE.DRAFT}`}>
                                            {selected.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {selected.status !== 'SIGNED' && selected.status !== 'ARCHIVED' && (
                                            <button
                                                disabled={actionLoading === selected.id}
                                                onClick={() => handleSendSignatureRequest(selected.id)}
                                                className="text-sm font-semibold text-white bg-secondary hover:bg-primary transition-colors duration-300 rounded-full px-4 py-1.5 disabled:opacity-50"
                                            >
                                                {actionLoading === selected.id ? 'Sending…' : selected.signingToken ? 'Resend Signature Request' : 'Send for Signature'}
                                            </button>
                                        )}
                                        <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">×</button>
                                    </div>
                                </div>

                                <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm mb-6">
                                    {[
                                        ['NDIS Number', selected.participantNdisNumber || '—'],
                                        ['Representative', selected.participantRepName || '—'],
                                        ['Agreement Period', `${formatDate(selected.agreementStartDate)} – ${formatDate(selected.agreementEndDate)}`],
                                        ['Management Type', MANAGEMENT_LABEL[selected.managementType] ?? '—'],
                                        ['Address', selected.contactAddress || '—'],
                                        ['Phone', selected.contactPhone || '—'],
                                        ['Email', selected.contactEmail || '—'],
                                        ['Quote Number', selected.quoteNumber || '—'],
                                        ['Prepared By', selected.preparedBy || '—'],
                                        ['Created', formatDate(selected.createdAt)],
                                        ['Last Updated', formatDate(selected.updatedAt)],
                                        ['Created By', selected.createdBy ? `${selected.createdBy.firstName} ${selected.createdBy.lastName ?? ''}`.trim() : '—'],
                                    ].map(([label, value]) => (
                                        <div key={label as string} className="flex justify-between gap-4 py-1 border-b border-gray-100">
                                            <dt className="text-gray-500">{label}</dt>
                                            <dd className="text-gray-900 font-medium text-right break-all">{value}</dd>
                                        </div>
                                    ))}
                                </dl>

                                <h3 className="text-sm font-bold text-gray-700 mb-2">Schedule of Supports</h3>
                                <div className="overflow-x-auto mb-6">
                                    <table className="min-w-full text-xs border border-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                {['Item', 'Frequency', 'Day', 'Hours', 'Qty', 'Unit Price', 'Line Total'].map(h => (
                                                    <th key={h} className="px-2 py-1.5 text-left font-medium text-gray-500">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(selected.items || []).length === 0 ? (
                                                <tr><td colSpan={7} className="px-2 py-3 text-center text-gray-400">No support items.</td></tr>
                                            ) : selected.items.map((item, i) => (
                                                <tr key={i} className="border-t border-gray-100">
                                                    <td className="px-2 py-1.5">{item.itemName || item.itemCode || '—'}</td>
                                                    <td className="px-2 py-1.5">{item.frequency}</td>
                                                    <td className="px-2 py-1.5">{item.dayOfWeek}</td>
                                                    <td className="px-2 py-1.5">{item.hoursPerService}</td>
                                                    <td className="px-2 py-1.5">{item.qtyPerPeriod}</td>
                                                    <td className="px-2 py-1.5">{money(Number(item.unitPrice))}</td>
                                                    <td className="px-2 py-1.5 font-medium">
                                                        {money(Number(item.unitPrice) * Number(item.hoursPerService) * Number(item.qtyPerPeriod))}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <h3 className="text-sm font-bold text-gray-700 mb-2">Signatures</h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="border border-gray-200 rounded p-3">
                                        <p className="text-xs text-gray-500 mb-1">Participant / Representative</p>
                                        {selected.participantSignature ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={selected.participantSignature} alt="Participant signature" className="h-16 object-contain" />
                                        ) : <p className="text-sm text-gray-400">Not signed</p>}
                                        <p className="text-sm mt-1">{selected.participantSignatureName} {selected.participantSignedDate && `· ${formatDate(selected.participantSignedDate)}`}</p>
                                    </div>
                                    <div className="border border-gray-200 rounded p-3">
                                        <p className="text-xs text-gray-500 mb-1">Provider's Authorised Person</p>
                                        {selected.providerSignature ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={selected.providerSignature} alt="Provider signature" className="h-16 object-contain" />
                                        ) : <p className="text-sm text-gray-400">Not signed</p>}
                                        <p className="text-sm mt-1">{selected.providerSignatureName} {selected.providerSignedDate && `· ${formatDate(selected.providerSignedDate)}`}</p>
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

export default AdminServiceAgreementsPage;
