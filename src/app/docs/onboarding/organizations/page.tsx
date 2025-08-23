import DocumentFooter from '@components/Documents/DocumentFooter';
import DocumentHeader from '@components/Documents/DocumentHeader';
import PrimaryLayout from '@layout/PrimaryLayout';
import '@styles/globals.sass';

export default function Organizations() {
	return (
		<PrimaryLayout>
			<main id="document" className="column">
				<div className="header">
					<DocumentHeader title="Organizations" size="Small" />
				</div>

				<div className="body bg-white">
					<div className="container-sm">
						<div className="content">
							<div className="document-section column">
								<h2>Overview</h2>
								<p>
									Congrats! You’re officially approved as an Organization. Now let’s finish setting up your page so you
									can start creating event videos.
								</p>
							</div>

							<br />

							<hr />

							<br />

							<div id="access-organization" className="document-section column">
								<h3 className="mb-15">How to Access Your Organization</h3>
								<ol>
									<li>
										<p>Navigate to the Home screen by clicking the Home tab on the bottom of the screen.</p>
									</li>
									<li>
										<p>
											Under "My Organizations", select the Organization you want to access. If you don't see it, pull down the list to refresh.
										</p>
									</li>									
									<li>
										<p>If you're already signed into an Organization, but would like to switch to a different Organization, navigate to the home screen and select the dropdown in the top left of the screen.</p>
									</li>
								</ol>

								<br />

								<p>
									<span className="font-500">Note: </span> 
									If you're already signed into an Organization, but would like to switch to a different Organization, navigate to the Home screen and select the dropdown in the top left of the screen.
								</p>
							</div>

							<br />

							<hr />

							<br />

							<div id="setup-organization" className="document-section column">
								<h3 className="mb-15">Setup Your Organization</h3>
								<p>Add your profile picture, your website, and name your device.</p>
							</div>

							<br />

							<hr />

							<br />

							<div id="team-members" className="document-section column">
								<h3 className="mb-15">Add Team Members</h3>
								<p className="mb-15">Add your profile picture, your website, and name your device.</p>

								<ol>
									<li>
										<p>Navigate to the Team screen by clicking the Team tab on the bottom of the screen.</p>
									</li>
									<li>
										<p>On the top right of the screen, select the "+" sign.</p>
									</li>
									<li>
										<p>Enter the email your team member used during signup to find their account.</p>
									</li>
									<li>
										<p>Select role access. Each role has different permissions.</p>
										<ul>
											<li>
												<p className="font-500">Contributor</p>
												<p>
													Contributors are able to capture event footage. They are not given direct access to the
													Organization. Only Editors and Admins are given access to the Organization dashboard.
												</p>
											</li>

											<li>
												<p className="font-500">Editor</p>
												<p>
													Editors are able to capture event footage, create events, manage events, and generate
													sequences.
												</p>
											</li>

											<li>
												<p className="font-500">Admin</p>
												<p>
													Admins are able to capture event footage, create events, manage events, generate sequences,
													and add and remove additional Team Members.
												</p>
											</li>
										</ul>
									</li>
								</ol>

								<p className="mt-15">
									Once your Organization has two or more team members, you’re all set to shoot your first event!
								</p>
							</div>
						</div>
					</div>

					<DocumentFooter
						prevTitle="Getting Started"
						prevUrl="/docs/onboarding/getting-started"
						nextTitle="Creating Events"
						nextUrl="/docs/onboarding/creating-events"
						size="Small"
					/>
				</div>
			</main>
		</PrimaryLayout>
	);
}
