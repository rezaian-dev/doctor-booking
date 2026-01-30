import { IoArrowForwardCircleOutline } from "react-icons/io5";
import Link from 'next/link';
import clsx from 'clsx';
interface pageTitleProps {
  title:string
  hasPadding:boolean
}

const PageTitle = ({title,hasPadding}:pageTitleProps) => {
  return (
    <section className={clsx("container  mt-6 md:mt-8 flex items-center gap-x-2",hasPadding && "px-4 md:px-7.5")} >
      {/* Navigate back to doctors list 🔄 */}
      <Link href="/doctors">
        <IoArrowForwardCircleOutline size={24} color='#3D3D3D' />
      </Link>
      {/* Main page title — clear, bold, semantic 🎯 */}
      <h1 className="text-xl font-bold text-neutral-850">{title}</h1>
    </section>
  );
};

export default PageTitle;
