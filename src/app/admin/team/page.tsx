import type { Metadata } from 'next';
import AdminLayout from '@layout/AdminLayout';
import '@styles/globals.sass';
import MenuBar from '@/components/MenuBar/MenuBar';

export const metadata: Metadata = {
	title: 'Meddly | Team',
	description:
		'Meddly helps artists and event organizers capture, package, and release complete recordings of every event.',
	robots: 'noindex',
};

export default function Team() {
	return (
		<AdminLayout>
			<MenuBar>
				<span className="txt-white">Team</span>
			</MenuBar>

			<div id="admin-team" className="admin-container">
				<h1>Team</h1>
			</div>
		</AdminLayout>
	);
}
