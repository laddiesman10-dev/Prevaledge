import React from 'react';
import DocumentGenerator from '../ui/DocumentGenerator';

const QuotationGeneratorView: React.FC = () => {
  return (
    <DocumentGenerator
      documentType="Quotation"
      documentNumberPrefix="QUO"
      title="Quotation Generator"
      initialNotes="This quotation is valid for 30 days."
    />
  );
};

export default QuotationGeneratorView;
