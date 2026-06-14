import FeatureCard from './feature-card';
import AosWrapper from '@/components/shared/aos-wrapper';
import { aosStagger } from '@/lib/utils/aos';
import { Settings, MessageSquare, Clock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface InfoCardsProps {
  mode: 'home' | 'about';
}

const features = [
  {
    id: 1,
    icon: Settings,
    title: 'مدیریت و تغییر نوبت‌ها به راحتی',
    description: 'توانایی لغو، تغییر و مدیریت نوبت‌ها به راحتی',
  },
  {
    id: 2,
    icon: MessageSquare,
    title: 'اطمینان از انتخاب مجرب‌ترین پزشکان',
    description: 'بهترین پزشکان را با توجه به نظرات کاربران انتخاب کنید',
  },
  {
    id: 3,
    icon: Clock,
    title: 'دسترسی ۲۴ ساعته به پزشکان',
    description: 'در هر زمانی می‌توانید نوبت خود را رزرو کنید',
  },
] as const;

const InfoCards = ({ mode }: InfoCardsProps) => {
  return (
    <section
      className={cn('container px-4 md:px-8', mode === "home" ? "mt-3.5 md:mt-6" : "mt-10.75 md:mt-33.75")}
    >
      {mode === "about" && (
        <AosWrapper animation="fade-down" className="mb-6">
          <h2 className="text-black text-2xl font-bold">چرا دکتر رزرو؟</h2>
        </AosWrapper>
      )}
      <div
        className={cn(
          'grid',
          'grid-cols-1',
          'md:grid-cols-2',
          'lg:grid-cols-3',
          'gap-4 auto-rows-fr'
        )}
      >
        {features.map((feature, i) => (
          <AosWrapper key={feature.id} animation="fade-up" delay={aosStagger(i)}>
            <FeatureCard {...feature} index={i} />
          </AosWrapper>
        ))}
      </div>
    </section>
  );
};

export default InfoCards;
