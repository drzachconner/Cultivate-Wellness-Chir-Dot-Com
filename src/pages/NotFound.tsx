import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function NotFound() {
  return (
    <main id="main" className="flex items-center justify-center min-h-screen bg-gray-50">
      <Seo
        title="404 - Page Not Found"
        description="The page you are looking for could not be found."
      />
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <Link
          to="/"
          className="inline-block bg-primary-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-accent transition"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
