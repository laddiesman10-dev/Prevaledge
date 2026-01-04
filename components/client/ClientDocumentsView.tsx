import React from 'react';
import type { ArchivedDocument } from '../../types';
import CheckCircleIcon from '../icons/CheckCircleIcon';
import XCircleIcon from '../icons/XCircleIcon';
import EyeIcon from '../icons/EyeIcon';

interface ClientDocumentsViewProps {
    documents: ArchivedDocument[];
    searchTerm: string;
}

const ClientDocumentsView: React.FC<ClientDocumentsViewProps> = ({ documents, searchTerm }) => {
    if (documents.length === 0) {
        return (
            <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-lg">
                <p className="text-xl font-semibold text-slate-300">
                    {searchTerm ? 'No Documents Found' : 'No Documents Available'}
                </p>
                <p className="text-slate-500 mt-2">
                    {searchTerm 
                        ? `Your search for "${searchTerm}" did not match any documents.`
                        : 'There are currently no invoices or quotations for your account.'
                    }
                </p>
            </div>
        );
    }
    
    return (
        <div className="bg-slate-900/70 border border-slate-800 rounded-lg overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Number</th>
                            <th scope="col" className="px-6 py-3">Type</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Total</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.map(doc => (
                            <tr key={doc.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{doc.documentNumber}</th>
                                <td className="px-6 py-4">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${doc.documentType === 'Invoice' ? 'bg-green-900/50 text-green-300' : 'bg-purple-900/50 text-purple-300'}`}>
                                        {doc.documentType}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(doc.documentDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 font-mono">{doc.currency}{doc.total.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    {doc.documentType === 'Invoice' ? (
                                        <span className={`flex items-center gap-2 text-xs font-semibold px-2 py-1 rounded-full transition-colors ${doc.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                            {doc.paymentStatus === 'paid' ? <CheckCircleIcon className="w-4 h-4" /> : <XCircleIcon className="w-4 h-4" />}
                                            {doc.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                                        </span>
                                    ) : (
                                        <span className="text-slate-500">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <a 
                                        href={`/invoice/${doc.publicId}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-900/50 hover:bg-blue-900/80 px-2 py-1 rounded-full transition-colors"
                                        aria-label={`View document ${doc.documentNumber}`}
                                    >
                                        <EyeIcon className="w-4 h-4" /> View
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClientDocumentsView;