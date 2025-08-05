import type { UserRole } from '@/interfaces/UserRoles';
import { getCookie } from 'cookies-next';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
	const year = new Date().getFullYear();

	const roleCookie = getCookie('role');
	const role: UserRole = roleCookie ? JSON.parse(roleCookie) : null;

	return (
		<footer>
			<div id="footer-main">
				<div className="container row">
					<div id="footer-logo" className="flex1 column">
						<Link href="/">
							<Image src="/svg/logo/meddly/full.svg" height={75} width={270} priority alt="logo" />
						</Link>
					</div>

					<div className="flex1 column">
						<span className="footer-title">Legal</span>
						<ul>
							<li>
								<Link href="/terms-and-conditions">Terms and Conditions</Link>
							</li>

							<li>
								<Link href="/privacy-policy">Privacy Policy</Link>
							</li>

							<li>
								<Link href="/cookies">Cookies</Link>
							</li>

							{/* NEEDED FOR UPDATING COOKIE PREFERENCES */}
							<li>
								<Link href="#" className="termly-display-preferences">
									Consent Preferences
								</Link>
							</li>
						</ul>
					</div>

					<div className="flex1 column">
						<span className="footer-title">Company</span>
						<ul>
							{/*<li>
                <Link href="/about">About</Link>
              </li>*/}

							<li>
								<Link href="/careers">Careers</Link>
							</li>

							<li>
								<Link href="/contact">Contact</Link>
							</li>

							<li>
								<Link href="/faq">FAQ</Link>
							</li>
						</ul>
					</div>

					<div className="flex1 column">
						<span className="footer-title">Account & Help</span>
						<ul>
							{/* {role ? (
								<li>
									<Link href="/admin">My Account</Link>
								</li>
							) : (
								<li>
									<Link href="/auth/login">Login</Link>
								</li>
							)} */}

							{/*
              <li>
                <Link href="/auth/register">Sign Up</Link>
              </li>
              */}

							<li>
								<Link href="/docs">Documentation</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<div id="footer-bottom">
				<div className="container row txt-center justify-center">
					<div id="footer-copyright" className="flex1 column txt-center px-15">
						© {year} Meddly, All rights reserved.
					</div>
				</div>
			</div>
		</footer>
	);
}
