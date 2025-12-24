import Footer from '@/components/layouts/Footer';
import FooterMobile from '@/components/layouts/FooterMobile';
import Header from '@/components/layouts/Header';
import ArticlesGrid from '@/components/templates/articles/ArticlesGrid';
import { FC } from 'react';

const page: FC = () => {
  return (
    <>
    <Header/>
    <ArticlesGrid/>
    <Footer/>
    <FooterMobile/>
    </>
  );
};

export default page;
