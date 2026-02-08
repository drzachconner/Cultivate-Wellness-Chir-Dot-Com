import { Helmet } from 'react-helmet-async';
import { getSeoData, SeoProps } from '../hooks/useSeo';

export default function Seo(props: SeoProps) {
  const { fullTitle, metaDescription, canonical, ogImage, robotsContent } = getSeoData(props);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      {robotsContent && <meta name="robots" content={robotsContent} />}
    </Helmet>
  );
}
