import Header from '@/components/layouts/Header';
import SearchHero from '@/components/templates/home/SearchHero';
import React from 'react';

const Page: React.FC = () => {
  return (
    <>
    <Header/>
    <SearchHero mode='find-doctor'/>
    </>
  );
};

export default Page;
