import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.meddly.app',
			},
			{
				protocol: 'https',
				hostname: 'dat0tj3w68a4d.cloudfront.net',
			},
			{
				protocol: 'https',
				hostname: 'meddly.b-cdn.net',
			},
		],
	},
	i18n: {
		locales: ['en'],
		defaultLocale: 'en',
	},
	async redirects() {
		return [
			{
				source: '/docs/onboarding',
				destination: '/docs',
				permanent: true,
			},
			{
				source: '/docs/devices',
				destination: '/docs',
				permanent: true,
			},
		];
	},
};

export default nextConfig;
