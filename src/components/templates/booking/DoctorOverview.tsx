import React from 'react';
import Contact from './Contact';
import Profile from './Profile';

/**
 * DoctorOverview Component 🏥
 * Renders the doctor's profile and contact information in sequence
 * This component serves as a container for displaying essential doctor information
 */
const DoctorOverview: React.FC = () => {
  return (
    <>
      {/* Doctor's profile section 👤 */}
      <Profile />
      {/* Doctor's contact details section 📞 */}
      <Contact />
    </>
  );
};

export default DoctorOverview;
