import type { Metadata } from 'next';
import AdminLayout from '@layout/AdminLayout';
import MenuBar from '@/components/MenuBar/MenuBar';
import '@styles/globals.sass';

export const metadata: Metadata = {
	title: 'Meddly | Admin',
	description:
		'Meddly helps artists and event organizers capture, package, and release complete recordings of every event.',
	robots: 'noindex',
};

export default function Admin() {
	return (
		<AdminLayout>
			<MenuBar>
				<span className="txt-white">Admin Overview</span>
			</MenuBar>

			<div id="admin-overview" className="admin-container">
				<h1>Admin Overview</h1>
			</div>
		</AdminLayout>
	);
}
