import Footer from '@components/Footer/Footer';
import Header from '@components/Header/Header';
import localFont from 'next/font/local';
import Head from 'next/head';
import Script from 'next/script';
import type { ReactNode } from 'react';
import Termly from '@/components/Legal/Termly';

interface Props {
	children: ReactNode;
}

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

export default function LegalLayout({ children }: Props) {
	// Page Metadata
	const title = 'Meddly | Legal';
	const description =
		'Meddly helps artists and event organizers capture, package, and release complete recordings of every event.';
	const ogImg = '/image/og-img.png';

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
				<meta name="robots" content="noindex" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<body className={`${redhat.variable} ${logo.variable} font-sans`}>
				<Header />
				{children}
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
