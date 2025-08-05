import DocumentFooter from '@components/Documents/DocumentFooter';
import DocumentHeader from '@components/Documents/DocumentHeader';
import PrimaryLayout from '@layout/PrimaryLayout';
import Image from 'next/image';
import Link from 'next/link';
import '@styles/globals.sass';

export default function GettingStarted() {
	const appleAppStoreUrl = 'https://apps.apple.com/us/app/meddly/id6670494632';
	const androidAppStoreUrl = 'https://play.google.com/store/apps/details?id=app.meddly';

	return (
		<PrimaryLayout>
			<main id="document" className="column">
				<div className="header">
					<DocumentHeader title="Getting Started" size="Small" />
				</div>

				<div className="body bg-white">
					<div className="container-sm">
						<div className="content">
							<div className="document-section column">
								<h2>1. Download Meddly</h2>

								<p>
									Meddly is available on the App Store and Google Play. You can download the app by tapping the app
									store buttons below.
								</p>

								<div id="download-buttons" className="row">
									<div className="flex1 column">
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
									</div>

									<div className="flex1 column">
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
							</div>

							<br />

							<hr />

							<br />

							<div className="document-section column">
								<h2>2. Create An Account</h2>
								<p>
									Once you've downloaded the app, you'll need to create an account. This is your personal account and
									will be used to access all of your Meddly organizations.
								</p>
							</div>

							<br />

							<hr />

							<br />

							<div className="document-section column">
								<h2>3. Request Organization</h2>
								<p>
									Please fill out the{' '}
									<Link href="/request-org" target="_blank">
										Request Organization
									</Link>{' '}
									form to apply. Once approved, you'll recieve an email welcoming you to Meddly as a member of an
									Organization.
								</p>
							</div>
						</div>
					</div>

					<DocumentFooter nextTitle="Organizations" nextUrl="/docs/onboarding/organizations" size="Small" />
				</div>
			</main>
		</PrimaryLayout>
	);
}
