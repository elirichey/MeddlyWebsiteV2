import Footer from '@components/Footer/Footer';
import Header from '@components/Header/Header';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Head from 'next/head';
import Script from 'next/script';
import type { ReactNode } from 'react';
import Termly from '@/components/Legal/Termly';
import Snackbar from '@/components/Notifications/Snackbar';

interface Props {
	children: ReactNode;
}

// Page Metadata
const title = 'Meddly | Record Every Event | Crowdsourced Event Videos | Auto-Generated Video Productions';
const description =
	'Meddly helps artists, event organizers, and creators capture, package, and release complete recordings of every event.';
const ogImg = '/image/og-img.png';

// Custom Fonts

const redhat = localFont({
	variable: '--font-redhat',
	src: [
		{ path: '../../public/fonts/RedHatText-Regular.ttf', weight: '400' },
		{ path: '../../public/fonts/RedHatText-Medium.ttf', weight: '500' },
		{ path: '../../public/fonts/RedHatText-Bold.ttf', weight: '700' },
	],
});

const logo = localFont({
	variable: '--font-logo',
	src: [{ path: '../../public/fonts/Rounded_Elegance.ttf' }],
});

// Setup Page

export const metadata: Metadata = {
	title,
	description,
	openGraph: {
		title,
		description,
		images: [ogImg],
	},
	twitter: {
		card: 'summary_large_image',
		site: '@meddlyapp',
		creator: '@meddlyapp',
		title,
		description,
		images: [ogImg],
	},
	robots: {
		index: false,
		follow: false,
	},
	icons: {
		icon: '/favicon.ico',
	},
	viewport: {
		width: 'device-width',
		initialScale: 1,
		maximumScale: 1,
	},
	themeColor: '#000000',
	applicationName: 'Meddly',
};

export default function PrimaryLayout({ children }: Props) {
	return (
		<html lang="en">
			<Head>
				<title>{title}</title>
				<meta name="description" content={description} />
				<meta property="og:title" content={title} />
				<meta property="og:description" content={description} />
				<meta property="og:image" content={ogImg} />

				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@meddlyapp" />
				<meta name="twitter:creator" content="@meddlyapp" />
				<meta name="twitter:title" content={title} />
				<meta name="twitter:description" content={description} />
				<meta name="twitter:image" content={ogImg} />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<body className={`${redhat.variable} ${logo.variable} font-sans`}>
				<Header />
				{children}

				<Snackbar />

				<Footer />

				<Script src="https://www.googletagmanager.com/gtag/js?id=G-26GXSSEKE9" />
				<Script id="google-analytics">
					{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-26GXSSEKE9');
        `}
				</Script>

				<Termly />
			</body>
		</html>
	);
}
