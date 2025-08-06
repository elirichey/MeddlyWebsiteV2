import AccountIcon from '@icons/AccountIcon';
import Image from 'next/image';
import Link from 'next/link';
import type { FullUser } from '@/interfaces/User';
import type { UserRole } from '@/interfaces/UserRoles';
import { getCookieValue } from '@/storage/cookies';

interface Props {
	user: FullUser | null;
}

export default function DesktopMainMenu(props: Props) {
	const { user } = props;

	const roleCookie = getCookieValue('role');
	const role: UserRole = roleCookie ? JSON.parse(roleCookie) : null;

	const currentRoleImage = role?.organization?.avatar || '/image/webp/placeholders/avatar.webp';

	return (
		<div id="desktop-main-menu" className="flex">
			<ul className="flex row">
				<li className="desktop-main-menu-link">
					<Link href="/">Home</Link>
				</li>

				{/*
        <li className="desktop-main-menu-link">
          <Link href="/about">About</Link>
        </li>
        */}

				<li className="desktop-main-menu-link">
					<Link href="/careers">Careers</Link>
				</li>

				<li className="desktop-main-menu-link">
					<Link href="/contact">Contact</Link>
				</li>

				{user ? (
					<li className="desktop-main-menu-account-link">
						<Link href={user ? '/admin' : '/auth/login'}>
							{role ? (
								<Image src={currentRoleImage} alt="current-user-avatar" width={50} height={50} className="avatar" />
							) : (
								<>
									<AccountIcon className="menu-account-icon" />
									<span>Account</span>
								</>
							)}
						</Link>
					</li>
				) : (
					<></>
				)}
			</ul>
		</div>
	);
}
