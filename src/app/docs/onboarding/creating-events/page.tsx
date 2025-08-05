import DocumentFooter from '@components/Documents/DocumentFooter';
import DocumentHeader from '@components/Documents/DocumentHeader';
import PrimaryLayout from '@layout/PrimaryLayout';
import Link from 'next/link';
import '@styles/globals.sass';

export default function CreatingEvents() {
	return (
		<PrimaryLayout>
			<main id="document" className="column">
				<div className="header">
					<DocumentHeader title="Creating Events" size="Small" />
				</div>

				<div className="body bg-white">
					<div className="container-sm">
						<div className="content">
							<div className="document-section column">
								<h2>Overview</h2>
								<p>
									Event creation is a multi-step process that allows you to create an event and manage it through its
									lifecycle. Start here with understanding the basic steps to create an event.
								</p>
							</div>

							<br />

							<hr />

							<br />

							{/*
						<div className="document-section column">
							<h3 className="mb-15">Event Statuses</h3>
							<p className="mb-15">Event statuses are used to track the progress of an event.</p>

							<ol>
								<li>
									<p className="font-500">Listed</p>
									<p>
										Event has been created and is ready for recording. The event manager can now update the event to
										Event Setup on Camera screen.
									</p>
								</li>

								<li>
									<p className="font-500">Event Setup</p>
									<p>
										Use this time to set up any additional cameras and mobile devices needed to capture the event.
										Connect to the event by selecting the "Select Event" button on the top center of the Camera screen.
									</p>
								</li>

								<li>
									<p className="font-500">In Progress</p>
									<p>The event is currently being recorded.</p>
								</li>

								<li>
									<p className="font-500">Completed</p>
									<p>
										Recording of the event has concluded. Media is being uploaded from mobile devices for processing.
									</p>
								</li>

								<li>
									<p className="font-500">Processing</p>
									<p>Event media is being prepared for Sequence generation.</p>
								</li>

								<li>
									<p className="font-500">Post Production</p>
									<p>
										The event is ready to go. You can now upload pro audio, add extra camera sources, and start creating
										Sequences for playback and download.
									</p>
								</li>

								<li>
									<p className="font-500">Cancelled</p>
									<p>The event has been cancelled. To restore the event, you need to Reschedule.</p>
								</li>

								<li>
									<p className="font-500">Rescheduled</p>
									<p>The event has been rescheduled. The new date and time are displayed on the event page.</p>
								</li>
							</ol>
						</div>

						<br />

						<hr />

						<br />
						*/}

							<div className="document-section column">
								<h3 className="mb-15">Creating an Event</h3>
								<p className="mb-15">How to navigate to the Event creation screen.</p>
								<ol>
									<li>
										<p>Navigate to the Events screen by selecting the Events tab on the bottom right of the screen.</p>
									</li>

									<li>
										<p>Select the "+" button in the top right corner of the screen.</p>
									</li>

									<li>
										<p>
											Fill out all the necessary event details and then select the "Create Event" button at the bottom
											of the screen.
										</p>
										<ul>
											<li>
												<p className="font-500">Event Name</p>
												<p>The name of the event.</p>
											</li>

											<li>
												<p className="font-500">Event Date</p>
												<p>The date of the event.</p>
											</li>

											<li>
												<p className="font-500">Event Time</p>
												<p>The time of the event.</p>
											</li>

											<li>
												<p className="font-500">Event Manager</p>
												<p>
													The Event Manager is in charge of the event. They’re responsible for setting it up and
													controlling the recording. When the Event Manager starts the recording, all connected mobile
													devices will start recording too. When they stop the event, all mobile devices will stop
													recording automatically.
												</p>
											</li>

											<li>
												<p className="font-500">Event Venue</p>
												<p>Search and select the event's venue.</p>
											</li>

											<li>
												<p className="font-500">Cover Image</p>
											</li>
										</ul>
									</li>
								</ol>
							</div>

							<br />

							<br />

							<div className="document-section column">
								<p className="mb-15">
									That's it! Now you're ready to <Link href="/docs/onboarding/recording-events">Record the Event</Link>.
								</p>
							</div>
						</div>
					</div>

					<DocumentFooter
						nextTitle="Recording Events"
						nextUrl="/docs/onboarding/recording-events"
						prevTitle="Organizations"
						prevUrl="/docs/onboarding/organizations"
						size="Small"
					/>
				</div>
			</main>
		</PrimaryLayout>
	);
}
