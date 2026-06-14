import ContactInfo from "@/components/features/contact-us/contact-info";
import ContactForm from "@/components/features/contact-us/contact-form";
import ContactMap from "@/components/features/contact-us/contact-map";
import { pageMetadata } from "@/lib/utils/seo";

// 🧱 SSG — static page with a client form; prerendered for best SEO
export const dynamic = "force-static";

export const metadata = pageMetadata({
  title: "تماس با ما",
  description: "با تیم پشتیبانی دکتر رزرو در ارتباط باشید.",
  robots: "index, follow",
});

// 📬 Contact page — info banner + form + map
export default function ContactPage() {
  return (
    <div className="container px-4 md:px-8 py-7">
      <div className="space-y-8">
        <ContactInfo />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ContactForm />
          <ContactMap />
        </div>
      </div>
    </div>
  );
}
