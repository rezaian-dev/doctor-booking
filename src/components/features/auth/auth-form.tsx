'use client';
import { ReactNode } from 'react';
import { Stethoscope } from 'lucide-react';
import Link from 'next/link';

interface AuthFormProps {
  title: string;
  description: string;
  children: ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
}

/**
 * 🧩 Reusable auth layout wrapper – used for both login & signup
 * 🎨 Consistent UI: branded header, card container, toggle link
 * 🔗 Footer supports seamless navigation between auth flows
 * 💡 Decoupled from logic – purely presentational (dumb component)
 */
export const AuthForm = ({
  title,
  description,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthFormProps) => {
  return (
    <div className="bg-linear-to-b from-neutral-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* 🏥 Branded header with icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">{title}</h1>
          <p className="text-neutral-600">{description}</p>
        </div>

        {/* 📄 Form card with shadow & border */}
        <div className="bg-white rounded-3xl shadow-lg border border-neutral-200 p-8">
          {children}
        </div>

        {/* 🔁 Toggle link (e.g., "Don't have an account? Sign up") */}
        <div className="text-center mt-6">
          <p className="text-neutral-600">
            {footerText}{' '}
            <Link
              href={footerLinkHref}
              className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
            >
              {footerLinkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
