import { User, Award, Calendar } from 'lucide-react';

interface AuthorBylineProps {
  author?: {
    name: string;
    credentials: string;
    image?: string;
    bio?: string;
    url?: string;
  };
  publishDate?: string;
  modifiedDate?: string;
  reviewedBy?: {
    name: string;
    credentials: string;
  };
  showSchema?: boolean;
}

export default function AuthorByline({
  author = {
    name: 'Dr. Zach Conner',
    credentials: 'Doctor of Chiropractic, Palmer College',
    image: '/images/dr-zach.webp',
    bio: 'Board-certified chiropractor specializing in pediatric, prenatal, and family care.',
    url: '/meet-dr-zach',
  },
  publishDate,
  modifiedDate,
  reviewedBy,
  showSchema = true,
}: AuthorBylineProps) {
  const schema = showSchema
    ? {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: author.name,
        jobTitle: 'Doctor of Chiropractic',
        image: author.image,
        url: author.url,
        description: author.bio,
      }
    : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <div className="bg-gray-50 border-l-4 border-primary-dark rounded-lg p-6 my-8">
        <div className="flex items-start gap-4">
          {author.image && (
            <img
              src={author.image}
              alt={author.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <User size={16} className="text-primary-dark" />
              <span className="font-bold text-gray-900">
                {author.url ? (
                  <a href={author.url} className="hover:text-primary-dark transition">
                    {author.name}
                  </a>
                ) : (
                  author.name
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Award size={14} className="text-primary-dark" />
              <span>{author.credentials}</span>
            </div>
            {author.bio && <p className="text-sm text-gray-700 mb-3">{author.bio}</p>}

            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
              {publishDate && (
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>
                    Published: <time dateTime={publishDate}>{new Date(publishDate).toLocaleDateString()}</time>
                  </span>
                </div>
              )}
              {modifiedDate && (
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span className="font-semibold text-primary-dark">
                    Last Updated: <time dateTime={modifiedDate}>{new Date(modifiedDate).toLocaleDateString()}</time>
                  </span>
                </div>
              )}
            </div>

            {reviewedBy && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">Medically reviewed by:</span> {reviewedBy.name},{' '}
                  {reviewedBy.credentials}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
