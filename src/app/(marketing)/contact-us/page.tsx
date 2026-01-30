'use client';

import { FC } from 'react';
import Header from '@/components/layout/header';
import ContactInfo from '@/components/features/contact-us/contact-info';
import ContactForm from '@/components/features/contact-us/contact-form';
import ContactMap from '@/components/features/contact-us/contact-map';
import Footer from '@/components/layout/footer';
import FooterMobile from '@/components/layout/footer-mobile';


// 📬 Contact page layout — simple, semantic, and responsive
const ContactPage: FC = () => {
  return (
    <>
      <Header />
        {/* 🧱 Main content container with Tailwind's `container` class */}
        <div className="container px-4 md:px-8 py-7">
          <div className="mx-auto space-y-8">
            <ContactInfo />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ContactForm />
              <ContactMap />
            </div>
          </div>
        </div>
      <Footer />
      <FooterMobile />
    </>
  );
};

export default ContactPage;
