import FeatureCard from './feature-card';
import {
  Settings04Icon,
  Comment01Icon,
  Clock02Icon,
} from '@hugeicons/core-free-icons';
import clsx from 'clsx';

interface InfoCardsProps {
  mode: 'home' | 'about';
}

/**
 * 💡 Key value propositions section
 * 🃏 3 feature cards explaining platform benefits
 * 📱 Responsive: 1 → 2 → 3 columns
 * 🔒 Immutable data (as const)
 */
const features = [
  {
    id: 1,
    icon: Settings04Icon,
    title: 'مدیریت و تغییر نوبت‌ها به راحتی',
    description: 'توانایی لغو، تغییر و مدیریت نوبت‌ها به راحتی',
  },
  {
    id: 2,
    icon: Comment01Icon,
    title: 'اطمینان از انتخاب مجرب‌ترین پزشکان',
    description: 'بهترین پزشکان را با توجه به نظرات کاربران انتخاب کنید',
  },
  {
    id: 3,
    icon: Clock02Icon,
    title: 'دسترسی ۲۴ ساعته به پزشکان',
    description: 'در هر زمانی می‌توانید نوبت خود را رزرو کنید',
  },
] as const;

/**
 * 🧩 Feature cards grid – highlights platform benefits
 * 📐 Auto height (auto-rows-fr) for visual consistency
 * 🌐 Fully responsive & scalable
 */
const InfoCards = ({mode}:InfoCardsProps) => {
  return (
    <section
      className={clsx('container px-4 md:px-8', mode ==="home" ? "mt-3.5 md:mt-6": "mt-10.75 md:mt-33.75")}
    >
      {mode ==="about" && <h2 className="text-black text-2xl font-bold mb-6">چرا دکتر رزرو؟</h2>}
      <div
        className={clsx(
          'grid',
          'grid-cols-1', // mobile
          'md:grid-cols-2', // tablet
          'lg:grid-cols-3', // desktop
          'gap-4 auto-rows-fr'
        )}
      >
        {features.map(feature => (
          <FeatureCard key={feature.id} {...feature} />
        ))}
      </div>
    </section>
  );
};

export default InfoCards;
