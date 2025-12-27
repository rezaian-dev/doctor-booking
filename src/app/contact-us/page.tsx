'use client';

import Header from '@/components/layouts/Header';
import { FC } from 'react';
import ContactInfo from '@/components/templates/contact-us/ContactInfo';
import ContactForm from '@/components/templates/contact-us/ContactForm';
import ContactMap from '@/components/templates/contact-us/ContactMap';
import Footer from '@/components/layouts/Footer';
import FooterMobile from '@/components/layouts/FooterMobile';

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
