import React, { useContext, useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import { SiteDataContext } from '../data/siteDataContext';
import { RouterContext } from '../types';
import DocumentPreview from '../components/admin/ui/DocumentPreview';
import Button from '../components/ui/Button';
import AnimateOnScroll from '../components/ui/AnimateOnScroll';
import CheckCircleIcon from '../components/icons/CheckCircleIcon';
import LockIcon from '../components/icons/LockIcon';
import TrustBadges from '../components/TrustBadges';

const PublicInvoicePage: React.FC = () => {
    const { route } = useContext(RouterContext);
    const { documentHistory, updateDocumentStatusInHistory } = useContext(SiteDataContext);
    const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const publicId = route.split('/invoice/')[1];
    const document = documentHistory.find(d => d.publicId === publicId);

    useEffect(() => {
        // Add noindex tag to prevent search engine indexing of invoices
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex, nofollow';
        document.head.appendChild(meta);

        return () => {
            document.head.removeChild(meta);
        };
    }, []);

    const handleSimulatePayment = async () => {
        if (!document) return;
        setIsSimulatingPayment(true);
        // Simulate a network delay for the payment
        await new Promise(resolve => setTimeout(resolve, 1500));
        await updateDocumentStatusInHistory(document.id, 'paid');
        setIsSimulatingPayment(false);
        setPaymentSuccess(true);
    };

    if (!document || document.documentType !== 'Invoice') {
        return (
            <div className="bg-slate-950 text-white min-h-screen">
                <Header />
                <main className="pt-32 text-center container mx-auto px-4">
                    <h1 className="text-4xl font-bold">Invoice Not Found</h1>
                    <p className="text-slate-400 mt-4">The invoice you are looking for does not exist or the link is invalid.</p>
                    <Button href="/" className="mt-8">Return to Homepage</Button>
                </main>
                <Footer />
            </div>
        );
    }
    
    const isPaid = document.paymentStatus === 'paid' || paymentSuccess;

    return (
        <div className="bg-slate-950 text-white font-sans animate-content-fade-in">
            <ParticleBackground />
            <Header />
            <main id="top" className="relative z-10 pt-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="max-w-4xl mx-auto">
                        <header className="text-center mb-8">
                            <h1 className="text-4xl font-extrabold text-white">Invoice #{document.documentNumber}</h1>
                            <p className="text-slate-400 mt-2">From {document.companyDetails.name} for {document.clientDetails.company}</p>
                        </header>

                        {isPaid ? (
                             <AnimateOnScroll>
                                <div className="text-center p-8 bg-green-900/40 border border-green-500/50 rounded-lg">
                                    <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                                    <h2 className="text-3xl font-bold text-white">Payment Received!</h2>
                                    <p className="text-green-200 mt-2">Thank you for your payment. This invoice is now fully paid.</p>
                                </div>
                            </AnimateOnScroll>
                        ) : (
                             <AnimateOnScroll>
                                <div className="text-center p-8 bg-slate-900/50 border border-slate-800 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="text-left">
                                        <h2 className="text-2xl font-bold text-white">Total Due: {document.currency}{document.total.toFixed(2)}</h2>
                                        <p className="text-slate-400">Due by: {new Date(document.dueDate!).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex-shrink-0 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                        {document.paymentLink && (
                                            <Button href={document.paymentLink} className="w-full sm:w-auto">
                                                <LockIcon className="w-4 h-4 mr-2" />
                                                Pay Now
                                            </Button>
                                        )}
                                        <Button onClick={handleSimulatePayment} variant="secondary" className="w-full sm:w-auto" disabled={isSimulatingPayment}>
                                            {isSimulatingPayment ? 'Processing...' : 'Simulate Successful Payment'}
                                        </Button>
                                    </div>
                                </div>
                            </AnimateOnScroll>
                        )}
                        
                        <div className="mt-8">
                             <DocumentPreview document={document} previewId={`public-invoice-${document.publicId}`} />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
            <TrustBadges />
        </div>
    );
};

export default PublicInvoicePage;
