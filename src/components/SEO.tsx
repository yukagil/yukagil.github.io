import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import profile from '../data/profile.json';
import writings from '../data/writings.json';
import speakings from '../data/speakings.json';
import interviews from '../data/interviews.json';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  path?: string;
}

const baseUrl = profile.url;
const defaultImage = profile.imageUrl;
const defaultTitle = `${profile.name} | ${profile.jobTitle}`;
const defaultDescription = profile.description;

// "2026.04.12" -> "2026-04-12"（schema.org は ISO 8601 を要求する）
function toIsoDate(date: string): string | undefined {
  const m = date?.match(/^(\d{4})\.(\d{1,2})\.(\d{1,2})$/);
  return m ? `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}` : undefined;
}

// JSON-LD を <script> に埋める際、"</script>" でタグが閉じないようエスケープする
function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export default function SEO({
  title = defaultTitle,
  description = defaultDescription,
  image = defaultImage,
  type = 'profile',
  path = '',
}: SEOProps) {
  const location = useLocation();
  const url = `${baseUrl}${path || location.pathname}`;

  // --- 構造化データ ------------------------------------------------
  // JSX として描画することでプリレンダリング結果に含まれ、
  // JS を実行しないクローラ／エージェントにも届く
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${baseUrl}/#person`,
        name: profile.name,
        alternateName: profile.handle,
        jobTitle: profile.jobTitle,
        description: profile.description,
        image: profile.imageUrl,
        url: baseUrl,
        sameAs: Object.values(profile.socials),
        address: {
          '@type': 'PostalAddress',
          addressLocality: profile.location.locality,
          addressCountry: profile.location.country,
        },
        knowsAbout: profile.knowsAbout,
        alumniOf: profile.experiences
          .filter((e) => !e.isCurrent)
          .map((e) => ({
            '@type': 'Organization',
            name: e.company,
            ...(e.website ? { url: e.website } : {}),
          })),
        worksFor: profile.experiences
          .filter((e) => e.isCurrent)
          .map((e) => ({
            '@type': 'Organization',
            name: e.company,
            ...(e.website ? { url: e.website } : {}),
          })),
        hasOccupation: profile.experiences.map((e) => ({
          '@type': 'Role',
          roleName: e.role,
          startDate: e.startDate,
          ...(e.endDate ? { endDate: e.endDate } : {}),
          worksFor: { '@type': 'Organization', name: e.company },
        })),
        contactPoint: profile.contact.preferredChannels.map((c) => ({
          '@type': 'ContactPoint',
          contactType: c.label,
          url: c.url,
          availableLanguage: ['ja'],
        })),
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: `${profile.name} Portfolio`,
        description: profile.description,
        publisher: { '@id': `${baseUrl}/#person` },
        inLanguage: 'ja-JP',
      },
      {
        '@type': 'ProfilePage',
        '@id': `${url}#webpage`,
        url,
        name: title,
        description,
        isPartOf: { '@id': `${baseUrl}/#website` },
        mainEntity: { '@id': `${baseUrl}/#person` },
        about: { '@id': `${baseUrl}/#person` },
        primaryImageOfPage: { '@type': 'ImageObject', url: image },
      },
      // 執筆記事
      {
        '@type': 'ItemList',
        '@id': `${baseUrl}/#writings`,
        name: 'Writings',
        numberOfItems: writings.length,
        itemListElement: writings.map((w, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Article',
            headline: w.title,
            url: w.link,
            datePublished: toIsoDate(w.date),
            author: { '@id': `${baseUrl}/#person` },
            publisher: { '@type': 'Organization', name: w.source },
            ...(w.imageUrl ? { image: w.imageUrl } : {}),
          },
        })),
      },
      // 登壇
      {
        '@type': 'ItemList',
        '@id': `${baseUrl}/#speakings`,
        name: 'Speaking',
        numberOfItems: speakings.length,
        itemListElement: speakings.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Event',
            name: s.title,
            startDate: toIsoDate(s.date),
            eventStatus: 'https://schema.org/EventScheduled',
            organizer: { '@type': 'Organization', name: s.event },
            performer: { '@id': `${baseUrl}/#person` },
            ...(s.mainLink && s.mainLink !== '#' ? { url: s.mainLink } : {}),
            ...(s.imageUrl ? { image: s.imageUrl } : {}),
          },
        })),
      },
      // 取材記事（本人が対象）
      {
        '@type': 'ItemList',
        '@id': `${baseUrl}/#interviews`,
        name: 'Interviews',
        numberOfItems: interviews.length,
        itemListElement: interviews.map((n, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Article',
            headline: n.title,
            url: n.link,
            datePublished: toIsoDate(n.date),
            about: { '@id': `${baseUrl}/#person` },
            publisher: { '@type': 'Organization', name: n.media },
            ...(n.imageUrl ? { image: n.imageUrl } : {}),
          },
        })),
      },
      // 提供サービス
      ...profile.services.map((s, i) => ({
        '@type': 'Service',
        '@id': `${baseUrl}/#service-${i + 1}`,
        name: s.name,
        description: s.detail,
        serviceType: 'Product Management Advisory',
        provider: { '@id': `${baseUrl}/#person` },
        areaServed: { '@type': 'Country', name: 'Japan' },
        ...('price' in s && s.price
          ? {
              offers: {
                '@type': 'Offer',
                price: s.price.amount,
                priceCurrency: s.price.currency,
                description: `${s.price.unit}あたりの目安金額`,
                availability: 'https://schema.org/InStock',
              },
            }
          : {}),
      })),
    ],
  };

  // --- meta タグ ---------------------------------------------------
  // 静的な既定値は index.html に持たせてある。ここではクライアント側で
  // タイトル等が動的に変わる場合にのみ追随させる
  useEffect(() => {
    const setMetaTag = (name: string, content: string, attribute: string = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    document.title = title;

    setMetaTag('description', description);
    setMetaTag('author', profile.name);

    setMetaTag('og:title', title, 'property');
    setMetaTag('og:description', description, 'property');
    setMetaTag('og:image', image, 'property');
    setMetaTag('og:url', url, 'property');
    setMetaTag('og:type', type, 'property');

    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image);
  }, [title, description, image, type, url]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
    />
  );
}
