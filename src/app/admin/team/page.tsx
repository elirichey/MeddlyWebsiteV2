'use client';

// import type { Metadata } from 'next';
import AdminLayout from '@layout/AdminLayout';
import '@styles/globals.sass';
import MenuBar from '@/components/MenuBar/MenuBar';
import AddIcon from '@/components/Icons/AddIcon';
import { useRouter } from 'next/navigation';

// export const metadata: Metadata = {
// 	title: 'Meddly | Team',
// 	description:
// 		'Meddly helps artists and event organizers capture, package, and release complete recordings of every event.',
// 	robots: 'noindex',
// };

export default function Team() {
	const router = useRouter();

	return (
		<AdminLayout>
			<MenuBar>
				<>
					<div className="flex" />
					<div className="menu-bar-add-item">
						<button type="button" onClick={() => router.push('/admin/event/new')}>
							<AddIcon className="add-icon" />
							<span>Create</span>
						</button>
					</div>
				</>
			</MenuBar>

			<div id="admin-team" className="admin-container">
				<h1>Team</h1>

				<ul>
					<li>List Team Members</li>
					<li>Create Team Member</li>
					<li>View / Edit / Delete Team Member</li>
				</ul>
			</div>
		</AdminLayout>
	);
}
