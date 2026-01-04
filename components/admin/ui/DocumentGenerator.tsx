import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import type { DocumentLineItem, NewArchivedDocument, Client } from '../../../types';
import Button from '../../ui/Button';
import TrashIcon from '../../icons/TrashIcon';
import PlusIcon from '../../icons/PlusIcon';
import { labelClass } from './formStyles';
import { SiteDataContext } from '../../../data/siteDataContext';
import UploadIcon from '../../icons/UploadIcon';
import PaletteIcon from '../../icons/PaletteIcon';
import DollarSignIcon from '../../icons/DollarSignIcon';
import BarcodeIcon from '../../icons/BarcodeIcon';
import SendIcon from '../../icons/SendIcon';
import EmailModal from './EmailModal';
import type { ArchivedDocument } from '../../../types';
import DocumentPreview from './DocumentPreview';
import SparklesIcon from '../../icons/SparklesIcon';
import AIQuoteAssistantModal from './AIQuoteAssistantModal';
import LinkIcon from '../../icons/LinkIcon';


interface DocumentGeneratorProps {
  documentType: 'Invoice' | 'Quotation';
  documentNumberPrefix: string;
  title: string;
  initialNotes: string;
}

const currencyOptions = [
    { symbol: '$', name: 'USD - United States Dollar' },
    { symbol: '€', name: 'EUR - Euro' },
    { symbol: '£', name: 'GBP - British Pound' },
    { symbol: '¥', name: 'JPY - Japanese Yen' },
    { symbol: 'A$', name: 'AUD - Australian Dollar' },
    { symbol: 'C$', name: 'CAD - Canadian Dollar' },
    { symbol: 'CHF', name: 'CHF - Swiss Franc' },
    { symbol: '¥', name: 'CNY - Chinese Yuan' },
    { symbol: '₹', name: 'INR - Indian Rupee' },
    { symbol: 'R$', name: 'BRL - Brazilian Real' },
    { symbol: '₽', name: 'RUB - Russian Ruble' },
    { symbol: '₩', name: 'KRW - South Korean Won' },
    { symbol: 'S$', name: 'SGD - Singapore Dollar' },
    { symbol: 'kr', name: 'NOK - Norwegian Krone' },
    { symbol: '$', name: 'MXN - Mexican Peso' },
    { symbol: 'HK$', name: 'HKD - Hong Kong Dollar' },
    { symbol: 'NZ$', name: 'NZD - New Zealand Dollar' },
    { symbol: 'kr', name: 'SEK - Swedish Krona' },
    { symbol: 'R', name: 'ZAR - South African Rand' },
    { symbol: '₺', name: 'TRY - Turkish Lira' },
    { symbol: 'zł', name: 'PLN - Polish Złoty' },
    { symbol: '฿', name: 'THB - Thai Baht' },
    { symbol: 'Rp', name: 'IDR - Indonesian Rupiah' },
    { symbol: 'Ft', name: 'HUF - Hungarian Forint' },
    { symbol: 'Kč', name: 'CZK - Czech Koruna' },
    { symbol: '₪', name: 'ILS - Israeli New Shekel' },
    { symbol: '$', name: 'CLP - Chilean Peso' },
    { symbol: '₱', name: 'PHP - Philippine Peso' },
    { symbol: 'د.إ', name: 'AED - UAE Dirham' },
    { symbol: '$', name: 'COP - Colombian Peso' },
    { symbol: '﷼', name: 'SAR - Saudi Riyal' },
    { symbol: 'RM', name: 'MYR - Malaysian Ringgit' },
];

const SettingsPanelSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg">
        <button className="w-full p-4 flex justify-between items-center text-left" onClick={() => setIsOpen(!isOpen)}>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <svg className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </button>
        {isOpen && <div className="p-4 border-t border-slate-800 space-y-4">{children}</div>}
    </div>
  );
};

