'use client';

declare const window: any;

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

interface Props {
	autoBlock?: any;
	masterConsentsOrigin?: any;
}

const websiteUUID = 'b15b0cf5-fcdd-4687-b7dc-0260e7ceb8ef';
const SCRIPT_SRC_BASE = 'https://app.termly.io';

export default function Termly(props: Props) {
	const { autoBlock, masterConsentsOrigin } = props;

	const scriptSrc = useMemo(() => {
		const src = new URL(SCRIPT_SRC_BASE);
		src.pathname = `/resource-blocker/${websiteUUID}`;
		if (autoBlock) {
			src.searchParams.set('autoBlock', 'on');
		}
		if (masterConsentsOrigin) {
			src.searchParams.set('masterConsentsOrigin', masterConsentsOrigin);
		}
		return src.toString();
	}, [autoBlock, masterConsentsOrigin]);

	useEffect(() => {
		// Check if the Termly script is already present in the document
		const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);

		if (existingScript) {
			return;
		}

		const script = document.createElement('script');
		script.src = scriptSrc;
		script.async = true;
		script.setAttribute('data-termly', 'true');
		document.head.appendChild(script);
	}, [scriptSrc]);

	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		if (typeof window.Termly?.initialize === 'function') {
			window.Termly.initialize();
		}
	}, [pathname, searchParams]);

	return null;
}
