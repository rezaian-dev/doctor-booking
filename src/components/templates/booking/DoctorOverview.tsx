import React from 'react';
import Profile from './Profile';
import DoctorContact from './DoctorContact';

/**
 * DoctorOverview Component 🏥
 * Renders the doctor's profile and contact information in sequence
 * This component serves as a container for displaying essential doctor information
 */
const DoctorOverview: React.FC = () => {
  return (
    <>
      {/* Doctor's profile section 👤 */}
      <Profile showBio={true} />
      {/* Doctor's contact details section 📞 */}
      <DoctorContact />
    </>
  );
};

export default DoctorOverview;
