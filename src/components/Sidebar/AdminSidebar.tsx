import type { FullUser } from '@/interfaces/User';
import type { UserRole } from '@/interfaces/UserRoles';
import CalendarOutline from '@icons/CalendarOutline';
import ChevronDown from '@icons/ChevronDown';
import ChevronUp from '@icons/ChevronUp';
import DocumentsOutline from '@icons/DocumentsOutline';
import HomeOutline from '@icons/HomeOutline';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export default function AdminSidebar() {
	const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
	const [currentUser, setCurrentUser] = useState<FullUser | null>(null);
	const [hasRoles, setHasRoles] = useState<boolean>(false);
	const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

	const router = useRouter();
	const isOverivew: boolean = router.pathname === '/admin';
	const isEvent: boolean = router.pathname.includes('event');
	const isRoles: boolean = router.pathname.includes('role');
	const isSupport: boolean = router.pathname.includes('support');
	const isDocs: boolean = router.pathname.includes('docs');

	useEffect(() => {
		checkForRoles();
	}, []);

	const roleCookie = getCookie('role');
	const currentRole = roleCookie ? JSON.parse(roleCookie) : null;

	const logout = () => {
		const userCookie = getCookie('user');
		const accessToken = getCookie('accessToken');
		const refreshToken = getCookie('refreshToken');
		const user = userCookie ? JSON.parse(userCookie) : null;
		const role = roleCookie ? JSON.parse(roleCookie) : null;

		user ? deleteCookie('user') : null;
		accessToken ? deleteCookie('accessToken') : null;
		refreshToken ? deleteCookie('refreshToken') : null;
		role ? deleteCookie('role') : null;
		return router.push('/');
	};

	const checkForRoles = () => {
		// Logout user, invalidate current token...
		const userCookie = getCookie('user');
		const user = userCookie ? JSON.parse(userCookie) : null;
		const role = roleCookie ? JSON.parse(roleCookie) : null;

		const userHasRoles = user?.userRoles && user.userRoles.length > 0;
		if (!userHasRoles) {
			return logout();
		}
		setCurrentUser(user);
		setHasRoles(true);
		currentRole ? setSelectedRole(role) : null;
		role ? setCookie('role', role) : null;
	};

	// When role updates, route to overview
	const usePrevious = (value: any) => {
		const ref = useRef();
		useEffect(() => {
			ref.current = value;
		});
		return ref.current;
	};
	const prevRole: any = usePrevious({ selectedRole });
	useEffect(() => {
		if (prevRole?.selectedRole) router.push('/admin');
		if (selectedRole && showUserMenu) setShowUserMenu(false);
	}, [selectedRole]);

	// When url updates, hide showUserMenu...
	useEffect(() => {
		if (selectedRole && showUserMenu) {
			setShowUserMenu(false);
		}
	}, [router.asPath, selectedRole, showUserMenu]);

	const currentRoleImage = selectedRole?.organization?.avatar || '/image/webp/placeholders/avatar.webp';

	const userRoles = currentUser?.userRoles || [];

	return (
		<div id="admin-sidebar">
			<div className="side-bar-logo-container">
				<Link href="/">
					<Image src="/svg/logo/meddly/full.svg" height={87} width={230} alt="logo" priority />
				</Link>
			</div>

			<ul id="sidebar-menu">
				{!showUserMenu && selectedRole ? (
					<>
						<li>
							<Link href="/admin" className={isOverivew ? 'active' : undefined}>
								<HomeOutline className="sidebar-menu-icon no-fill" />
								<span>Overview</span>
							</Link>
						</li>

						<li>
							<Link href="/admin/events" className={isEvent ? 'active' : undefined}>
								<CalendarOutline className="sidebar-menu-icon" />
								<span>Events</span>
							</Link>
						</li>

						{/*
            <li>
              <Link href="/admin/roles" className={isRoles ? "active" : null}>
                <PeopleCircleOutline
                  height={32}
                  width={32}
                  className="sidebar-menu-icon"
                />
                <span>Roles</span>
              </Link>
            </li>

            <li>
              <Link
                href="/admin/support"
                className={isSupport ? "active" : null}
              >
                <SupportIcon
                  height={32}
                  width={32}
                  className="sidebar-menu-icon no-fill"
                />
                <span>Support</span>
              </Link>
            </li>
            */}

						<li>
							<Link href="/docs" className={isDocs ? 'active' : undefined}>
								<DocumentsOutline className="sidebar-menu-icon no-fill" />
								<span>Docs</span>
							</Link>
						</li>
					</>
				) : null}
			</ul>

			<div className="logout-container">
				<div
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							setShowUserMenu(!showUserMenu);
						}
					}}
					className={!selectedRole ? 'admin-switch-role no-role-selected' : 'admin-switch-role'}
					onClick={() => setShowUserMenu(!showUserMenu)}
				>
					{selectedRole ? (
						<div className="avatar">
							<Image src={currentRoleImage} height={50} width={50} alt="org-avatar" />
						</div>
					) : null}

					<div className="flex1 column">
						{selectedRole ? (
							<>
								<span className="user-name">{selectedRole.organization.name}</span>
								<span className="user-role">{selectedRole.role}</span>
							</>
						) : (
							<span className="user-name select-user txt-white">Select Role From Above</span>
						)}
					</div>
					<div className="dropdown-indicator">
						{showUserMenu || !selectedRole ? (
							<ChevronDown className="menu-chevron" />
						) : (
							<ChevronUp className="menu-chevron" />
						)}
					</div>

					{showUserMenu || !selectedRole ? (
						<div className="admin-switch-role-menu">
							<ul id="role-selections">
								{hasRoles && currentUser && currentUser?.userRoles
									? userRoles.map((item: UserRole, i: number) => {
											const image = item?.organization?.avatar || '/image/webp/placeholders/avatar.webp';
											return (
												<li
													onClick={() => {
														setShowUserMenu(false);
														setSelectedRole(item);
														setCookie('role', item);
													}}
													onKeyDown={(e) => {
														if (e.key === 'Enter' || e.key === ' ') {
															setShowUserMenu(false);
															setSelectedRole(item);
															setCookie('role', item);
														}
													}}
													key={item.id}
												>
													<div className="role-card">
														<div className="avatar">
															<Image src={image} height={50} width={50} alt="org-avatar" />
														</div>

														<div className="flex1 column">
															<span className="user-name">{item.organization.name}</span>
															<span className="user-role">{item.role}</span>
														</div>
													</div>
												</li>
											);
										})
									: null}
							</ul>
						</div>
					) : null}
				</div>

				<div className="row mt-15">
					<div
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								logout();
							}
						}}
						className="login-btn"
						onClick={logout}
					>
						Logout
					</div>
				</div>
			</div>
		</div>
	);
}
