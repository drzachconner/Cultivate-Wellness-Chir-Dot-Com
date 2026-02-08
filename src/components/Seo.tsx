import { Helmet } from 'react-helmet-async';
import { getSeoData, SeoProps } from '../hooks/useSeo';
import { SITE } from '../data/site';

export default function Seo(props: SeoProps) {
  const { fullTitle, metaDescription, canonical, ogImage, robotsContent } = getSeoData(props);
  const defaultOgImage = `https://${SITE.domain}/images/hero-family.webp`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {canonical && <link rel="canonical" href={canonical} />}
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage || defaultOgImage} />
      {canonical && <meta property="og:url" content={canonical} />}
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage || defaultOgImage} />
      {robotsContent && <meta name="robots" content={robotsContent} />}
    </Helmet>
  );
}
