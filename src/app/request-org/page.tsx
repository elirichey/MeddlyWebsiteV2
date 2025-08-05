import PrimaryLayout from '@layout/PrimaryLayout';
import OrgForm from '@/components/Forms/OrgOnboardingForm/OrgForm';
import '@styles/globals.sass';

export default function RequestOrg() {
	return (
		<PrimaryLayout>
			<main id="contact">
				<div className="body">
					<section id="request-org-body" className="contact-form-body">
						<div className="body-overlay">
							<div className="container column align-center">
								<div className="contact-body-content column">
									<h1 className="primary-tag">Request Organization</h1>
									<p className="overview">
										Please fill out the form below and register as an Organization. Once approved, you'll recieve an
										email notification.
									</p>
								</div>

								<div className="flex1 row w100">
									<div className="column contact-hide-mobile" />

									<div id="contact-form" className="flex1 column org-form">
										<OrgForm />
									</div>

									<div className="column contact-hide-mobile" />
								</div>
							</div>
						</div>
					</section>
				</div>
			</main>
		</PrimaryLayout>
	);
}