const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({ documentType, documentNumberPrefix, title, initialNotes }) => {
  const { clients, addDocumentToHistory } = useContext(SiteDataContext);
  const publicId = useMemo(() => crypto.randomUUID(), []);

  const [companyDetails, setCompanyDetails] = useState({
    name: 'Prevaledge',
    address: 'C 1 To 26 Vardhman Grandeur, Andheri West\nMumbai, India 400058',
    email: 'info@prevaledge.com',
  });
  const [logo, setLogo] = useState<string | null>(null);
  const [accentColor, setAccentColor] = useState('#3B82F6');
  const [currency, setCurrency] = useState('$');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid'>('unpaid');
  const [showBarcode, setShowBarcode] = useState(true);
  const [paymentLink, setPaymentLink] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [includeYear, setIncludeYear] = useState(true);
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [clientDetails, setClientDetails] = useState({ name: '', company: '', address: '', email: '' });
  const [clientId, setClientId] = useState('');
  const [lineItems, setLineItems] = useState<DocumentLineItem[]>([
    { id: 1, description: '', quantity: '1', price: '0.00' },
  ]);
  const [notes, setNotes] = useState(initialNotes);
  const [taxRate, setTaxRate] = useState('0');
  const [discountType, setDiscountType] = useState<'Percentage' | 'Fixed'>('Percentage');
  const [discountValue, setDiscountValue] = useState('0');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailData, setEmailData] = useState<{ document: ArchivedDocument, htmlContent: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Generate the next sequential document number
    const getNextDocumentNumber = () => {
        const year = new Date().getFullYear();
        const key = `doc_counter_${documentType}${includeYear ? `_${year}` : ''}`;
        
        let currentNumber = parseInt(localStorage.getItem(key) || '0', 10);
        currentNumber++;
        localStorage.setItem(key, currentNumber.toString());

        const formattedNumber = currentNumber.toString().padStart(3, '0');
        
        return includeYear 
            ? `${documentNumberPrefix}-${year}-${formattedNumber}`
            : `${documentNumberPrefix}-${formattedNumber}`;
    };

    setDocNumber(getNextDocumentNumber());

    if (documentType === 'Invoice' && !dueDate) {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + 30);
      setDueDate(futureDate.toISOString().split('T')[0]);
    }
  }, [documentType, documentNumberPrefix, includeYear]);

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section: 'company' | 'client') => {
    const { name, value } = e.target;
    if (section === 'company') {
      setCompanyDetails(prev => ({...prev, [name]: value}));
    } else {
      setClientDetails(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleClientSelection = (selectedClientId: string) => {
      setClientId(selectedClientId);
      const selectedClient = clients.find(c => c.id === selectedClientId);
      if (selectedClient) {
          setClientDetails({
              name: selectedClient.name,
              company: selectedClient.company,
              email: selectedClient.email,
              address: '' // Address is not stored in Client type, so clear it
          });
      } else {
          setClientDetails({ name: '', company: '', address: '', email: '' });
      }
  }

  const handleLineItemChange = (index: number, field: keyof Omit<DocumentLineItem, 'id'>, value: string) => {
    const items = [...lineItems];
    items[index] = { ...items[index], [field]: value };
    setLineItems(items);
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setLogo(reader.result as string);
        reader.readAsDataURL(file);
    }
  };

  const addLineItem = () => setLineItems([...lineItems, { id: Date.now(), description: '', quantity: '1', price: '0.00' }]);
  const removeLineItem = (id: number) => setLineItems(lineItems.filter(item => item.id !== id));
  
  const handleAIItemsGenerated = (items: Omit<DocumentLineItem, 'id'>[]) => {
      const newItems = items.map(item => ({ ...item, id: Date.now() + Math.random() }));
      // If the first line item is empty, replace it. Otherwise, append.
      if (lineItems.length === 1 && !lineItems[0].description && parseFloat(lineItems[0].price) === 0) {
          setLineItems(newItems);
      } else {
          setLineItems(prev => [...prev, ...newItems]);
      }
      setIsAIAssistantOpen(false);
  };

  const { subtotal, discountAmount, taxAmount, total } = useMemo(() => {
    const sub = lineItems.reduce((acc, item) => acc + (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0), 0);

    let discAmount = 0;
    const discValue = parseFloat(discountValue) || 0;
    if (discountType === 'Percentage' && discValue > 0) {
        discAmount = sub * (discValue / 100);
    } else if (discountType === 'Fixed' && discValue > 0) {
        discAmount = discValue;
    }

    const discountedSubtotal = sub - discAmount;
    const tax = discountedSubtotal * (parseFloat(taxRate) / 100);
    const tot = discountedSubtotal + tax;
    
    return { subtotal: sub, discountAmount: discAmount, taxAmount: tax, total: tot };
  }, [lineItems, taxRate, discountType, discountValue]);

  const currentDocumentState = useMemo((): NewArchivedDocument => ({
    publicId,
    documentType,
    documentNumber: docNumber,
    documentDate: docDate,
    dueDate: documentType === 'Invoice' ? dueDate : undefined,
    companyDetails,
    clientDetails,
    clientId,
    lineItems,
    notes,
    taxRate,
    discountType,
    discountValue,
    subtotal,
    discountAmount,
    taxAmount,
    total,
    logo,
    accentColor,
    currency,
    showBarcode,
    paymentStatus: documentType === 'Invoice' ? paymentStatus : undefined,
    paymentLink,
  }), [
    publicId, documentType, docNumber, docDate, dueDate, companyDetails, clientDetails, clientId,
    lineItems, notes, taxRate, discountType, discountValue, subtotal, discountAmount, taxAmount, total, logo, accentColor,
    currency, showBarcode, paymentStatus, paymentLink
  ]);


  const handleSaveAndPrint = async () => {
    setIsSaving(true);
    try {
        await addDocumentToHistory(currentDocumentState);
        setTimeout(() => {
            window.print();
            setIsSaving(false);
        }, 250); // Small delay to ensure state update propagates if needed.
    } catch (error) {
        console.error("Failed to save document:", error);
        setIsSaving(false);
    }
  };

  const handleEmail = () => {
    const doc = { ...currentDocumentState, id: `doc-${Date.now()}` };
    const previewEl = document.getElementById(previewId);
    if (!previewEl) return;
    
    setEmailData({ document: doc, htmlContent: previewEl.outerHTML });
    setIsEmailModalOpen(true);
  };

  
  const inputClass = "w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";
  const previewId = `${documentType.toLowerCase()}-preview`;

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6 no-print">
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            <div className="flex flex-wrap gap-4 justify-end flex-grow sm:flex-grow-0">
            <Button variant="secondary" onClick={handleEmail}>
                <SendIcon className="w-5 h-5 mr-2" />
                Email Document
            </Button>
            <Button onClick={handleSaveAndPrint} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Finalize & Save PDF'}
            </Button>
            </div>
        </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Panel: Settings */}
        <div className="lg:col-span-4 no-print space-y-6">
            <SettingsPanelSection title="Branding & Style">
                <div>
                    <label className={labelClass}>Company Logo</label>
                    <input type="file" accept="image/*" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" />
                    <Button variant="secondary" onClick={() => logoInputRef.current?.click()} className="w-full">
                        <UploadIcon className="w-4 h-4 mr-2"/> {logo ? 'Change Logo' : 'Upload Logo'}
                    </Button>
                    {logo && <img src={logo} alt="Company logo preview" className="mt-4 rounded-md max-h-16 mx-auto"/>}
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="accentColor" className={labelClass}>Accent Color</label>
                        <div className="relative flex items-center bg-slate-800/50 border border-slate-700 rounded-md">
                            <PaletteIcon className="w-5 h-5 text-slate-400 absolute left-3 pointer-events-none"/>
                            <input type="color" id="accentColor" value={accentColor} onChange={e => setAccentColor(e.target.value)} className="w-full h-10 pl-10 p-1 bg-transparent border-none cursor-pointer"/>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="currency" className={labelClass}>Currency</label>
                        <div className="relative">
                            <DollarSignIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10"/>
                            <select 
                                id="currency" 
                                value={currency} 
                                onChange={e => setCurrency(e.target.value)} 
                                className={`${inputClass} pl-10 appearance-none`}
                            >
                                {currencyOptions.map(opt => (
                                    <option key={opt.name} value={opt.symbol}>
                                        {opt.name} ({opt.symbol})
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                    <label htmlFor="showBarcode" className={`${labelClass} mb-0 flex items-center gap-2`}>
                        <BarcodeIcon className="w-5 h-5 text-slate-400"/>
                        Show Barcode
                    </label>
                    <div className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="showBarcode" checked={showBarcode} onChange={(e) => setShowBarcode(e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </div>
                </div>
            </SettingsPanelSection>

             {documentType === 'Invoice' && (
              <SettingsPanelSection title="Payment Integration">
                <div>
                    <label htmlFor="paymentLink" className={`${labelClass} flex items-center gap-2`}>
                      <LinkIcon className="w-5 h-5 text-slate-400"/> Payment Link (Optional)
                    </label>
                    <input
                        type="url"
                        id="paymentLink"
                        value={paymentLink}
                        onChange={e => setPaymentLink(e.target.value)}
                        className={inputClass}
                        placeholder="https://buy.stripe.com/..."
                    />
                    <p className="text-xs text-slate-500 mt-2">Add a link from your payment provider (Stripe, PayPal, etc.) to enable a "Pay Now" button on the public invoice page.</p>
                </div>
              </SettingsPanelSection>
            )}
            
            <SettingsPanelSection title="Your Company Details">
                <input name="name" value={companyDetails.name} onChange={e => handleDetailsChange(e, 'company')} placeholder="Company Name" className={inputClass} />
                <textarea name="address" value={companyDetails.address} onChange={e => handleDetailsChange(e, 'company')} placeholder="Company Address" className={`${inputClass} min-h-[60px]`} />
                <input name="email" type="email" value={companyDetails.email} onChange={e => handleDetailsChange(e, 'company')} placeholder="Company Email" className={inputClass} />
            </SettingsPanelSection>
             
            <SettingsPanelSection title="Client Details">
                <div>
                    <label htmlFor="client-select" className={labelClass}>Select Existing Client</label>
                    <select id="client-select" value={clientId} onChange={e => handleClientSelection(e.target.value)} className={inputClass}>
                        <option value="">-- New/Manual Client --</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.company})</option>)}
                    </select>
                </div>
                <hr className="border-slate-700"/>
                <input name="name" value={clientDetails.name} onChange={e => handleDetailsChange(e, 'client')} placeholder="Client Name" className={inputClass} />
                <input name="company" value={clientDetails.company} onChange={e => handleDetailsChange(e, 'client')} placeholder="Client Company" className={inputClass} />
                <textarea name="address" value={clientDetails.address} onChange={e => handleDetailsChange(e, 'client')} placeholder="Client Address" className={`${inputClass} min-h-[60px]`} />
                <input name="email" type="email" value={clientDetails.email} onChange={e => handleDetailsChange(e, 'client')} placeholder="Client Email" className={inputClass} />
            </SettingsPanelSection>
            
            <SettingsPanelSection title="Document Details">
                <div className="flex items-center justify-between">
                    <label htmlFor="includeYear" className={`${labelClass} mb-0 flex items-center gap-2`}>
                        Include Year in Number
                    </label>
                    <div className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="includeYear" checked={includeYear} onChange={(e) => setIncludeYear(e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label htmlFor="docNumber" className={labelClass}>{documentType} Number</label><input id="docNumber" type="text" value={docNumber} onChange={e => setDocNumber(e.target.value)} className={inputClass} /></div>
                    <div><label htmlFor="docDate" className={labelClass}>Date</label><input id="docDate" type="date" value={docDate} onChange={e => setDocDate(e.target.value)} className={inputClass} /></div>
                </div>
                {documentType === 'Invoice' && (<div><label htmlFor="dueDate" className={labelClass}>Due Date</label><input id="dueDate" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className={inputClass} /></div>)}
            </SettingsPanelSection>
            
            <SettingsPanelSection title="Line Items">
                {lineItems.map((item, index) => (
                    <div key={item.id} className="p-3 bg-slate-800/50 rounded-md space-y-2 relative">
                        <button onClick={() => removeLineItem(item.id)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5"><TrashIcon className="w-3 h-3" /></button>
                        <textarea value={item.description} onChange={e => handleLineItemChange(index, 'description', e.target.value)} placeholder="Description" className={`${inputClass} min-h-[40px]`} />
                        <div className="grid grid-cols-2 gap-2">
                            <input type="number" value={item.quantity} onChange={e => handleLineItemChange(index, 'quantity', e.target.value)} placeholder="Qty" className={inputClass} />
                            <input type="number" step="0.01" value={item.price} onChange={e => handleLineItemChange(index, 'price', e.target.value)} placeholder="Price" className={inputClass} />
                        </div>
                    </div>
                ))}
                <div className="flex gap-2">
                    <Button onClick={addLineItem} variant="secondary" className="w-full"><PlusIcon className="w-4 h-4 mr-2" /> Add Item</Button>
                    <Button onClick={() => setIsAIAssistantOpen(true)} className="w-full bg-purple-600 hover:bg-purple-500 shadow-purple-600/30 hover:shadow-purple-500/50 focus:ring-purple-400/50">
                        <SparklesIcon className="w-4 h-4 mr-2" /> AI Assistant
                    </Button>
                </div>
            </SettingsPanelSection>

            <SettingsPanelSection title="Totals & Notes">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="discountType" className={labelClass}>Discount Type</label>
                        <select id="discountType" value={discountType} onChange={e => setDiscountType(e.target.value as any)} className={inputClass}>
                            <option value="Percentage">Percentage (%)</option>
                            <option value="Fixed">Fixed Amount</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="discountValue" className={labelClass}>Discount Value</label>
                        <input id="discountValue" type="number" step="0.01" value={discountValue} onChange={e => setDiscountValue(e.target.value)} className={inputClass} />
                    </div>
                </div>
                <div><label htmlFor="taxRate" className={labelClass}>Tax Rate (%)</label><input id="taxRate" type="number" step="0.1" value={taxRate} onChange={e => setTaxRate(e.target.value)} className={inputClass} /></div>
                <div><label htmlFor="notes" className={labelClass}>Notes</label><textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} className={`${inputClass} min-h-[80px]`} /></div>
                {documentType === 'Invoice' && (
                    <div>
                        <label className={labelClass}>Payment Status</label>
                        <div className="flex gap-4 mt-2">
                            <div className="flex items-center">
                                <input id="status-unpaid" name="paymentStatus" type="radio" value="unpaid" checked={paymentStatus === 'unpaid'} onChange={() => setPaymentStatus('unpaid')} className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"/>
                                <label htmlFor="status-unpaid" className="ml-2 block text-sm font-medium text-slate-300">Unpaid</label>
                            </div>
                            <div className="flex items-center">
                                <input id="status-paid" name="paymentStatus" type="radio" value="paid" checked={paymentStatus === 'paid'} onChange={() => setPaymentStatus('paid')} className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"/>
                                <label htmlFor="status-paid" className="ml-2 block text-sm font-medium text-slate-300">Paid</label>
                            </div>
                        </div>
                    </div>
                )}
            </SettingsPanelSection>
        </div>

        {/* Right Panel: Preview */}
        <div className="lg:col-span-8 bg-slate-800/50 p-4 sm:p-6 lg:p-8 rounded-lg print:p-0 print:bg-transparent">
            <DocumentPreview document={currentDocumentState} previewId={previewId} />
        </div>
      </div>
      
      {emailData && (
        <EmailModal 
            isOpen={isEmailModalOpen}
            onClose={() => setIsEmailModalOpen(false)}
            documentData={emailData.document}
            documentHtml={emailData.htmlContent}
        />
      )}

      <AIQuoteAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        onGenerate={handleAIItemsGenerated}
      />
      
    </div>
  );
};

export default DocumentGenerator;