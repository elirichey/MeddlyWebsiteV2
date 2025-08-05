import DocumentHeader from '@components/Documents/DocumentHeader';
import TroubleshootingList from '@components/Troubleshooting/TroubleshootingList';
import PrimaryLayout from '@layout/PrimaryLayout';
import '@styles/globals.sass';

export default function TroubleshootingIos() {
	return (
		<PrimaryLayout>
			<main id="help" className="column">
				<div className="header">
					<DocumentHeader
						title="Troubleshooting iOS"
						secondaryTitle="Troubleshoot Android"
						secondaryUrl="/docs/devices/troubleshooting-android"
						size="Small"
					/>
				</div>

				<div className="body bg-light">
					<div className="container-sm">
						<div className="content">
							<div className="page-intro mb-30">
								<p>
									Navigating the iOS Troubleshooting page, you're on the right path to resolving any obstacles you may
									encounter while using our mobile application on iOS devices. From unexpected crashes to compatibility
									concerns, our troubleshooting guide is tailored to address a spectrum of issues specific to iOS. Dive
									into the detailed solutions provided below to ensure your app runs smoothly on your Apple device,
									allowing you to make the most of your experience without interruptions.
								</p>
							</div>

							<TroubleshootingList os="iOS" />
						</div>
					</div>
				</div>
			</main>
		</PrimaryLayout>
	);
}
