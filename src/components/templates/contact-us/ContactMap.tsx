import { FC } from 'react';

// 🗺️ Static map preview with location info & secure external link
const ContactMap: FC = () => {
  const handleOpenMap = () => {
    window.open('https://maps.google.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
      <div className="relative h-full min-h-[600px]">
        <img
          src="/images/map.webp"
          alt="نقشه موقعیت مکانی: تهران، خیابان شریعتی، خیابان ملک، خیابان ورنوابی، پلاک ۱۳"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <h3 className="font-bold text-lg text-gray-800 mb-2">📍 موقعیت مکانی</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            تهران، خیابان شریعتی، خیابان ملک، خیابان ورنوابی، پلاک ۱۳
          </p>
          <button
            type="button"
            onClick={handleOpenMap}
            aria-label="مشاهده موقعیت مکانی در گوگل مپ"
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm font-medium"
          >
            🗺️ مشاهده در گوگل مپ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactMap;
