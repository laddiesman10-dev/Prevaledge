import React, { useState, useMemo, useContext } from 'react';
import { SiteDataContext } from '../../../data/siteDataContext';
import type { ArchivedDocument } from '../../../types';
import { inputClass } from '../ui/formStyles';
import TrashIcon from '../../icons/TrashIcon';
import EyeIcon from '../../icons/EyeIcon';
import DocumentPreviewModal from '../ui/DocumentPreviewModal';
import CheckCircleIcon from '../../icons/CheckCircleIcon';
import XCircleIcon from '../../icons/XCircleIcon';


const DocumentHistoryView: React.FC = () => {
    const { documentHistory, updateDocumentStatusInHistory, deleteDocumentFromHistory } = useContext(SiteDataContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'Invoice' | 'Quotation'>('all');
    const [selectedDocument, setSelectedDocument] = useState<ArchivedDocument | null>(null);

    const filteredDocuments = useMemo(() => {
        return documentHistory
            .filter(doc => {
                if (filterType !== 'all' && doc.documentType !== filterType) {
                    return false;
                }
                if (searchTerm.trim() === '') {
                    return true;
                }
                const lowerSearch = searchTerm.toLowerCase();
                return (
                    doc.documentNumber.toLowerCase().includes(lowerSearch) ||
                    doc.clientDetails.name.toLowerCase().includes(lowerSearch) ||
                    doc.clientDetails.company.toLowerCase().includes(lowerSearch)
                );
            })
            .sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime());
    }, [documentHistory, searchTerm, filterType]);

    const handleTogglePaid = (doc: ArchivedDocument) => {
        if (doc.documentType !== 'Invoice') return;
        const newStatus = doc.paymentStatus === 'paid' ? 'unpaid' : 'paid';
        updateDocumentStatusInHistory(doc.id, newStatus);
    };

    const handleDelete = (doc: ArchivedDocument) => {
        if (window.confirm(`Are you sure you want to delete ${doc.documentType} #${doc.documentNumber}? This cannot be undone.`)) {
            deleteDocumentFromHistory(doc.id);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-6">Document History</h1>

            <div className="mb-6 bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-center">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by #, client name, or company..."
                    className={`${inputClass} flex-grow`}
                />
                <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)} className={inputClass}>
                    <option value="all">All Documents</option>
                    <option value="Invoice">Invoices Only</option>
                    <option value="Quotation">Quotations Only</option>
                </select>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-300">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Type</th>
                                <th scope="col" className="px-6 py-3">Number</th>
                                <th scope="col" className="px-6 py-3">Client</th>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Total</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDocuments.length > 0 ? (
                                filteredDocuments.map(doc => (
                                    <tr key={doc.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${doc.documentType === 'Invoice' ? 'bg-green-900/50 text-green-300' : 'bg-purple-900/50 text-purple-300'}`}>
                                                {doc.documentType}
                                            </span>
                                        </td>
                                        <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{doc.documentNumber}</th>
                                        <td className="px-6 py-4">{doc.clientDetails.name || doc.clientDetails.company}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(doc.documentDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-mono">{doc.currency}{doc.total.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            {doc.documentType === 'Invoice' ? (
                                                <button onClick={() => handleTogglePaid(doc)} className={`flex items-center gap-2 text-xs font-semibold px-2 py-1 rounded-full transition-colors ${doc.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-300 hover:bg-green-500/40' : 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/40'}`}>
                                                    {doc.paymentStatus === 'paid' ? <CheckCircleIcon className="w-4 h-4" /> : <XCircleIcon className="w-4 h-4" />}
                                                    {doc.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                                                </button>
                                            ) : (
                                                <span className="text-slate-500">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-4">
                                                <button onClick={() => setSelectedDocument(doc)} className="text-blue-400 hover:text-blue-300" aria-label="View document"><EyeIcon className="w-5 h-5" /></button>
                                                <button onClick={() => handleDelete(doc)} className="text-red-500 hover:text-red-400" aria-label="Delete document"><TrashIcon className="w-5 h-5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center py-16 text-slate-500">
                                        No documents found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <DocumentPreviewModal documentData={selectedDocument} onClose={() => setSelectedDocument(null)} />
        </div>
    );
};

export default DocumentHistoryView;