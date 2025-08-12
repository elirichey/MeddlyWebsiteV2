import Image from 'next/image';
import Link from 'next/link';

export default function HeaderLogo() {
	return (
		<div id="header-logo">
			<Link href="/">
				<Image src="/svg/logo/meddly/full.svg" height={87} width={230} alt="logo" priority />
			</Link>
		</div>
	);
}
