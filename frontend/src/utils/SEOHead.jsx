import { Head } from '@unhead/react'

const SEOHead = ({ title, description, url = '', image }) => {
  const siteName = 'Cashablanca'
  const defaultTitle = 'Cashablanca – Your AI-Powered Money Buddy'
  const defaultDescription =
    'Control your spending, grow your savings, and get personalized financial insights – all in one smart app.'
  const defaultImage = 'https://yourdomain.com/og-image.png' // Replace with your actual image

  const fullUrl = url
    ? `${import.meta.env.VITE_FRONTEND_URL.replace(/\/$/, '')}/${url}`
    : import.meta.env.VITE_FRONTEND_URL

  return (
    <Head>
      {/* Basic Tags */}
      <title>{title || defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="UTF-8" />

      {/* Canonical URL */}
      {url && <link rel="canonical" href={fullUrl} />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title || defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={image || defaultImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || defaultTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />
      <meta name="twitter:site" content="@cashablanca" />
    </Head>
  )
}

export default SEOHead