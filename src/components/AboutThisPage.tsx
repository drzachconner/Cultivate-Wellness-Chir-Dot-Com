import { FileText, User, Calendar, Award, ExternalLink } from 'lucide-react';

interface AboutThisPageProps {
  topic: string;
  topicUrl?: string;
  wikidataId?: string;
  author?: {
    name: string;
    credentials: string;
  };
  reviewedBy?: {
    name: string;
    credentials: string;
  };
  datePublished: string;
  dateModified: string;
  sources?: Array<{
    name: string;
    url: string;
  }>;
  keyFacts?: string[];
}

export default function AboutThisPage({
  topic,
  topicUrl,
  wikidataId,
  author = {
    name: 'Dr. Zach Conner',
    credentials: 'DC, Pediatric Specialist',
  },
  reviewedBy,
  datePublished,
  dateModified,
  sources = [],
  keyFacts = [],
}: AboutThisPageProps) {
  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 my-8">
      <div className="flex items-start gap-3 mb-4">
        <FileText className="text-blue-700 flex-shrink-0 mt-1" size={24} />
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">About This Page</h3>
          <p className="text-sm text-gray-600">Medical information quality indicators</p>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-2">
          <span className="font-semibold text-gray-700 min-w-[100px]">Topic:</span>
          <div className="flex-1">
            {topicUrl ? (
              <a
                href={topicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:underline inline-flex items-center gap-1"
              >
                {topic}
                <ExternalLink size={14} />
              </a>
            ) : (
              <span className="text-gray-900">{topic}</span>
            )}
            {wikidataId && (
              <span className="ml-2 text-xs text-gray-500">
                (
                <a
                  href={`https://www.wikidata.org/wiki/${wikidataId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Wikidata
                </a>
                )
              </span>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <User className="text-gray-600 mt-0.5" size={16} />
          <span className="font-semibold text-gray-700 min-w-[100px]">Author:</span>
          <span className="text-gray-900">
            {author.name}, {author.credentials}
          </span>
        </div>

        {reviewedBy && (
          <div className="flex items-start gap-2">
            <Award className="text-primary-dark mt-0.5" size={16} />
            <span className="font-semibold text-gray-700 min-w-[100px]">Reviewed By:</span>
            <span className="text-gray-900">
              {reviewedBy.name}, {reviewedBy.credentials}
            </span>
          </div>
        )}

        <div className="flex items-start gap-2">
          <Calendar className="text-gray-600 mt-0.5" size={16} />
          <span className="font-semibold text-gray-700 min-w-[100px]">Published:</span>
          <time dateTime={datePublished} className="text-gray-900">
            {new Date(datePublished).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>

        <div className="flex items-start gap-2">
          <Calendar className="text-primary-dark mt-0.5" size={16} />
          <span className="font-semibold text-gray-700 min-w-[100px]">Last Updated:</span>
          <time dateTime={dateModified} className="text-primary-dark font-semibold">
            {new Date(dateModified).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>

        {sources.length > 0 && (
          <div className="flex items-start gap-2">
            <span className="font-semibold text-gray-700 min-w-[100px]">Key Sources:</span>
            <div className="flex-1 space-y-1">
              {sources.map((source, index) => (
                <a
                  key={index}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline block inline-flex items-center gap-1"
                >
                  {source.name}
                  <ExternalLink size={12} />
                </a>
              ))}
            </div>
          </div>
        )}

        {keyFacts.length > 0 && (
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="font-semibold text-gray-700 mb-2">Key Facts:</p>
            <ul className="space-y-1 text-gray-900">
              {keyFacts.map((fact, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-700 font-bold">•</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-blue-200">
        <p className="text-xs text-gray-600 italic">
          This page follows evidence-based medical content guidelines with citations to authoritative
          sources. Information is regularly reviewed and updated by licensed healthcare professionals.
        </p>
      </div>
    </div>
  );
}
