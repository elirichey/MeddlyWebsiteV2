'use client';

import CalendarOutline from '@icons/CalendarOutline';
import ChevronDown from '@icons/ChevronDown';
import ChevronUp from '@icons/ChevronUp';
import HomeOutline from '@icons/HomeOutline';
import { setCookie } from 'cookies-next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { UserRole } from '@/interfaces/UserRoles';
import { getCookieValue, removeSecureCookie } from '../../storage/cookies';
import HomeIcon from '../Icons/HomeIcon';
import CalendarIcon from '../Icons/CalendarIcon';
import PeopleFilledIcon from '../Icons/PeopleFilledIcon';
import PeopleIcon from '../Icons/PeopleIcon';
import GearIcon from '../Icons/GearIcon';
import GearFilledIcon from '../Icons/GearFilledIcon';

export default function AdminSidebar() {
	const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
	const [hasRoles, setHasRoles] = useState<boolean>(false);
	const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
	const [userRoles, setUserRoles] = useState<UserRole[]>([]);

	const router = useRouter();
	const pathname = usePathname();
	const isOverivew: boolean = pathname === '/admin';
	const isEvent: boolean = pathname.includes('event');
	const isTeam: boolean = pathname.includes('team');
	const isSettings: boolean = pathname.includes('settings');
	const isSupport: boolean = pathname.includes('support');
	const isDocs: boolean = pathname.includes('docs');

	const logout = useCallback(() => {
		const userCookie = getCookieValue('user');
		const accessToken = getCookieValue('accessToken');
		const refreshToken = getCookieValue('refreshToken');
		const user = userCookie ? JSON.parse(userCookie) : null;
		// const role = roleCookie ? JSON.parse(roleCookie) : null;

		// Remove secure authentication cookies
		accessToken ? removeSecureCookie('accessToken') : null;
		refreshToken ? removeSecureCookie('refreshToken') : null;
		// Remove user data from localStorage
		localStorage.removeItem('user');
		// Remove role cookie
		removeSecureCookie('currentRole');
		return router.push('/');
	}, [router]);

	const checkForRoles = useCallback(() => {
		const userRolesCookie = getCookieValue('roles');
		const userRoles = userRolesCookie ? JSON.parse(userRolesCookie) : [];

		const userHasRoles = userRoles && userRoles.length > 0;
		if (!userHasRoles) {
			return logout();
		}

		setUserRoles(userRoles);
		setHasRoles(true);

		const userRoleCookie = getCookieValue('currentRole');
		const userRole = userRoleCookie ? JSON.parse(userRoleCookie) : null;
		if (userRole) {
			setSelectedRole(userRole);
		}
	}, [logout]);

	useEffect(() => {
		checkForRoles();
	}, [checkForRoles]);

	// When role updates, route to overview
	const usePrevious = (value: any) => {
		const ref = useRef<any>(null);
		useEffect(() => {
			ref.current = value;
		});
		return ref.current;
	};
	const prevRole: any = usePrevious(selectedRole);
	useEffect(() => {
		// Only navigate if role actually changed (previous role exists and is different from current)
		if (prevRole && selectedRole && prevRole.id !== selectedRole.id) {
			router.push('/admin');
		}
	}, [router, prevRole, selectedRole]);

	const currentRoleImage = selectedRole?.organization?.avatar || '/image/webp/placeholders/avatar.webp';

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
								{isOverivew ? (
									<HomeIcon className="sidebar-menu-icon active" />
								) : (
									<HomeOutline className="sidebar-menu-icon no-fill" />
								)}
								<span>Overview</span>
							</Link>
						</li>

						<li>
							<Link href="/admin/events" className={isEvent ? 'active' : undefined}>
								{isEvent ? (
									<CalendarIcon className="sidebar-menu-icon active" />
								) : (
									<CalendarOutline className="sidebar-menu-icon" />
								)}
								<span>Events</span>
							</Link>
						</li>

						<li>
							<Link href="/admin/team" className={isTeam ? 'active' : undefined}>
								{isTeam ? (
									<PeopleIcon className="sidebar-menu-icon active" />
								) : (
									<PeopleFilledIcon className="sidebar-menu-icon" />
								)}
								<span>Team</span>
							</Link>
						</li>

						<li>
							<Link href="/admin/settings" className={isSettings ? 'active' : undefined}>
								{isSettings ? (
									<GearFilledIcon className="sidebar-menu-icon active" />
								) : (
									<GearIcon className="sidebar-menu-icon" />
								)}
								<span>Settings</span>
							</Link>
						</li>

						{/*
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

						<li>
							<Link href="/docs" className={isDocs ? 'active' : undefined}>
								<DocumentsOutline className="sidebar-menu-icon no-fill" />
								<span>Docs</span>
							</Link>
						</li>
						*/}
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
								{hasRoles && userRoles.length > 0
									? userRoles.map((item: UserRole) => {
											const image = item?.organization?.avatar || '/image/webp/placeholders/avatar.webp';
											return (
												<li key={item.id}>
													<button
														type="button"
														className="role-card"
														onClick={() => {
															setSelectedRole(item);
															setCookie('currentRole', item);
														}}
														onKeyDown={(e) => {
															if (e.key === 'Enter' || e.key === ' ') {
																setSelectedRole(item);
																setCookie('currentRole', item);
															}
														}}
													>
														<div className="avatar">
															<Image src={image} height={50} width={50} alt="org-avatar" />
														</div>

														<div className="flex1 column">
															<span className="user-name">{item.organization.name}</span>
															<span className="user-role">{item.role}</span>
														</div>
													</button>
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
