import DocumentFooter from '@components/Documents/DocumentFooter';
import DocumentHeader from '@components/Documents/DocumentHeader';
import PrimaryLayout from '@layout/PrimaryLayout';
import '@styles/globals.sass';

export default function EditMediaAndGenerateSequences() {
	return (
		<PrimaryLayout>
			<main id="document" className="column">
				<div className="header">
					<DocumentHeader title="Edit Media & Generate Sequences" size="Small" />
				</div>

				<div className="body bg-white">
					<div className="container-sm">
						<div className="content">
							<div className="document-section column">
								<h2>Overview</h2>
								<p>
									Editing event media gives creators the control to select what media to use for Sequence generation.
									{/* Upload pro-audio, upload additional video from additional devices, and select what media to use for
								Sequence generation. */}
								</p>
							</div>

							<br />

							<hr />

							<br />

							<div id="edit-media" className="document-section column">
								<h3 className="mb-15">Editing Event Media</h3>

								<ol>
									<li>
										<p className="font-500">Go to Events Screen</p>
										<p>Navigate to the Events tab on the bottom right of the screen.</p>
									</li>

									<li>
										<p className="font-500">Select Your Event</p>
										<p>Under the section titled Event Media, you have two options:</p>
										<ul>
											<li>
												<p className="font-500">
													<i>Edit Media</i>
												</p>
												<p>
													View and edit the audio and video clips from your event. Select the media you want to use for
													Sequence generation. Upload additional video.
												</p>
											</li>

											<li>
												<p className="font-500">
													<i>Generate Sequences</i>
												</p>

												<p>
													Click the <i>Generate Sequence</i> button to create a Sequence from the selected media in Edit
													Media. You can generate multiple Sequences from the same event.
												</p>

												<p>
													<span className="font-500">Note:</span> Each event can only have a single sequence being
													generated at a time.
												</p>
											</li>
										</ul>
									</li>
								</ol>
							</div>
						</div>
					</div>

					<DocumentFooter
						// nextTitle="Creating Sequences"
						// nextUrl="/docs/onboarding/creating-sequences"
						prevTitle="Recording Events"
						prevUrl="/docs/onboarding/recording-events"
						size="Small"
					/>
				</div>
			</main>
		</PrimaryLayout>
	);
}
