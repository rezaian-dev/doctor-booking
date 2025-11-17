import React from 'react';
import Profile from './Profile';
import Contact from './Contact';
import BookingCalendar from './BookingCalendar';


const BookingCard: React.FC = () => {
  return (
    <section className="container px-4 md:px-8 mt-6 md:mt-8">
      {/* Two-column layout: left = info, right = booking controls 🧩 */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-12 gap-x-5">
        {/* Left: Doctor profile + contact info 📋 */}
        <div className="lg:col-span-7 xl:col-span-8">
          <Profile />
          <Contact />
        </div>
        {/* Right: Calendar + book button 📅➡️ */}
        <div className="lg:col-span-5 xl:col-span-4">
          <BookingCalendar />
        </div>
      </div>
    </section>
  );
};

export default BookingCard;
