import { useSeo } from '../hooks/useSeo';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function Thanks() {
  useSeo({
    title: 'Thank You',
    description: 'Thank you for contacting us. We will reply within 24 hours.',
    canonical: '/thanks',
  });

  return (
    <main id="main" className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="text-center max-w-md px-4">
        <CheckCircle size={64} className="text-emerald-700 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Thank You!</h1>
        <p className="text-lg text-gray-700 mb-6">
          We've received your message and will reply within 24 hours.
        </p>
        <Link
          to="/"
          className="inline-block bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-800 transition"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
