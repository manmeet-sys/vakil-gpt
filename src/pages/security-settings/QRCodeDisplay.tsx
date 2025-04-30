
import React from 'react';

interface QRCodeDisplayProps {
  imageUrl: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ imageUrl }) => {
  return (
    <div className="bg-white p-4 rounded-lg w-48 h-48 flex items-center justify-center">
      <img 
        src={imageUrl} 
        alt="Two-factor authentication QR code"
        className="w-full h-full"
      />
    </div>
  );
};

export default QRCodeDisplay;
