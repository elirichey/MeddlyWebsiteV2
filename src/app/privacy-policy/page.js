'use client';

import LegalLayout from '@layout/LegalLayout';
import { useEffect } from 'react';
import '@styles/globals.sass';

export default function PrivacyPolicy() {
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
					<div name="termly-embed" data-id="2faef65e-4bda-4240-bb5c-0383115f4291" data-type="iframe" />
				</div>
			</div>
		);
	};

	return (
		<LegalLayout>
			<main id="privacy-policy">
				<div className="body legal-document">
					<div className="container">{renderLegal()}</div>
				</div>
			</main>
		</LegalLayout>
	);
}
