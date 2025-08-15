import type { Metadata } from 'next';
import AdminLayout from '@layout/AdminLayout';
import MenuBar from '@/components/MenuBar/MenuBar';
import GearFilledIcon from '@/components/Icons/GearFilledIcon';
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
				<div className="admin-overview-container flex1">
					<div className="flex1 column">
						<h1>Overview</h1>
					</div>

					<div className="flex1 column justify-center align-end org-settings-container">
						<div className="flex" />
						<div className="menu-bar-add-item">
							<button type="button" className="org-settings-icon">
								<GearFilledIcon className="gear-icon" />
								<span>Settings</span>
							</button>
						</div>
					</div>
				</div>
			</MenuBar>

			<div id="admin-overview" className="admin-container">
				<h2>Body</h2>
			</div>
		</AdminLayout>
	);
}
