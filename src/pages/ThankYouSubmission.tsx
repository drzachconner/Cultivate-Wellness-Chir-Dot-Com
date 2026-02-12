import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function ThankYouSubmission() {
  return (
    <>
      <Seo
        title="Thank You"
        description="Thank you for your submission. You will receive an email with your download shortly."
        canonical="/thank-you-for-your-submission"
        robotsContent="noindex, nofollow"
      />
      <main id="main" className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center max-w-md px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Thank you!</h1>
          <p className="text-lg text-gray-600 mb-8">
            You will receive an email with your download shortly.
          </p>
          <Link
            to="/free-guides-for-parents"
            className="inline-block bg-[#0f172a] text-white px-8 py-3 rounded-full font-medium hover:bg-[#1e293b] transition"
          >
            Back to Free Guides
          </Link>
        </div>
      </main>
    </>
  );
}
