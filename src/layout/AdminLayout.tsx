'use client';

import CloseIcon from '@icons/CloseIcon';
import MobileMenuWhite from '@icons/MobileMenuWhite';
import { getCookieValue } from '@/storage/cookies';
import localFont from 'next/font/local';
import Script from 'next/script';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import Termly from '@/components/Legal/Termly';
import AdminSidebar from '../components/Sidebar/AdminSidebar';
import Snackbar from '@/components/Notifications/Snackbar';
import type { UserRole } from '@/interfaces/UserRoles';

interface Props {
	children: ReactNode;
}

// Custom Fonts

const redhat = localFont({
	variable: '--font-redhat',
	src: [
		{ path: '../../public/fonts/RedHatText-Regular.ttf', weight: '400' },
		{ path: '../../public/fonts/RedHatText-Medium.ttf', weight: '500' },
		{ path: '../../public/fonts/RedHatText-Bold.ttf', weight: '700' },
	],
});

const logo = localFont({
	variable: '--font-logo',
	src: [{ path: '../../public/fonts/Rounded_Elegance.ttf' }],
});

export default function AdminLayout({ children }: Props) {
	// Page Metadata
	const title = 'Meddly | Admin';
	const description =
		'Meddly helps artists and event organizers capture, package, and release complete recordings of every event.';
	const ogImg = '/image/og-img.png';

	const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
	const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
	const wrapperRef = useRef<any>(null);

	useEffect(() => {
		const roleCookie = getCookieValue('currentRole');
		const role = roleCookie ? JSON.parse(roleCookie) : null;
		if (!role) setShowMobileMenu(true);
	}, []);

	const useDetectOutsideClick = (ref: any) => {
		useEffect(() => {
			const handleClickOutside = (e: Event) => {
				if (ref.current && !ref.current.contains(e.target)) {
					setShowMobileMenu(false);
				}
			};
			document.addEventListener('mousedown', handleClickOutside);
			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
			};
		}, [ref]);
	};

	// Listener for currentRole cookie changes
	useEffect(() => {
		const handleRoleChange = () => {
			const roleCookie = getCookieValue('currentRole');
			const role = roleCookie ? JSON.parse(roleCookie) : null;
			setCurrentRole(role);
		};

		// Check immediately on mount
		handleRoleChange();
		// Listen for custom cookie change events
		window.addEventListener('currentRoleCookieChange', handleRoleChange);
		return () => {
			window.removeEventListener('currentRoleCookieChange', handleRoleChange);
		};
	}, []);

	useDetectOutsideClick(wrapperRef);

	return (
		<div id="admin-layout" className={`base ${redhat.variable} ${logo.variable} font-sans`}>
			<div className="desktop-menu">
				<AdminSidebar />
			</div>

			<div className="mobile-menu" ref={wrapperRef}>
				<div
					className="mobile-menu-icon"
					onClick={() => setShowMobileMenu(!showMobileMenu)}
					onKeyDown={() => setShowMobileMenu(!showMobileMenu)}
				>
					{showMobileMenu ? (
						<CloseIcon className="mobile-menu-icon" />
					) : (
						<MobileMenuWhite className="mobile-menu-icon" />
					)}
				</div>
				{showMobileMenu ? <AdminSidebar /> : null}
			</div>

			{currentRole ? (
				<div className="admin-layout-container">{children}</div>
			) : (
				<div className="admin-layout-container" />
			)}

			<Script src="https://www.googletagmanager.com/gtag/js?id=G-26GXSSEKE9" />
			<Script id="google-analytics">
				{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-26GXSSEKE9');
        `}
			</Script>

			<Snackbar />

			<Termly />
		</div>
	);
}
