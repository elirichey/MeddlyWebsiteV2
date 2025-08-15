import type { Metadata } from 'next';
import AdminLayout from '@layout/AdminLayout';
import '@styles/globals.sass';
import MenuBar from '@/components/MenuBar/MenuBar';

export const metadata: Metadata = {
	title: 'Meddly | Admin Settings',
	description:
		'Meddly helps artists and event organizers capture, package, and release complete recordings of every event.',
	robots: 'noindex',
};

export default function Settings() {
	return (
		<AdminLayout>
			<MenuBar>
				<span className="txt-white">Settings</span>
			</MenuBar>

			<div id="admin-settings" className="admin-container">
				<h1>Settings</h1>
				<ul>
					<li>Avatar</li>
					<li>Name</li>
					<li>Website</li>
					<li>Open Support Ticket</li>
				</ul>
			</div>
		</AdminLayout>
	);
}
