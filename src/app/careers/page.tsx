// import CareersForm from '@components/Forms/Careers/CareersForm';
import PrimaryLayout from '@layout/PrimaryLayout';
import '@styles/globals.sass';

export default function Careers() {
	return (
		<PrimaryLayout>
			<main id="careers">
				<div className="body">
					<section id="careers-body">
						<div className="body-overlay">
							<div className="container column align-center">
								<div className="column">
									<h1 className="primary-tag">Join Our Team</h1>
								</div>

								<div id="open-positions">
									<div className="careers-body-content column">
										<p className="overview">
											Thank you for your interest in joining the Meddly team! At this time, we do not have any open
											positions available. However, we are always open to connect with passionate and talented
											professionals who are interested in future opportunities with us.
										</p>

										<p className="overview">
											We encourage you to keep an eye on our careers page, as we regularly update it with new available
											positions. Alternatively, feel free to submit your resume below, and we will keep your information
											on file for consideration as soon as relevant positions become available.
										</p>

										<p className="overview">
											Meddly is committed to fostering an inclusive, innovative, and collaborative work environment
											where all team members are valued and can contribute to their fullest potential. We look forward
											to the possibility of working with you!
										</p>
									</div>
								</div>

								<div id="careers-form">
									<div className="flex1 row w100">{/* <CareersForm /> */}</div>
								</div>
							</div>
						</div>
					</section>
				</div>
			</main>
		</PrimaryLayout>
	);
}

Careers.layout = PrimaryLayout;
