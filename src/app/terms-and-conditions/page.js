'use client';

import LegalLayout from '@layout/LegalLayout';
import { useEffect } from 'react';
import '@styles/globals.sass';

export default function TermsAndConditions() {
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
					<div name="termly-embed" data-id="5a4698c7-9c59-436c-9c29-89e74a910cec" data-type="iframe" />
				</div>
			</div>
		);
	};

	return (
		<LegalLayout>
			<main id="terms-and-conditions">
				<div className="body legal-document">
					<div className="container">{renderLegal()}</div>
				</div>
			</main>
		</LegalLayout>
	);
}
