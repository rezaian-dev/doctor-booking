import ProfileCard from '../../shared/profile-card';
import Contact from '@/components/features/booking/contact';

/**
 * DoctorOverview Component 🏥
 * Renders the doctor's profile and contact information in sequence
 * This component serves as a container for displaying essential doctor information
 */
const DoctorOverview = () => {
  return (
    <>
      {/* Doctor's profile section 👤 */}
      <ProfileCard mode={'default'} />
      {/* Doctor's contact details section 📞 */}
      <Contact />
    </>
  );
};

export default DoctorOverview;
