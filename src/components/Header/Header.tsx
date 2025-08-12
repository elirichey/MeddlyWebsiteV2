'use client';

import type { User } from '@interfaces/User';
import { getCookie } from 'cookies-next';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import DesktopMainMenu from './components/DesktopMainMenu';
import HeaderLogo from './components/HeaderLogo';
import MobileMainMenu from './components/MobileMainMenu';

export default function Header() {
	const [currentUser, setCurrentUser] = useState<User | null>(null);

	const setUser = () => {
		const userCookie: any = getCookie('user');
		const user = userCookie ? JSON.parse(userCookie) : null;
		setCurrentUser(user ? user : null);
	};

	// // Run on every update
	// useEffect(() => {
	// 	setUser();
	// }, []);

	// // When nav updates, check again
	// useEffect(() => {
	// 	setUser();
	// }, [router]);

	// Trigger White Background on Scroll...
	const [scrollPosition, setScrollPosition] = useState(0);
	useEffect(() => {
		const handleScroll = () => setScrollPosition(window.scrollY);
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const currentRoute = usePathname();
	const isHome = currentRoute === '/' || currentRoute === '/artists';

	const triggerWhiteBg = scrollPosition < 90 && isHome;
	const sectionStyles = triggerWhiteBg ? 'flex1 column no-border' : 'flex1 column';

	const isTransparent = triggerWhiteBg ? 'transparent' : '';

	return (
		<section id="header" className={sectionStyles}>
			<div id="header-body" className={isTransparent}>
				<div className="container row">
					<HeaderLogo />
					<DesktopMainMenu user={currentUser} />
					<MobileMainMenu user={currentUser} />
				</div>
			</div>

			<div className="toast-container">
				<ToastContainer
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
			</div>
		</section>
	);
}
