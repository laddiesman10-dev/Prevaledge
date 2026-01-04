import React from 'react';
// @ts-ignore
import BarcodeComponent from 'react-barcode';

interface BarcodeProps {
  value: string;
  className?: string;
  width?: number;
  height?: number;
}

const Barcode: React.FC<BarcodeProps> = ({ value, className = '', width = 1.5, height = 50 }) => {
  if (!value) return null;

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <BarcodeComponent 
        value={value} 
        width={width} 
        height={height} 
        displayValue={false}
        background="transparent"
        margin={0}
      />
    </div>
  );
};

export default Barcode;