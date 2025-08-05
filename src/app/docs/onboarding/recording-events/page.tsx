import DocumentFooter from '@components/Documents/DocumentFooter';
import DocumentHeader from '@components/Documents/DocumentHeader';
import PrimaryLayout from '@layout/PrimaryLayout';
import Link from 'next/link';
import '@styles/globals.sass';

export default function RecordingEvents() {
	return (
		<PrimaryLayout>
			<main id="document" className="column">
				<div className="header">
					<DocumentHeader title="Recording Events" size="Small" />
				</div>

				<div className="body bg-white">
					<div className="container-sm">
						<div className="content">
							<div className="document-section column">
								<h2>Overview</h2>
								<p>
									Meddly enables teams to record events on multiple mobile devices at the same time through the mobile
									app.
								</p>

								<p className="mt-15">
									Want to record from a DSLR, drone, or other camera? Soon, Meddly willbe offering support via the
									desktop Admin portal.
									{/* Want to record from a DSLR, drone, or other camera? Meddly supports additional media uploads through the
								desktop <Link href="/auth/login">Admin Portal</Link> after the event is recorded. */}
								</p>
							</div>

							<br />

							<hr />

							<br />

							<div className="document-section column">
								<h3 className="mb-15">Setting Up the Event</h3>
								<p className="mb-15">
									Before you can start recording an event, you need to set it up. Your organization must have at least
									two <Link href="/docs/onboarding/organizations#team-members">Team Members</Link> before you can start
									recording.
								</p>

								<p id="how-to-set-up-event" className="font-500 mb-5">
									How to set up the event:
								</p>

								<ol>
									<li>
										<p className="font-500">Go to Camera Screen</p>
										<p>Navigate to the Camera by selecting the Camera tab on the bottom center of the screen.</p>
									</li>

									<li>
										<p className="font-500">Join Your Event</p>
										<ul>
											<li>
												<p>
													Click the circular <i>Join Event</i> button on the top center of the Camera screen.
												</p>
											</li>
											<li>
												<p>Select the event you want to join by clicking the event card.</p>
											</li>
											<li>
												<p>
													Close the <i>Join Event</i> popup by clicking the same circular button that now displays the
													event cover image.
												</p>
											</li>
										</ul>
									</li>

									<li id="confirm-device-connection">
										<p className="font-500">Make Sure You're Connected</p>
										<p>
											You should see a green bar with the word <i>Connected</i> on the top right of the screen.
										</p>
										<p>
											<span className="font-500">Note:</span> If the green Connected bar isn't visible, try leaving the
											event and rejoining, or close and reopen the app.
										</p>
									</li>

									<li>
										<p className="font-500">Begin Event Setup</p>
										<p>
											Press the green <i>Setup Event</i> button in the lower middle of the screen. This activates the
											event. You can now start setting up additional mobile devices for recording the event.
										</p>
									</li>

									<li>
										<p className="font-500">Setup Additional Mobile evices & Other Cameras</p>
										<p>
											On each additional mobile device, go to the Camera for the respective Organization and join the
											event. When connected to the event, if the event manager starts recording, this device will start
											recording. If the event manager stops recording, this device will stop recording.
										</p>
									</li>
								</ol>
							</div>

							<br />

							<hr />

							<br />

							<div id="recording-the-event" className="document-section column">
								<h3 className="mb-15">Recording the Event</h3>
								<p>
									When the Event Manager starts or stops the recording, they will be prompted to confirm the action.
									When the Event Manager stops the recording, all additional Connected mobile devices will also stop
									recording.
								</p>
							</div>

							<br />

							<hr />

							<br />

							<div className="document-section column">
								<h3 className="mb-15">Your event has been recorded!</h3>
								<p>The videos are saved right to your device and automatically uploaded for processing.</p>
							</div>

							<br />

							<hr />

							<br />

							<div className="document-section column">
								<h3 className="mb-15 txt-red">Event Media Processing</h3>
								<p>
									Once the event is recorded, the videos are automatically uploaded for processing. Once everything's
									processed, you’ll be all set to start creating Sequences for your event. This step might take a few
									minutes, so please be patient.
								</p>
							</div>
						</div>
					</div>

					<DocumentFooter
						nextTitle="Edit Media & Generate Sequences"
						nextUrl="/docs/onboarding/edit-and-generate"
						prevTitle="Creating Events"
						prevUrl="/docs/onboarding/creating-events"
						size="Small"
					/>
				</div>
			</main>
		</PrimaryLayout>
	);
}
