import type { Metadata } from 'next';
import AdminLayout from '@layout/AdminLayout';
import '@styles/globals.sass';

export const metadata: Metadata = {
	title: 'Meddly | Admin Settings',
	description:
		'Meddly helps artists and event organizers capture, package, and release complete recordings of every event.',
	robots: 'noindex',
};

export default function Settings() {
	return (
		<AdminLayout>
			<main id="admin" className="admin-roles">
				<div className="container">
					<h1>Admin Settings</h1>
					<div className="flex1 row w100">
						<div className="flex1 column">
							<h2>Settings</h2>
						</div>
					</div>
				</div>
			</main>
		</AdminLayout>
	);
}
