import React from 'react';
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import Link from 'next/link';

const PageTitle: React.FC = () => {
  return (
    <section className="container px-4 md:px-[30px] mt-6 md:mt-8 flex items-center gap-x-2">
      {/* Navigate back to doctors list 🔄 */}
      <Link href="/doctors">
        <IoArrowForwardCircleOutline size={24} color='#3D3D3D' />
      </Link>
      {/* Main page title — clear, bold, semantic 🎯 */}
      <h1 className="text-xl font-bold text-neutral-850">صفحه پزشک</h1>
    </section>
  );
};

export default PageTitle;
