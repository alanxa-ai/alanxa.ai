import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  image = '/Alanxa.ai_Logo.png', 
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  structuredData
}) => {
  const siteTitle = 'Alanxa.ai | Leading AI Training & Data Annotation Services in India';
  const defaultDescription = 'Alanxa AI provides secure, scalable AI training data, data annotation, RLHF, and multilingual datasets to power enterprise-grade machine learning models.';
  const defaultKeywords = 'AI training data services, Data annotation company, AI data annotation services, Human in the loop AI, AI model training services, Machine learning data labeling, AI dataset creation, Enterprise AI data services, AI data solutions provider, AI data annotation company India, AI training data services India';
  const siteUrl = 'https://alanxa.ai';

  const fullTitle = title ? `${title} | Alanxa.ai` : siteTitle;
  const fullDescription = description || defaultDescription;
  const fullKeywords = keywords || defaultKeywords;
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  // Always include Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Alanxa AI",
    "url": "https://alanxa.ai",
    "logo": "https://alanxa.ai/Alanxa.ai_Logo.png",
    "sameAs": [
      "https://www.linkedin.com/company/alanxa",
      "https://twitter.com/alanxa_ai",
      "https://www.instagram.com/alanxa.ai/"
    ],
    "description": defaultDescription,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Pune",
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-6392525639",
      "contactType": "customer service",
      "areaServed": ["IN", "US", "GB", "AE"],
      "availableLanguage": ["English", "Hindi"]
    }
  };

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      <link rel="canonical" href={fullUrl} />
      <link rel="icon" href="/favicon.ico" sizes="48x48" />
      <link rel="icon" type="image/jpeg" href="/favicon.jpg" />
      <link rel="apple-touch-icon" href="/favicon.jpg" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="Alanxa AI" />
      <meta property="og:locale" content="en_US" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@alanxa_ai" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />

      {/* Geo-targeting for India/Global */}
      <meta name="geo.region" content="IN-MH" />
      <meta name="geo.placename" content="Pune, India" />
      <meta name="geo.position" content="18.5204;73.8567" />
      <meta name="ICBM" content="18.5204, 73.8567" />

      {/* Always render Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>

      {/* Additional Structured Data (e.g. WebSite, Article) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
