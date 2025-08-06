import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { FullUser } from '@/interfaces/User';

interface Props {
	user: FullUser | null;
}

export default function MobileMainMenu(props: Props) {
	const { user } = props;

	//const roleCookie = getCookie("role");
	//const role: UserRole = roleCookie ? JSON.parse(roleCookie) : null;

	//const currentRoleImage =
	//  role?.organization?.avatar || "/image/webp/placeholders/avatar.webp";

	// Click detection
	const clickRef = useRef<any>(null);

	useEffect(() => {
		const handleClickOutside = (e: any) => {
			const { current } = clickRef;
			if (current && !current.contains(e.target)) setShowMenu(false);
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const [showMenu, setShowMenu] = useState<boolean>(false);

	return (
		<div ref={clickRef} id="mobile-main-menu" className="flex">
			<span
				className="mobile-menu-indicator"
				onClick={() => setShowMenu(!showMenu)}
				onKeyDown={() => setShowMenu(!showMenu)}
			>
				{showMenu ? (
					<Image src="/svg/close.svg" className="close" height={44} width={44} alt="menu-close" />
				) : (
					<Image src="/svg/mobile-menu.svg" className="open" height={44} width={44} alt="menu-open" />
				)}
			</span>

			{showMenu ? (
				<div id="mobile-menu-dropdown">
					<ul className="mobile-menu-dropdown-container">
						<li onClick={() => setShowMenu(false)} onKeyDown={() => setShowMenu(false)}>
							<Link href="/" className="mobile-menu-primary">
								Home
							</Link>
						</li>

						{/*
            <li onClick={() => setShowMenu(false)}>
              <Link href="/about" className="mobile-menu-primary">
                About
              </Link>
            </li>
            */}

						<li onClick={() => setShowMenu(false)} onKeyDown={() => setShowMenu(false)}>
							<Link href="/careers" className="mobile-menu-primary">
								Careers
							</Link>
						</li>

						<li onClick={() => setShowMenu(false)} onKeyDown={() => setShowMenu(false)}>
							<Link href="/contact" className="mobile-menu-primary">
								Contact
							</Link>
						</li>

						{user ? (
							<li onClick={() => setShowMenu(false)} onKeyDown={() => setShowMenu(false)}>
								<Link href="/admin" className="mobile-menu-primary">
									Account
								</Link>
							</li>
						) : (
							<></>
						)}

						{/* <li onClick={() => setShowMenu(false)} onKeyDown={() => setShowMenu(false)}>
              <Link href="/auth/login" className="mobile-menu-primary">
                Login
              </Link>
            </li> */}

						{/* <li onClick={() => setShowMenu(false)} onKeyDown={() => setShowMenu(false)}>
              <Link href="/auth/register" className="mobile-menu-primary">
                Sign Up
              </Link>
            </li> */}
					</ul>
				</div>
			) : null}
		</div>
	);
}
