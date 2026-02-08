import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-sm text-gray-600 ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-1">
        <li className="flex items-center">
          <Link
            to="/"
            className="flex items-center hover:text-primary-dark transition-colors"
            aria-label="Home"
          >
            <Home size={16} />
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight size={16} className="mx-1 text-gray-400" aria-hidden="true" />
            {item.href && index < items.length - 1 ? (
              <Link
                to={item.href}
                className="hover:text-primary-dark transition-colors"
              >
                {item.name}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium" aria-current="page">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
