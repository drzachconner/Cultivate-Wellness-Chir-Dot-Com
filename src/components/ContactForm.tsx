import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { SITE } from '../data/site';
import { Loader2 } from 'lucide-react';

export default function ContactForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      _formType: 'contact',
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      message: formData.get('message') as string,
    };

    try {
      const response = await fetch('/api/form-handler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      navigate('/thanks');
    } catch (err) {
      console.error('Contact form error:', err);
      setError('Failed to send. Please check your connection or call us directly.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
      {error && (
        <div role="alert" aria-live="assertive" className="p-4 bg-red-100 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name *
        </label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Your Name"
          maxLength={120}
          required
          autoComplete="name"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="your@email.com"
          required
          autoComplete="email"
          inputMode="email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone (optional)
        </label>
        <input
          id="phone"
          type="tel"
          name="phone"
          placeholder="(555) 555-5555"
          autoComplete="tel"
          inputMode="tel"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="How can we help you?"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent resize-none"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-3 bg-primary-dark text-white font-semibold rounded-lg hover:bg-primary-accent disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Sending...
          </>
        ) : (
          'Send Message'
        )}
      </button>

      <p className="text-xs text-gray-600 mt-2">
        <strong>Disclaimer:</strong> This form is for general inquiries only. For scheduling or
        medical concerns, please call{' '}
        <a
          href={`tel:${SITE.phone.replace(/[^+\d]/g, '')}`}
          className="underline hover:text-primary-dark"
        >
          {SITE.phone}
        </a>{' '}
        or use our booking system.
      </p>
    </form>
  );
}
