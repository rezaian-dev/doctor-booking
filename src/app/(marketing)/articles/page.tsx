import { FC } from 'react';
import Header from '@/components/layout/header';
import ArticlesGrid from '@/components/features/articles/articles-grid';
import Footer from '@/components/layout/footer';
import FooterMobile from '@/components/layout/footer-mobile';

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
