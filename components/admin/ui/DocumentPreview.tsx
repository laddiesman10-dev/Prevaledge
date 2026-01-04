import React from 'react';
import type { NewArchivedDocument } from '../../../types';
import BrainCircuitIcon from '../../icons/BrainCircuitIcon';
import Barcode from './Barcode';
import QRCode from './QRCode';
import { SITE_URL } from '../../../types';

interface DocumentPreviewProps {
    document: NewArchivedDocument;
    previewId: string;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ document, previewId }) => {
    const {
        documentType, documentNumber, documentDate, dueDate, companyDetails, clientDetails,
        lineItems, notes, taxRate, total, logo, accentColor, currency, showBarcode, paymentStatus,
        subtotal, taxAmount, discountType, discountValue, discountAmount,
        publicId
    } = document;

    const publicUrl = `${SITE_URL}/invoice/${publicId}`;

    return (
        <div id={previewId} className="printable-area bg-white text-gray-800 p-6 sm:p-10 md:p-12 max-w-4xl mx-auto border border-gray-300 print:shadow-none print:rounded-none print:border-none relative font-sans">
            
            <header className="grid grid-cols-3 items-start pb-6 mb-8 border-b-2 relative z-10 print-colors" style={{ borderColor: accentColor }}>
                <div className="flex items-center gap-4">
                    {logo ? <img src={logo} alt="Company logo" className="max-h-20 max-w-[180px] object-contain" /> : <BrainCircuitIcon className="w-16 h-16 print-colors" style={{color: accentColor}} />}
                    <div>
                        <h2 className="text-2xl font-bold">{companyDetails.name}</h2>
                        <p className="text-sm text-gray-600 whitespace-pre-line mt-1">{companyDetails.address}</p>
                        <p className="text-sm text-gray-600">{companyDetails.email}</p>
                    </div>
                </div>

                <div className="flex justify-center">
                    {(documentType === 'Invoice') && <QRCode value={publicUrl} size={80} />}
                </div>

                <div className="text-right">
                    <h1 className="text-4xl font-extrabold uppercase print-colors" style={{color: accentColor}}>{documentType}</h1>
                    <p className="mt-2 text-sm text-gray-700"># {documentNumber}</p>
                </div>
            </header>

            <section className="grid md:grid-cols-2 print:grid-cols-2 gap-8 my-10 relative z-10">
                <div>
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-600 mb-2">Bill To</h3>
                    <p className="font-bold text-lg">{clientDetails.name || 'Client Name'}</p>
                    <p className="text-gray-700">{clientDetails.company || 'Client Company'}</p>
                    <p className="text-gray-700 whitespace-pre-line">{clientDetails.address || 'Client Address'}</p>
                    <p className="text-gray-700">{clientDetails.email || 'client@email.com'}</p>
                </div>
                <div className="text-left md:text-right">
                    <div className="space-y-2">
                        <p><span className="font-semibold text-gray-700">{documentType} Date: </span>{new Date(documentDate).toLocaleDateString()}</p>
                        {documentType === 'Invoice' && dueDate && (<p><span className="font-semibold text-gray-700">Due Date: </span>{new Date(dueDate).toLocaleDateString()}</p>)}
                    </div>
                    {showBarcode && (
                        <div className="mt-4 flex justify-start md:justify-end">
                            <Barcode value={documentNumber} />
                        </div>
                    )}
                </div>
            </section>

            <section className="relative z-10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left table-auto">
                        <thead>
                            <tr className="text-sm uppercase text-white print-colors" style={{backgroundColor: accentColor}}>
                                <th className="p-3 font-semibold w-1/2">Description</th>
                                <th className="p-3 text-center font-semibold">Qty</th>
                                <th className="p-3 text-right font-semibold">Unit Price</th>
                                <th className="p-3 text-right font-semibold">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-sm">
                            {lineItems.map(item => (
                                <tr key={item.id} className="even:bg-gray-50 print-colors">
                                    <td className="p-3 align-top text-base leading-relaxed text-gray-800">{item.description || "N/A"}</td>
                                    <td className="p-3 text-center align-top text-gray-900">{item.quantity}</td>
                                    <td className="p-3 text-right align-top text-gray-900">{currency}{parseFloat(item.price || '0').toFixed(2)}</td>
                                    <td className="p-3 text-right align-top font-medium text-gray-900">{currency}{((parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0)).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="flex justify-between mt-8 relative z-10">
                 <div className="w-2/3">
                    {notes && (
                        <section>
                            <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-600 mb-2">Notes</h3>
                            <p className="text-sm text-gray-700 whitespace-pre-line">{notes}</p>
                        </section>
                    )}
                </div>
                <div className="w-full max-w-sm space-y-2 text-sm relative">
                    <div className="flex justify-between"><span className="text-gray-800">Subtotal:</span><span className="font-medium text-gray-800">{currency}{subtotal.toFixed(2)}</span></div>
                    {discountAmount > 0 && (
                        <div className="flex justify-between">
                            <span className="text-gray-800">
                                Discount {discountType === 'Percentage' ? `(${discountValue}%)` : ''}:
                            </span>
                            <span className="font-medium text-red-600">-{currency}{discountAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between"><span className="text-gray-800">Tax ({taxRate}%):</span><span className="font-medium text-gray-800">{currency}{taxAmount.toFixed(2)}</span></div>
                    
                    <div className="flex justify-between pt-2 mt-2 border-t-2 print-colors" style={{borderColor: accentColor}}>
                        <span className="font-bold text-xl text-gray-900">{documentType === 'Invoice' && paymentStatus === 'paid' ? 'Amount Paid:' : 'Total:'}</span>
                        <span className="font-bold text-xl text-gray-900">{currency}{total.toFixed(2)}</span>
                    </div>

                    {documentType === 'Invoice' && paymentStatus && (
                        <div 
                            className="paid-stamp print-colors absolute -bottom-5 right-0 w-24 h-24 flex items-center justify-center"
                            style={{ opacity: 0.7 }}
                            aria-label={`Invoice ${paymentStatus}`}
                        >
                            <div 
                                className={`absolute inset-0 border-2 rounded-full print-colors ${paymentStatus === 'paid' ? 'border-green-600' : 'border-red-600'}`}
                            ></div>
                            <span 
                                className={`text-2xl font-black transform -rotate-15 print-colors ${paymentStatus === 'paid' ? 'text-green-600' : 'text-red-600'}`}
                            >
                                {paymentStatus.toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>
            </section>

            <footer className="mt-12 pt-6 border-t border-gray-200 relative z-10">
                {/* QR Code moved to header */}
            </footer>
        </div>
    );
};

export default DocumentPreview;