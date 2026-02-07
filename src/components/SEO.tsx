import { Metadata } from 'next'

interface SEOProps {
    title?: string
    description?: string
    image?: string
    url?: string
}

export function generateMetadata({
    title = 'ViralKlip - AI-Powered Viral Clip Generator',
    description = 'Transform long videos into viral clips in minutes. AI-powered transcription, viral moment detection, and multi-format export for TikTok, Reels, and YouTube Shorts.',
    image = '/og-image.png',
    url = 'https://viralklip.com',
}: SEOProps = {}): Metadata {
    return {
        title,
        description,
        keywords: [
            'viral clips',
            'video editing',
            'AI video',
            'TikTok clips',
            'Instagram Reels',
            'YouTube Shorts',
            'video transcription',
            'viral moments',
            'content creation',
            'social media marketing',
        ],
        authors: [{ name: 'ViralKlip' }],
        creator: 'ViralKlip',
        publisher: 'ViralKlip',
        openGraph: {
            type: 'website',
            locale: 'id_ID',
            url,
            title,
            description,
            siteName: 'ViralKlip',
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
            creator: '@viralklip',
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        icons: {
            icon: '/favicon.ico',
            shortcut: '/favicon-16x16.png',
            apple: '/apple-touch-icon.png',
        },
        manifest: '/site.webmanifest',
    }
}
