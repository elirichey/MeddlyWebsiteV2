'use client';

import LegalLayout from '@layout/LegalLayout';
import { useEffect } from 'react';
import '@styles/globals.sass';

export default function CookiesPolicy() {
	useEffect(() => {
		const script = document.createElement('script');
		script.src = 'https://app.termly.io/embed-policy.min.js';
		script.async = true;
		document.body.appendChild(script);
	}, []);

	const renderLegal = () => {
		return (
			<div className="document-container">
				<div id="overview" className="column flex1">
					<div name="termly-embed" data-id="7de564b0-0556-4f26-8647-8b0efb1042cb" data-type="iframe" />
				</div>
			</div>
		);
	};

	return (
		<LegalLayout>
			<main id="termly-policy">
				<div className="body legal-document">
					<div className="container">{renderLegal()}</div>
				</div>
			</main>
		</LegalLayout>
	);
}
