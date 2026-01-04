import React from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

const QRCode: React.FC<QRCodeProps> = ({ value, size = 120, className = '' }) => {
  if (!value) return null;

  const encodedValue = encodeURIComponent(value);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodedValue}&size=${size}x${size}&bgcolor=ffffff&color=000000&margin=0`;

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <img
        src={qrUrl}
        alt="QR Code"
        width={size}
        height={size}
        className="print-colors"
      />
    </div>
  );
};

export default QRCode;