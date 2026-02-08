'use client';

import { useEffect } from 'react';

// International portal is hosted separately
// This page redirects to the international site
const INTERNATIONAL_SITE_URL = 'https://happy-society.org';

export default function InternationalRedirect() {
  useEffect(() => {
    // Redirect to international portal
    window.location.href = INTERNATIONAL_SITE_URL;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to International Portal...</p>
        <p className="text-sm text-gray-400 mt-2">
          <a href={INTERNATIONAL_SITE_URL} className="text-primary-600 hover:underline">
            Click here if not redirected
          </a>
        </p>
      </div>
    </div>
  );
}
