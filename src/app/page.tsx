import CashIcon from '@icons/CashIcon';
import ChevronRight from '@icons/ChevronRight';
import GlassesIcon from '@icons/GlassesIcon';
import VantagePoints from '@icons/VantagePoints';
import Image from 'next/image';
import Link from 'next/link';
import HandIcon from '@/components/Icons/HandIcon';
import PrimaryLayout from '@/layout/PrimaryLayout';
import '@styles/globals.sass';

export default function Home() {
	const appleAppStoreUrl = 'https://apps.apple.com/us/app/meddly/id6670494632';
	const androidAppStoreUrl = 'https://play.google.com/store/apps/details?id=app.meddly';

	return (
		<PrimaryLayout>
			<main id="artists">
				<div className="body home">
					<div id="artists-hero">
						<video id="background-video" autoPlay muted loop poster="/video/web-720p.webp">
							<source src="/video/web-720p.webm" type="video/webm" />
						</video>

						<div className="overlay">
							<div className="container">
								<div className="artists-hero-content flex1 column">
									<h1 className="primary-tag">
										Crowdsourced Event Video <span>&</span> <br />
										Auto-Generated Video Productions
									</h1>
								</div>
							</div>
						</div>
					</div>

					<div id="user-overview">
						<div className="container">
							<div className="flex1 row">
								<div className="column justify-center">
									<h2>Introducing Meddly</h2>
									<p>
										Meddly helps artists and event organizers capture, package, and release complete recordings of every
										event.
									</p>

									<br />

									<p>
										Our mission is to make recording events fast, easy, and cost efficient. Create an event, setup
										cameras, generate sequences, and publish the event so fans can enjoy each performance for years to
										come.
									</p>

									<a className="get-started-btn" href="#event-rundown">
										How It Works
										<ChevronRight className="right-icon" />
									</a>
								</div>
								<div className="column flex1 justify-center align-center">
									<div className="image">
										<Image src="/image/webp/devices/app-preview.webp" height={1826} width={1200} alt="App Preview" />
									</div>
								</div>
							</div>
						</div>
					</div>

					<div id="user-why-meddly" className="relative">
						<div className="absolute-image desktop">
							<Image
								src="/image/webp/devices/horizontal-hand-recording.webp"
								height={1157}
								width={1928}
								alt="App Recording Event"
							/>
						</div>

						<div className="absolute-image mobile">
							<Image
								src="/image/webp/devices/vertical-hand-recording.webp"
								height={1928}
								width={1157}
								alt="App Recording Event"
							/>
						</div>

						<div className="container column">
							<div className="row mobile-row">
								<div className="flex1 column" />

								<div className="flex1 column">
									<h4 className="title">
										Everyone has a cell phone. <br />
										Put them to use!
									</h4>

									<p className="txt-dk-blue bold">
										{`Renting camera equipment and hiring a production
                  team is expensive.`}
									</p>

									<p className="txt-dk-blue">
										Meddly simplifies event recording by empowering teams to use a range of devices, including
										smartphones, digital cameras, drones, and professional-grade equipment.
									</p>

									<br />

									<p className="txt-dk-blue">
										Given that many people own personal recording devices and almost everyone has a phone, Meddly makes
										it effortless to harness the technology in people's pockets for creating high-quality recordings.
									</p>

									<h5>Get the more out of every event. Use Meddly</h5>

									<a className="get-started-btn" href="#user-how-it-works">
										Get Started
										<ChevronRight className="right-icon" />
									</a>
								</div>
							</div>
						</div>
					</div>

					<div id="event-rundown">
						<div className="container">
							<div className="flex1 column">
								<h3>How It Works</h3>
								<div className="row align-start mobile-column flex-wrap">
									<div className="event-step">
										<h4>1. Create an Event</h4>
										<p>Assign the date, time, location, Event Manager, and more.</p>
									</div>

									<div className="event-step">
										<h4>2. Setup Mobile Devices</h4>
										<p>Setup additional mobile devices. Go to Camera, connect to the event.</p>
									</div>

									<div className="event-step">
										<h4>3. Start Recording</h4>
										<p>When the event starts, all setup mobile devices start recording.</p>
									</div>

									<div className="event-step">
										<h4>4. Stop Recording</h4>
										<p>When the event ends, all mobile devices stop recording.</p>
									</div>

									<div className="event-step">
										<h4>5. Generate Sequences</h4>
										<p>Customize sequence productions with the press of a button.</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div id="video-examples">
						<div className="container">
							<div className="flex1 column">
								<h3>Example Meddly Event</h3>
								<div className="row">
									<iframe
										className="meddly-example-video"
										width="1035"
										height="582"
										src="https://www.youtube.com/embed/LbrCULZeZEw"
										title="Meddly&#39;s First Event - Clayton Anderson at Winners"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
										referrerPolicy="strict-origin-when-cross-origin"
										allowFullScreen
									/>
								</div>

								<div className="row">
									<div className="flex1 column">
										<p>
											The goal was to test media capture and uploading on both iOS and Android devices. The Android user
											appears front and center, while the iOS user is positioned further back and off to the side.
										</p>

										<p>Camera angles start changing around the 0:26 second mark.</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div id="user-liner-note" className="column">
						<div className="background-image" />
						<div className="content container">
							<div className="row my-30">
								<h3>
									We Help <span>You</span>
									<br /> Give Fans More
								</h3>
							</div>

							<div className="row mobile-column align-start justify-center my-30">
								<div className="flex1 column align-center justify-center mx-10">
									<div className="card">
										<div className="icon-outline">
											<HandIcon className="ticket-icon" />
										</div>

										<p className="txt-dk-blue text-center">
											<b>Control recording</b> of many mobile devices with the press of a button.
										</p>
									</div>
								</div>

								<div className="flex1 column align-center justify-center mx-10">
									<div className="card">
										<div className="icon-outline">
											<VantagePoints className="immersive-experience-icon" />
										</div>

										<p className="txt-dk-blue text-center">
											Mix mobile devices and pro video. Create <b>collaborative events</b>.
										</p>
									</div>
								</div>

								<div className="flex1 column align-center justify-center mx-10">
									<div className="card">
										<div className="icon-outline">
											<GlassesIcon className="glasses-icon" />
										</div>

										<p className="txt-dk-blue text-center">
											<b>Automate video sequencing</b> to simplify video editing and post-production.
										</p>
									</div>
								</div>

								<div className="flex1 column align-center justify-center mx-10">
									<div className="card">
										<div className="icon-outline">
											<CashIcon className="cash-icon" />d
										</div>

										<p className="txt-dk-blue text-center">
											<b>Download</b> your event media for selling to fans or posting on social channels.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div id="user-how-it-works" className="column">
						<div className="user-onboarding background">
							<div className="container-xmd row mobile-column">
								<div className="flex2 column text-center align-center mx-10">
									<h3 className="sub-title">Get Started</h3>
									<p>Download the Meddly mobile app and create your account.</p>

									<div className="download-buttons">
										<div className="app-store-container">
											<Link href={appleAppStoreUrl} target="_blank">
												<Image
													src="/svg/logo/app-stores/download-on-the-app-store.svg"
													height={80}
													width={230}
													alt="Download in the App Store"
												/>
											</Link>
										</div>

										<div className="app-store-container">
											<Link href={androidAppStoreUrl} target="_blank">
												<Image
													src="/svg/logo/app-stores/google-play-download-android-app.svg"
													height={80}
													width={230}
													alt="Download on Google Play"
												/>
											</Link>
										</div>
									</div>
								</div>

								<div className="flex1 column text-center mx-10">
									<h3 className="sub-title">Documentation</h3>
									<p>Learn how to record, edit, and create videos with Meddly.</p>

									<div className="get-started-btn-container">
										<Link href="/docs" className="get-started-btn">
											Read Documentation
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* <div id="become-a-meddly-user">
					<div className="body-overlay">
						<div className="user-cta-container container column align-center">
							<div className="become-a-meddly-user-content flex1 column">
								<h3 className="primary-tag">Organization Registration</h3>
								<p className="overview">
									Are you an user or event organizer? To get started, simply complete the registration form below to
									register your organization.
								</p>
							</div>

							<div className="artists-onboarding-form row">
								<div className="flex1 column become-an-user-hide-mobile" />

								<div id="become-an-user-form" className="flex1 column">
									<OrgForm />
								</div>

								<div className="flex1 column become-an-user-hide-mobile" />
							</div>
						</div>
					</div>
				</div> */}
				</div>
			</main>
		</PrimaryLayout>
	);
}
