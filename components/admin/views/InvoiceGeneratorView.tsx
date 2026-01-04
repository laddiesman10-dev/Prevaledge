import React from 'react';
import DocumentGenerator from '../ui/DocumentGenerator';

const InvoiceGeneratorView: React.FC = () => {
  return (
    <DocumentGenerator
      documentType="Invoice"
      documentNumberPrefix="INV"
      title="Invoice Generator"
      initialNotes=""
    />
  );
};

export default InvoiceGeneratorView;
