// import type { Metadata } from 'next';
import '@styles/globals.sass';

// export const metadata: Metadata = {
// 	title: 'Meddly',
// 	description: 'Meddly helps artists and event organizers capture, package, and release complete recordings of every event.',
// };

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
