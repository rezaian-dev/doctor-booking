import AosWrapper from '@/components/shared/aos-wrapper';
import { aosStagger } from '@/lib/utils/aos';

const FeatureCards = () => {
  const achievements = [
    { id: 1, count: '+100 هزار', title: 'کاربر فعال' },
    { id: 2, count: '+2 هزار',   title: 'متخصص تایید شده' },
    { id: 3, count: '+500 هزار', title: 'نوبت ثبت شده' },
    { id: 4, count: '+3 هزار',   title: 'کلینیک فعال' },
    { id: 5, count: '+5 هزار',   title: 'پزشک در سیستم' },
  ] as const;

  return (
    <section className="container px-4 md:px-8 my-10 md:my-33.75">
      <AosWrapper animation="fade-down" className="text-center mb-4">
        <h2 className="text-neutral-990 text-2xl md:text-3xl font-bold">
          افتخارات و دستاوردهای ما
        </h2>
      </AosWrapper>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mt-6 gap-4 md:gap-7 auto-rows-[117px]">
        {achievements.map(({ id, count, title }, i) => (
          <AosWrapper key={id} animation="zoom-in" delay={aosStagger(i)}>
            <div className="group flex overflow-hidden items-center justify-center flex-col gap-y-3 bg-white rounded-xl border border-neutral-100 transition-all duration-300 relative hover:shadow-[0_8px_24px_-4px_rgba(65,121,240,0.12)] hover:-translate-y-0.5 h-full">
              <div className="absolute inset-0 bg-primary-50 opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"/>
              <h3 className="text-base md:text-[20px] text-neutral-990 font-bold group-hover:text-primary-900 transition-colors duration-300">
                {count}
              </h3>
              <span className="text-neutral-700 text-sm md:text-lg font-medium group-hover:text-neutral-900 transition-colors duration-300 text-center px-2">
                {title}
              </span>
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"/>
            </div>
          </AosWrapper>
        ))}
      </div>
    </section>
  );
};

export default FeatureCards;
