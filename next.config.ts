import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	images: {
		domains: [
			"cdn.meddly.app",
			"dat0tj3w68a4d.cloudfront.net",
			"meddly.b-cdn.net",
		],
	},
	i18n: {
		locales: ["en"],
		defaultLocale: "en",
	},
	async redirects() {
		return [
			{
				source: "/docs/onboarding",
				destination: "/docs",
				permanent: true,
			},
			{
				source: "/docs/devices",
				destination: "/docs",
				permanent: true,
			},
		];
	},
};

export default nextConfig;
