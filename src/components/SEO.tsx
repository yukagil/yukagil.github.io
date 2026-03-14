import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  path?: string;
}

const baseUrl = 'https://yukagil.github.io';
const defaultImage = 'https://storage.googleapis.com/studio-cms-assets/projects/Z9qp7nJGOP/s-1120x1120_v-fs_webp_2a3f9622-e54d-4f8b-8670-510ba156906d_small.webp';
const defaultTitle = 'Yuta Kanehara | Product Manager';
const defaultDescription = 'プロダクトマネジメントを軸に、戦略から実装までをアラインメントすることで、チームと共に価値あるプロダクトを届けます。10年以上のプロダクトづくりの経験をベースに、人・組織・事業・経営それぞれのレイヤーにおける、理論と実践の両方に基づいた再現性のある現実的なアプローチを大切にしています。';

export default function SEO({ 
  title = defaultTitle,
  description = defaultDescription,
  image = defaultImage,
  type = 'website',
  path = ''
}: SEOProps) {
  const location = useLocation();
  const url = `${baseUrl}${path || location.pathname}`;

  useEffect(() => {
    // 基本メタタグ
    const setMetaTag = (name: string, content: string, attribute: string = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // タイトル
    document.title = title;

    // 基本メタタグ
    setMetaTag('description', description);
    setMetaTag('author', 'Yuta Kanehara');
    setMetaTag('keywords', 'Product Manager, プロダクトマネージャー, UX Strategy, Org Design, Product Management, 組織デザイン');

    // OGP メタタグ
    setMetaTag('og:title', title, 'property');
    setMetaTag('og:description', description, 'property');
    setMetaTag('og:image', image, 'property');
    setMetaTag('og:url', url, 'property');
    setMetaTag('og:type', type, 'property');
    setMetaTag('og:site_name', 'Yuta Kanehara Portfolio', 'property');
    setMetaTag('og:locale', 'ja_JP', 'property');

    // Twitter Card
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image);
    setMetaTag('twitter:creator', '@yukagil');
    setMetaTag('twitter:site', '@yukagil');

    // 構造化データ (JSON-LD)
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          '@id': `${baseUrl}/#person`,
          name: 'Yuta Kanehara',
          jobTitle: 'Product Manager',
          description: description,
          image: image,
          url: baseUrl,
          sameAs: [
            'https://twitter.com/yukagil',
            'https://www.linkedin.com/in/yuta-kanehara/',
            'https://www.facebook.com/yuta.kanehara'
          ],
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Tokyo',
            addressCountry: 'JP'
          },
          knowsAbout: [
            'Product Management',
            'UX Strategy',
            'Organization Design',
            'Engineering',
            'プロダクトマネジメント',
            '組織デザイン'
          ],
          alumniOf: [
            {
              '@type': 'Organization',
              name: 'DeNA'
            }
          ],
          worksFor: [
            {
              '@type': 'Organization',
              name: 'Muture',
              url: 'https://muture.jp/'
            },
            {
              '@type': 'Organization',
              name: 'marui unite',
              url: 'https://marui-unite.co.jp/'
            }
          ]
        },
        {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          url: baseUrl,
          name: 'Yuta Kanehara Portfolio',
          description: description,
          publisher: {
            '@id': `${baseUrl}/#person`
          },
          inLanguage: 'ja-JP'
        },
        {
          '@type': 'WebPage',
          '@id': `${url}#webpage`,
          url: url,
          name: title,
          description: description,
          isPartOf: {
            '@id': `${baseUrl}/#website`
          },
          about: {
            '@id': `${baseUrl}/#person`
          },
          primaryImageOfPage: {
            '@type': 'ImageObject',
            url: image
          }
        }
      ]
    };

    // 既存のJSON-LDスクリプトを削除
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // 新しいJSON-LDスクリプトを追加
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // クリーンアップ関数
    return () => {
      const scriptToRemove = document.querySelector('script[type="application/ld+json"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, image, type, url]);

  return null;
}

