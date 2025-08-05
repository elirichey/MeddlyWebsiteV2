import GeneralContact from '@components/Forms/Contact/GeneralContact';
import PrimaryLayout from '@layout/PrimaryLayout';
import '@styles/globals.sass';

export default function Contact() {
	return (
		<PrimaryLayout>
			<main id="contact">
				<div className="body">
					<section id="contact-body" className="contact-form-body">
						<div className="body-overlay">
							<div className="container column align-center">
								<div className="contact-body-content column">
									<h1 className="primary-tag">Contact Us</h1>
									<p className="overview">
										Please fill out the form below and a team member of our team will reach out to you as soon as
										possible.
									</p>
								</div>

								<div className="flex1 row w100">
									<div className="column contact-hide-mobile" />

									<div id="contact-form" className="flex1 column">
										<GeneralContact />
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
