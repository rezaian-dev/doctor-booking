import React from 'react';
import Header from '@/components/layouts/Header';
import PageTitle from '@/components/PageTitle';
import BookingCard from '@/components/templates/booking/BookingCard';


const page: React.FC = () => {
  return (
    <>
      <Header />
      <PageTitle />
      <BookingCard/>
    </>
  );
};

export default page;
